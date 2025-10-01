// src/app/api/admin/sellers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all sellers
    const sellers = await User.find({ role: 'seller' })
        .select('-password')
        .lean();

        const enrichedSellers = await Promise.all(
        sellers.map(async (seller: any) => {
            const productCount = await Product.countDocuments({ seller: seller._id });

            const orders = await Order.find({ 'items.seller': seller._id }).lean();

            let totalSales = 0;
            let totalRevenue = 0;

            orders.forEach((order: any) => {
            order.items.forEach((item: any) => {
                if (item.seller.toString() === seller._id.toString()) {
                totalSales += item.quantity;
                totalRevenue += item.subtotal;
                }
            });
            });

            return {
            ...seller,
            productCount,
            totalSales,
            totalRevenue,
            };
        })
    );

    return NextResponse.json({
      success: true,
      data: enrichedSellers,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get sellers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}