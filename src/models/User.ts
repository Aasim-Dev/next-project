import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserProfileSchema = new Schema({
  bio: { type: String, maxLength: 500 },
  avatar: { type: String },
  phone: { type: String },
  location: { type: String },
  website: { type: String },
});

const PriceRangeSchema = new Schema({
  min: { type: Number, required: true, min: 0 },
  max: { type: Number, required: true, min: 0 },
  currency: { 
    type: String, 
    enum: ['USD', 'EUR', 'GBP', 'INR'], 
    default: 'USD' 
  },
  per: { 
    type: String, 
    enum: ['hour', 'day', 'event', 'photo'], 
    default: 'hour' 
  },
});

const TimeSlotSchema = new Schema({
  start: { type: String, required: true }, // HH:mm format
  end: { type: String, required: true },   // HH:mm format
});

const AvailabilitySchema = new Schema({
  weekDays: [{ type: Number, min: 0, max: 6 }], // 0-6 for Sunday to Saturday
  timeSlots: [TimeSlotSchema],
  blackoutDates: [{ type: Date }],
});

const PortfolioItemSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'street', 'product', 'real-estate', 'headshots'],
    required: true 
  },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
});

const PhotographerProfileSchema = new Schema({
  ...UserProfileSchema.obj,
  businessName: { type: String },
  specialties: [{
    type: String,
    enum: ['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'street', 'product', 'real-estate', 'headshots']
  }],
  experience: { type: Number, required: true, min: 0 },
  priceRange: { type: PriceRangeSchema, required: true },
  availability: { type: AvailabilitySchema },
  portfolio: [PortfolioItemSchema],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  equipment: [String],
  serviceAreas: [String],
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    required: [true, 'Role is required'],
  },
  profile: {
    type: UserProfileSchema,
    default: {},
  },
  photographerProfile: {
    type: PhotographerProfileSchema,
    required: function() {
      return this.role === 'seller';
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'photographerProfile.specialties': 1 });
UserSchema.index({ 'photographerProfile.serviceAreas': 1 });
UserSchema.index({ 'photographerProfile.rating': -1 });

export default models.User || model('User', UserSchema);