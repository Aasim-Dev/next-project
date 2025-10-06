// src/app/api/admin/buyers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
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

    // Fetch all buyers
    const buyers = await User.find({ role: 'buyer' })
      .select('name email profile isVerified createdAt')
      .lean();

    // Get order statistics for each buyer
    const buyersWithStats = await Promise.all(
      buyers.map(async (buyer) => {
        const orders = await Order.find({ buyer: buyer._id });
        const orderCount = orders.length;
        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        return {
          ...buyer,
          orderCount,
          totalSpent,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: buyersWithStats,
    });
  } catch (error: any) {
    console.error('Get buyers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch buyers' },
      { status: 500 }
    );
  }
}