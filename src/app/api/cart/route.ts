// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

// GET: Get user's cart
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

    let cart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      })
      .lean();

    if (!cart) {
      cart = { user: decoded.userId, items: [] };
    }

    return NextResponse.json({
      success: true,
      data: cart,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST: Add item to cart
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
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      cart = await Cart.create({
        user: decoded.userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, addedAt: new Date() });
      }

      await cart.save();
    }

    // Populate and return updated cart
    cart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Product added to cart',
      data: cart,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add product to cart' },
      { status: 500 }
    );
  }
}

// PUT: Update cart item quantity
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
    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: decoded.userId });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Product not in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      data: updatedCart,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE: Remove item from cart
export async function DELETE(request: NextRequest) {
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
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: decoded.userId });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Product removed from cart',
      data: updatedCart,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove product from cart' },
      { status: 500 }
    );
  }
}