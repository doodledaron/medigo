// Medical types
export type {
  Doctor,
  Hospital,
  Patient,
  Appointment,
  Department,
  MedicalRecord
} from './medical';

// Navigation types
export type {
  NavigationStep,
  Checkpoint,
  NFCScanResult,
  IndoorMap,
  NavigationPath
} from './navigation';

// Common types
export type {
  BaseEntity,
  Location,
  ContactInfo,
  Rating,
  TimeSlot,
  OperatingHours,
  Priority,
  Status,
  UserRole
} from './common';

// API types
export type {
  ApiResponse,
  PaginatedResponse,
  DoctorSearchParams,
  HospitalSearchParams,
  AppointmentRequest,
  QueueStatus,
  SymptomAssessment
} from './api';