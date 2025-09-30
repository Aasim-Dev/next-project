import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({
        success: true,
        data: { count: 0 },
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const cart = await Cart.findOne({ user: decoded.userId });
    const count = cart ? cart.items.length : 0;

    return NextResponse.json({
      success: true,
      data: { count },
    });
  } catch (error: any) {
    console.error('Get cart count error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart count' },
      { status: 500 }
    );
  }
}