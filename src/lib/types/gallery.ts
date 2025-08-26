export interface Gallery {
  _id: string;
  title: string;
  description: string;
  photographer: string | Photographer;
  category: PhotographySpecialty;
  images: GalleryImage[];
  coverImage?: GalleryImage;
  isPublic: boolean;
  tags: string[];
  likes: string[]; // User IDs
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  publicId: string; // Cloudinary public ID
  caption?: string;
  tags: string[];
  order: number;
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number; // bytes
  camera?: string;
  lens?: string;
  settings?: CameraSettings;
  location?: string;
  takenAt?: Date;
}

export interface CameraSettings {
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: string;
}

export interface GalleryFilters {
  category?: PhotographySpecialty;
  tags?: string[];
  photographer?: string;
  featured?: boolean;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'views';
}