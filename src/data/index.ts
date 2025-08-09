// Export all data collections
export * from './doctors';
export * from './hospitals';
export * from './departments';
export * from './symptoms';
export * from './navigation';

// Mock patient data
export const mockPatients = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    condition: 'Hypertension follow-up',
    queuePosition: 2,
    estimatedTime: '15 minutes',
    priority: 'medium' as const
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    age: 32,
    condition: 'Chest pain assessment',
    queuePosition: 1,
    estimatedTime: '5 minutes',
    priority: 'high' as const
  },
  {
    id: 3,
    name: 'Michael Chen',
    age: 28,
    condition: 'Routine check-up',
    queuePosition: 4,
    estimatedTime: '25 minutes',
    priority: 'low' as const
  }
];

// Mock appointment data
export const mockAppointments = [
  {
    id: 'BK_SAMPLE1',
    patient_name: 'John Doe',
    patient_email: 'john.doe@email.com',
    patient_phone: '+65-9123-4567',
    hospital_id: 'HSP001',
    hospital_name: 'Singapore General Hospital',
    doctor_id: 'DOC001',
    doctor_name: 'Dr. Michael Johnson',
    department: 'cardiology',
    appointment_date: '2025-01-15',
    appointment_time: '14:30',
    notes: 'Patient reports intermittent chest pain for the past week',
    hospital_email: 'appointments@sgh.com.sg',
    dr_email: 'michael.johnson@sgh.com.sg',
    status: 'scheduled' as const,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'BK_SAMPLE2',
    patient_name: 'Sarah Wilson',
    patient_email: 'sarah.wilson@email.com',
    patient_phone: '+65-8765-4321',
    hospital_id: 'HSP001',
    hospital_name: 'Singapore General Hospital',
    doctor_id: 'DOC002',
    doctor_name: 'Dr. Emily Chen',
    department: 'neurology',
    appointment_date: '2025-01-15',
    appointment_time: '15:00',
    notes: 'Follow-up for migraine treatment',
    hospital_email: 'appointments@sgh.com.sg',
    dr_email: 'emily.chen@sgh.com.sg',
    status: 'confirmed' as const,
    createdAt: '2024-01-12T09:30:00Z',
    updatedAt: '2024-01-12T09:30:00Z'
  }
];

// Constants
export const APP_CONSTANTS = {
  DEFAULT_WAIT_TIME: '15 minutes',
  MAX_QUEUE_SIZE: 10,
  EMERGENCY_PRIORITY_THRESHOLD: 5, // minutes
  DEFAULT_CONSULTATION_DURATION: 20, // minutes
  SUPPORTED_LANGUAGES: ['English', 'Mandarin', 'Malay', 'Tamil', 'Cantonese', 'Hokkien'],
  HOSPITAL_OPERATING_HOURS: {
    start: '06:00',
    end: '22:00'
  },
  EMERGENCY_SERVICES_24H: true
} as const;