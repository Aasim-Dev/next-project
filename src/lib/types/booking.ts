export interface Booking {
  _id: string;
  photographer: string | Photographer; // ObjectId or populated
  client: string | User;               // ObjectId or populated
  eventType: PhotographySpecialty;
  eventDate: Date;
  duration: number; // hours
  location: BookingLocation;
  description?: string;
  requirements?: string[];
  budget: number;
  finalPrice?: number;
  status: BookingStatus;
  clientMessage?: string;
  photographerResponse?: string;
  contract?: ContractDetails;
  payment?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface BookingLocation {
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ContractDetails {
  terms: string;
  deliverables: string[];
  timeline: string;
  cancellationPolicy: string;
  signedAt?: Date;
  clientSignature?: string;
  photographerSignature?: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: 'card' | 'bank-transfer' | 'paypal' | 'cash';
  status: 'pending' | 'paid' | 'refunded' | 'disputed';
  transactionId?: string;
  paidAt?: Date;
  deposit?: {
    amount: number;
    paidAt: Date;
  };
}

export interface BookingRequest {
  photographerId: string;
  eventType: PhotographySpecialty;
  eventDate: string; // ISO date string
  duration: number;
  location: BookingLocation;
  description?: string;
  requirements?: string[];
  budget: number;
  message?: string;
}