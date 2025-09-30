// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const order = await Order.findById(params.id)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'title images category',
      })
      .populate('items.seller', 'name email');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    const isBuyer = order.buyer._id.toString() === decoded.userId;
    const isSeller = order.items.some(
      (item: any) => item.seller._id.toString() === decoded.userId
    );
    const isAdmin = decoded.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { order },
    });
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { status, cancelReason } = await request.json();

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Authorization checks
    const isBuyer = order.buyer.toString() === decoded.userId;
    const isSeller = order.items.some(
      (item: any) => item.seller.toString() === decoded.userId
    );
    const isAdmin = decoded.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update order
    order.status = status;
    if (cancelReason) {
      order.cancelReason = cancelReason;
    }
    if (status === 'completed') {
      order.completedAt = new Date();
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: { order },
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}