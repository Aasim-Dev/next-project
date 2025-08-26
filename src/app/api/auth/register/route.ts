import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations/auth';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate input
    try {
      await registerSchema.validate(body);
    } catch (validationError: any) {
      return NextResponse.json(
        { success: false, error: validationError.message },
        { status: 400 }
      );
    }
    
    const { name, email, password, role } = body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 }
      );
    }
    
    // Create user data
    const userData: any = {
      name,
      email,
      password,
      role,
      profile: {},
    };
    
    // If photographer, initialize photographer profile
    if (role === 'seller') {
      userData.photographerProfile = {
        specialties: [],
        experience: 0,
        priceRange: {
          min: 0,
          max: 0,
          currency: 'USD',
          per: 'hour'
        },
        availability: {
          weekDays: [1, 2, 3, 4, 5], // Monday to Friday
          timeSlots: [{ start: '09:00', end: '17:00' }],
          blackoutDates: []
        },
        portfolio: [],
        serviceAreas: [],
      };
    }
    
    // Create user
    const user = await User.create(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          }
        }
      },
      { status: 201 }
    );
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}