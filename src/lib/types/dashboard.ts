export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  galleryViews: number;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingUpdates: boolean;
  messageNotifications: boolean;
  marketingEmails: boolean;
}