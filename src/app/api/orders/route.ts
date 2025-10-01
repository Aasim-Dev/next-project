// src/app/api/orders/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';
import jwt from 'jsonwebtoken';

// GET: Fetch buyer's orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};

    // Buyers see only their orders
    if (decoded.role === 'buyer') {
      query.buyer = decoded.userId;
    } 
    // Sellers should use /api/orders/seller endpoint
    else if (decoded.role === 'seller') {
      return NextResponse.json(
        { success: false, error: 'Sellers should use /api/orders/seller endpoint' },
        { status: 403 }
      );
    }
    // Admin can see all orders
    else if (decoded.role === 'admin') {
      // No filter - see all orders
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'title images category'
      })
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: { orders },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST: Create new order from cart (Buyer only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'buyer') {
      return NextResponse.json(
        { success: false, error: 'Only buyers can create orders' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { cartItems, shippingAddress, paymentMethod, notes } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Build order items with seller info
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.product} not found` },
          { status: 404 }
        );
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        seller: product.seller,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal
      });
    }

    // Create order
    const order = await Order.create({
      buyer: decoded.userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'card',
      shippingAddress,
      notes,
    });

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { user: decoded.userId },
      { $set: { items: [] } }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'title images category'
      })
      .populate('items.seller', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}