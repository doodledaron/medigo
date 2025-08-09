export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  department: string;
  rating: number;
  patientsInQueue: number;
  estimatedWait: string;
  availableSlots: string[];
  experience: string;
  languages: string[];
  image: string;
  education?: string;
  certifications?: string[];
  consultationFee?: number;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  type: string;
  specialties: string[];
  rating: number;
  distance: string;
  phone: string;
  emergencyServices: boolean;
  image?: string;
  operatingHours?: string;
  facilities?: string[];
  insurance?: string[];
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  queuePosition?: number;
  estimatedTime?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Appointment {
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
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  specialties: string[];
  color: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  date: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  doctorId: number;
}