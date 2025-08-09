// App-wide constants
export const APP_CONFIG = {
  APP_NAME: 'Medigo',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'English',
  DEFAULT_CURRENCY: 'SGD',
  TIMEZONE: 'Asia/Singapore'
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.medigo.sg',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    DOCTORS: '/api/doctors',
    HOSPITALS: '/api/hospitals',
    APPOINTMENTS: '/api/appointments',
    PATIENTS: '/api/patients',
    QUEUE: '/api/queue',
    NFC: '/api/nfc'
  }
} as const;

// Time-related constants
export const TIME_CONSTANTS = {
  DEFAULT_CONSULTATION_DURATION: 20, // minutes
  EMERGENCY_PRIORITY_THRESHOLD: 5, // minutes
  MAX_ADVANCE_BOOKING_DAYS: 30,
  MIN_ADVANCE_BOOKING_HOURS: 1,
  QUEUE_UPDATE_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT: 1800000 // 30 minutes
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MAX_TOAST_MESSAGES: 3,
  TOAST_DURATION: 5000, // 5 seconds
  LOADING_DEBOUNCE: 300, // milliseconds
  ANIMATION_DURATION: 300, // milliseconds
  MOBILE_BREAKPOINT: 768, // pixels
  TABLET_BREAKPOINT: 1024 // pixels
} as const;

// Hospital Operating Constants
export const HOSPITAL_CONSTANTS = {
  OPERATING_HOURS: {
    START: '06:00',
    END: '22:00'
  },
  EMERGENCY_SERVICES_24H: true,
  MAX_QUEUE_SIZE: 50,
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_WAIT_TIME: 15 // minutes
} as const;

// Medical Constants
export const MEDICAL_CONSTANTS = {
  PRIORITY_LEVELS: ['low', 'medium', 'high', 'critical'] as const,
  APPOINTMENT_TYPES: ['consultation', 'follow-up', 'emergency', 'check-up'] as const,
  APPOINTMENT_STATUSES: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'] as const,
  USER_ROLES: ['patient', 'doctor', 'admin', 'staff'] as const,
  EMERGENCY_SYMPTOMS: [
    'Severe chest pain',
    'Difficulty breathing',
    'Severe head injury',
    'Severe bleeding',
    'Loss of consciousness',
    'Severe burns',
    'Signs of stroke',
    'Severe allergic reaction'
  ]
} as const;

// Language Constants
export const LANGUAGE_CONSTANTS = {
  SUPPORTED_LANGUAGES: [
    'English',
    'Mandarin',
    'Malay',
    'Tamil',
    'Cantonese',
    'Hokkien'
  ],
  DEFAULT_LANGUAGE: 'English',
  RTL_LANGUAGES: [] // None for Singapore context
} as const;

// Validation Constants
export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PHONE_LENGTH: 8,
  MAX_PHONE_LENGTH: 15,
  MIN_AGE: 0,
  MAX_AGE: 150,
  SINGAPORE_POSTAL_CODE_LENGTH: 6
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  APPOINTMENT_CONFLICT: 'The selected time slot is no longer available.',
  QUEUE_FULL: 'The queue is currently full. Please try again later.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  APPOINTMENT_BOOKED: 'Appointment booked successfully!',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully.',
  APPOINTMENT_RESCHEDULED: 'Appointment rescheduled successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully.',
  NFC_SCAN_SUCCESS: 'NFC scan successful.'
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_NFC_SCANNING: true,
  ENABLE_AI_DOCTOR_ASSIGNMENT: true,
  ENABLE_INDOOR_NAVIGATION: true,
  ENABLE_REAL_TIME_QUEUE: true,
  ENABLE_PAYMENT_GATEWAY: false, // Not implemented yet
  ENABLE_TELEMEDICINE: false, // Future feature
  ENABLE_PUSH_NOTIFICATIONS: false // Future feature
} as const;

// Theme Constants
export const THEME_CONSTANTS = {
  PRIMARY_COLORS: {
    BLUE: '#3B82F6',
    BLUE_LIGHT: '#EBF8FF',
    BLUE_DARK: '#1E40AF'
  },
  SECONDARY_COLORS: {
    GREEN: '#10B981',
    RED: '#EF4444',
    YELLOW: '#F59E0B',
    PURPLE: '#8B5CF6'
  },
  TERTIARY_COLORS: {
    PINK: '#EC4899',
    PINK_LIGHT: '#FCE7F3',
    PINK_DARK: '#BE185D'
  },
  NEUTRAL_COLORS: {
    GRAY_50: '#F9FAFB',
    GRAY_100: '#F3F4F6',
    GRAY_500: '#6B7280',
    GRAY_900: '#111827'
  }
} as const;

// Distance and Location Constants
export const LOCATION_CONSTANTS = {
  DEFAULT_SEARCH_RADIUS: 10, // kilometers
  MAX_SEARCH_RADIUS: 50, // kilometers
  SINGAPORE_BOUNDS: {
    NORTH: 1.4504,
    SOUTH: 1.2966,
    EAST: 104.0120,
    WEST: 103.6057
  }
} as const;

// File Upload Constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
  MAX_FILES_PER_UPLOAD: 5
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  SINGAPORE_PHONE: /^\+65\s?[3689]\d{3}\s?\d{4}$/,
  SINGAPORE_NRIC: /^[STFG]\d{7}[A-Z]$/,
  SINGAPORE_POSTAL: /^\d{6}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TIME_12H: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,
  DATE_YYYY_MM_DD: /^\d{4}-\d{2}-\d{2}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
} as const;