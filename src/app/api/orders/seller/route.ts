// src/app/api/orders/seller/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

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

    if (decoded.role !== 'seller') {
      return NextResponse.json(
        { success: false, error: 'Only sellers can access this endpoint' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query - find orders that have items from this seller
    let query: any = {
      'items.seller': decoded.userId
    };

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

    // Filter items to only show items sold by this seller
    const filteredOrders = orders.map(order => ({
      ...order,
      items: order.items.filter((item: any) => 
        item.seller._id.toString() === decoded.userId
      ),
      // Recalculate total for seller's items only
      totalAmount: order.items
        .filter((item: any) => item.seller._id.toString() === decoded.userId)
        .reduce((sum: number, item: any) => sum + item.subtotal, 0)
    }));

    return NextResponse.json({
      success: true,
      data: filteredOrders,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get seller orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}