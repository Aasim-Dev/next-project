import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// GET: Fetch all products (with filters for marketplace)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sellerId = searchParams.get('sellerId');
    const status = searchParams.get('status') || 'active';

    // Build query
    let query: any = {};

    // Filter by status (for marketplace, only show active)
    if (status) {
      query.status = status;
    }

    // Filter by seller (for seller's own products)
    if (sellerId) {
      query.seller = sellerId;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Create new product (Seller only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user is seller
    if (decoded.role !== 'seller') {
      return NextResponse.json(
        { success: false, error: 'Only sellers can create products' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, price, location, images, status } = body;

    // Validation
    if (!title || !description || !category || !price || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      title,
      description,
      category,
      price,
      location,
      images: images || [{ url: '📸' }], // Default emoji if no image
      status: status || 'active',
      seller: decoded.userId,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}