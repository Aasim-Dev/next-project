export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
}