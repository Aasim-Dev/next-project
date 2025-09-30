// src/models/Product.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minLength: [3, 'Title must be at least 3 characters'],
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters'],
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    enum: ['wedding', 'portrait', 'event', 'product', 'real-estate', 'fashion', 'commercial', 'other'],
    required: [true, 'Category is required'],
  },
  images: [{
    url: String,
    publicId: String,
  }],
  location: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in hours
    default: 1,
  },
  deliverables: [String],
  tags: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
ProductSchema.index({ seller: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });

export default models.Product || model('Product', ProductSchema);