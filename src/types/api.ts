import { Doctor, Hospital, Patient, Appointment } from './medical';
import { NavigationStep, Checkpoint } from './navigation';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DoctorSearchParams {
  specialty?: string;
  department?: string;
  hospitalId?: number;
  availability?: boolean;
  rating?: number;
  experience?: string;
  language?: string;
}

export interface HospitalSearchParams {
  type?: string;
  specialty?: string;
  distance?: number;
  emergencyServices?: boolean;
  rating?: number;
  insurance?: string;
}

export interface AppointmentRequest {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  hospital_id: string;
  hospital_name: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  hospital_email: string;
  dr_email: string;
}

export interface QueueStatus {
  patientId: number;
  position: number;
  estimatedWaitTime: string;
  totalInQueue: number;
  doctorId: number;
  lastUpdated: string;
}

export interface SymptomAssessment {
  symptoms: string[];
  severity: number;
  duration: string;
  additionalInfo?: string;
  suggestedSpecialty?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

export interface HospitalSearchRequest {
  sessionId: string;
  symptoms: string;
  onset: string;
  location: {
    lat: number;
    lng: number;
  };
  preference: string;
  insuranceRef: boolean;
  department: string;
}

export interface HospitalSearchResponse {
  origin: {
    lat: number;
    lng: number;
  };
  destination_addresses: string[];
  origin_addresses: string[];
  top8: Array<{
    id: string;
    name: string;
    address: string;
    location_in_latidude_and_longitude: {
      lat: number;
      lng: number;
    };
    phone: string;
    website: string;
    hospital_type: string;
    distance_km_from_user_location: number;
    current_queue_people: number;
    avg_wait_minutes: number;
    doctors_available: number;
    ranking_score: number;
    from_user_location: {
      lat: number;
      lng: number;
    };
    traffic: {
      status: string;
      distance_text: string;
      distance_meters: number;
      duration_text: string;
      duration_seconds: number;
      duration_in_traffic_text: string;
      duration_in_traffic_seconds: number;
    };
    travel_min_in_traffic: number;
    eta_total_min: number;
  }>;
}