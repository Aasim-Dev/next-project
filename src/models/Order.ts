// src/models/Order.ts
import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank-transfer', 'cash'],
  },
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  notes: String,
  cancelReason: String,
  completedAt: Date,
}, {
  timestamps: true,
});

// Generate unique order ID
OrderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

OrderSchema.index({ buyer: 1 });
OrderSchema.index({ 'items.seller': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default models.Order || model('Order', OrderSchema);