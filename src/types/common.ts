export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ContactInfo {
  phone: string;
  email?: string;
  website?: string;
  fax?: string;
}

export interface Rating {
  score: number;
  totalReviews: number;
  breakdown?: {
    [key: number]: number; // rating value -> count
  };
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  type?: 'consultation' | 'emergency' | 'surgery';
}

export interface OperatingHours {
  [day: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type UserRole = 'patient' | 'doctor' | 'admin' | 'staff';