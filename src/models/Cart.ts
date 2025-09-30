// src/models/Cart.ts
import mongoose, { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Calculate total amount before saving
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

CartSchema.index({ user: 1 });

export default models.Cart || model('Cart', CartSchema);