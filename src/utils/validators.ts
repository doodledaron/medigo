import { Doctor, Hospital, Appointment } from '../types/medical';

export class DataValidators {
  // Doctor validation
  static validateDoctor(doctor: Partial<Doctor>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!doctor.name || doctor.name.trim().length < 2) {
      errors.push('Doctor name must be at least 2 characters long');
    }

    if (!doctor.specialty || doctor.specialty.trim().length === 0) {
      errors.push('Doctor specialty is required');
    }

    if (!doctor.department || doctor.department.trim().length === 0) {
      errors.push('Doctor department is required');
    }

    if (doctor.rating !== undefined && (doctor.rating < 0 || doctor.rating > 5)) {
      errors.push('Doctor rating must be between 0 and 5');
    }

    if (doctor.patientsInQueue !== undefined && doctor.patientsInQueue < 0) {
      errors.push('Patients in queue cannot be negative');
    }

    if (doctor.experience && !doctor.experience.match(/^\d+\s*(years?|y)$/i)) {
      errors.push('Experience must be in format "X years" or "X y"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Hospital validation
  static validateHospital(hospital: Partial<Hospital>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!hospital.name || hospital.name.trim().length < 2) {
      errors.push('Hospital name must be at least 2 characters long');
    }

    if (!hospital.address || hospital.address.trim().length === 0) {
      errors.push('Hospital address is required');
    }

    if (!hospital.type || !['public', 'private'].includes(hospital.type)) {
      errors.push('Hospital type must be either "public" or "private"');
    }

    if (hospital.rating !== undefined && (hospital.rating < 0 || hospital.rating > 5)) {
      errors.push('Hospital rating must be between 0 and 5');
    }

    if (hospital.phone && !this.validatePhoneNumber(hospital.phone)) {
      errors.push('Invalid phone number format');
    }

    if (!hospital.specialties || hospital.specialties.length === 0) {
      errors.push('Hospital must have at least one specialty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Appointment validation
  static validateAppointment(appointment: Partial<Appointment>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!appointment.doctor_id) {
      errors.push('Valid doctor ID is required');
    }

    if (!appointment.patient_name || !appointment.patient_email) {
      errors.push('Patient information is required');
    }

    if (!appointment.hospital_id) {
      errors.push('Valid hospital ID is required');
    }

    if (!appointment.appointment_date || !this.validateDate(appointment.appointment_date)) {
      errors.push('Valid appointment date is required');
    }

    if (!appointment.appointment_time || !this.validateTime(appointment.appointment_time)) {
      errors.push('Valid appointment time is required');
    }

    // Note: Appointment interface doesn't have a type field
    // const validTypes = ['consultation', 'follow-up', 'emergency', 'check-up'];
    // if (appointment.type && !validTypes.includes(appointment.type)) {
    //   errors.push('Invalid appointment type');
    // }

    const validStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (appointment.status && !validStatuses.includes(appointment.status)) {
      errors.push('Invalid appointment status');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Phone number validation (Singapore format)
  static validatePhoneNumber(phone: string): boolean {
    // Singapore phone number formats: +65 XXXX XXXX or +65 XXXXXXXX
    const phoneRegex = /^\+65\s?[3689]\d{3}\s?\d{4}$/;
    return phoneRegex.test(phone);
  }

  // Date validation (YYYY-MM-DD format)
  static validateDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }

  // Time validation (12-hour format)
  static validateTime(time: string): boolean {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return timeRegex.test(time);
  }

  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // NRIC validation (Singapore)
  static validateNRIC(nric: string): boolean {
    const nricRegex = /^[STFG]\d{7}[A-Z]$/;
    if (!nricRegex.test(nric)) return false;

    // Validate check digit
    const weights = [2, 7, 6, 5, 4, 3, 2];
    const digits = nric.substring(1, 8).split('').map(Number);
    const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);
    
    const checkLetters = nric.startsWith('S') || nric.startsWith('T') ? 
      'ABCDEFGHIZJ' : 'KLMNPQRTUWX';
    
    const expectedCheck = checkLetters[sum % 11];
    return nric[8] === expectedCheck;
  }

  // Postal code validation (Singapore)
  static validatePostalCode(postalCode: string): boolean {
    const postalRegex = /^\d{6}$/;
    return postalRegex.test(postalCode);
  }

  // General text validation
  static validateTextLength(text: string, minLength: number, maxLength: number): boolean {
    const trimmedText = text.trim();
    return trimmedText.length >= minLength && trimmedText.length <= maxLength;
  }

  // Number range validation
  static validateNumberRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  // Array validation
  static validateArrayNotEmpty<T>(array: T[]): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  // Required field validation
  static validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }
}