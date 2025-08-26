export interface PhotographerProfile extends UserProfile {
  businessName?: string;
  specialties: PhotographySpecialty[];
  experience: number; // years
  priceRange: PriceRange;
  availability: AvailabilitySettings;
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  equipment?: string[];
  serviceAreas: string[];
}

export interface Photographer extends User {
  profile: PhotographerProfile;
  role: 'seller';
}

export type PhotographySpecialty = 
  | 'wedding'
  | 'portrait'
  | 'event'
  | 'commercial'
  | 'fashion'
  | 'landscape'
  | 'street'
  | 'product'
  | 'real-estate'
  | 'headshots';

export interface PriceRange {
  min: number;
  max: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  per: 'hour' | 'day' | 'event' | 'photo';
}

export interface AvailabilitySettings {
  weekDays: number[]; // 0-6, Sunday to Saturday
  timeSlots: TimeSlot[];
  blackoutDates: Date[];
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: PhotographySpecialty;
  tags: string[];
  isFeatured: boolean;
}