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