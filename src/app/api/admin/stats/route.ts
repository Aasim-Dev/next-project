// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    // Fetch statistics
    const [
      totalSellers,
      totalBuyers,
      totalOrders,
      totalProducts,
      pendingOrders,
      completedOrders,
      recentSellers,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'seller' }),
      User.countDocuments({ role: 'buyer' }),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      User.find({ role: 'seller' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt'),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('buyer', 'name email')
        .populate('items.seller', 'name email'),
    ]);

    // Calculate total revenue
    const orders = await Order.find({ status: 'completed' });
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        totalSellers,
        totalBuyers,
        totalOrders,
        totalProducts,
        totalRevenue,
        pendingOrders,
        completedOrders,
        recentSellers,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}