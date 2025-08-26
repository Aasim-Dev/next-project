export interface Review {
  _id: string;
  booking: string | Booking;
  reviewer: string | User;
  photographer: string | Photographer;
  rating: number; // 1-5
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  isVerified: boolean;
  photographerResponse?: string;
  images?: string[]; // URLs of review images
  createdAt: Date;
  updatedAt: Date;
}

// src/lib/types/common.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchFilters {
  query?: string;
  location?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  specialty?: PhotographySpecialty[];
  rating?: number;
  experience?: number;
  availability?: {
    startDate: Date;
    endDate: Date;
  };
}
