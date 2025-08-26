export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  profile: UserProfile;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  website?: string;
}