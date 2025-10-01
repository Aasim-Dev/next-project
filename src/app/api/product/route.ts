// src/app/api/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

// GET: Fetch all products (with filters for marketplace)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sellerId = searchParams.get('sellerId');
    const status = searchParams.get('status');

    // Build query
    let query: any = {};

    // Filter by seller (for seller's own products)
    if (sellerId) {
      query.seller = sellerId;
    } else {
      // For marketplace, only show active products
      query.isActive = true;
    }

    // Filter by status (for seller's dashboard)
    if (status && sellerId) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
      // 'all' means no status filter
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
    const { 
      title, 
      description, 
      category, 
      price, 
      location, 
      duration,
      deliverables,
      tags,
      status
    } = body;

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
      duration: duration || 1,
      deliverables: deliverables || [],
      tags: tags || [],
      images: [{ url: '/placeholder-image.jpg' }], // Default emoji
      isActive: status === 'active',
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

// PUT: Update product (Seller only)
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

    const body = await request.json();
    const { productId, ...updateData } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if seller owns this product
    if (product.seller.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this product' },
        { status: 403 }
      );
    }

    // Update product
    Object.assign(product, updateData);
    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate('seller', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE: Delete product (Seller only)
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

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if seller owns this product
    if (product.seller.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this product' },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}