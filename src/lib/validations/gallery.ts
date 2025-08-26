import * as yup from 'yup';

export const gallerySchema = yup.object({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .required('Description is required'),
  category: yup
    .string()
    .oneOf(['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'street', 'product', 'real-estate', 'headshots'])
    .required('Category is required'),
  tags: yup
    .array()
    .of(yup.string())
    .min(1, 'Please add at least one tag')
    .max(10, 'Cannot have more than 10 tags')
    .required('Tags are required'),
  isPublic: yup
    .boolean()
    .required('Please specify if gallery is public'),
});

export const imageUploadSchema = yup.object({
  caption: yup
    .string()
    .max(200, 'Caption cannot exceed 200 characters')
    .optional(),
  tags: yup
    .array()
    .of(yup.string())
    .max(10, 'Cannot have more than 10 tags per image')
    .optional(),
});

// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export const uploadToCloudinary = async (
  file: string | Buffer,
  folder: string = 'photographer-platform',
  transformation?: any
): Promise<CloudinaryUploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation,
      resource_type: 'auto',
    });
    
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

export const generateThumbnail = (publicId: string, width: number = 300, height: number = 200): string => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
};

// src/lib/utils/constants.ts
export const PHOTOGRAPHY_SPECIALTIES = [
  { value: 'wedding', label: 'Wedding Photography' },
  { value: 'portrait', label: 'Portrait Photography' },
  { value: 'event', label: 'Event Photography' },
  { value: 'commercial', label: 'Commercial Photography' },
  { value: 'fashion', label: 'Fashion Photography' },
  { value: 'landscape', label: 'Landscape Photography' },
  { value: 'street', label: 'Street Photography' },
  { value: 'product', label: 'Product Photography' },
  { value: 'real-estate', label: 'Real Estate Photography' },
  { value: 'headshots', label: 'Headshots & Business Portraits' },
] as const;

export const USER_ROLES = [
  { value: 'buyer', label: 'Client (Hire Photographers)' },
  { value: 'seller', label: 'Photographer (Offer Services)' },
] as const;

export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'accepted', label: 'Accepted', color: 'blue' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'confirmed', label: 'Confirmed', color: 'green' },
  { value: 'in-progress', label: 'In Progress', color: 'purple' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
  { value: 'disputed', label: 'Disputed', color: 'red' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
] as const;

export const PRICE_UNITS = [
  { value: 'hour', label: 'Per Hour' },
  { value: 'day', label: 'Per Day' },
  { value: 'event', label: 'Per Event' },
  { value: 'photo', label: 'Per Photo' },
] as const;

export const PAGINATION_LIMITS = {
  galleries: 12,
  photographers: 8,
  bookings: 10,
  reviews: 5,
} as const;