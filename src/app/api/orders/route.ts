// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';
import jwt from 'jsonwebtoken';

// GET: Fetch orders (role-based)
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

    // Role-based filtering
    if (decoded.role === 'buyer') {
      query.buyer = decoded.userId;
    } else if (decoded.role === 'seller') {
      query.seller = decoded.userId;
    }
    // Admin can see all orders (no filter)

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title price images category')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST: Create new order (Buyer only)
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

    const { productId, quantity = 1, deliveryDate } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const amount = product.price * quantity;

    // Create order
    const order = await Order.create({
      buyer: decoded.userId,
      seller: product.seller,
      product: productId,
      quantity,
      amount,
      deliveryDate: deliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Update product sales
    product.sales += quantity;
    await product.save();

    // Remove from cart if exists
    await Cart.updateOne(
      { user: decoded.userId },
      { $pull: { items: { product: productId } } }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title price images category');

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

// PUT: Update order status
export async function PUT(request: NextRequest) {
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
    const { orderId, status, notes } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (decoded.role === 'seller' && order.seller.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this order' },
        { status: 403 }
      );
    }

    if (decoded.role === 'buyer' && order.buyer.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this order' },
        { status: 403 }
      );
    }

    order.status = status;
    if (notes) order.notes = notes;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title price images category');

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}