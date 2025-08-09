import { 
  doctors, 
  getDoctorById, 
  getDoctorsByDepartment, 
  getDoctorsBySpecialty, 
  getDoctorsByAvailability 
} from '../data/doctors';
import { Doctor } from '../types/medical';
import { DoctorSearchParams } from '../types/api';

export class DoctorService {
  static getAllDoctors(): Doctor[] {
    return doctors;
  }

  static getDoctorById(id: number): Doctor | undefined {
    return getDoctorById(id);
  }

  static searchDoctors(params: DoctorSearchParams): Doctor[] {
    let filteredDoctors = doctors;

    // Filter by department
    if (params.department && params.department !== 'All Departments') {
      filteredDoctors = getDoctorsByDepartment(params.department);
    }

    // Filter by specialty
    if (params.specialty) {
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.specialty.toLowerCase().includes(params.specialty!.toLowerCase())
      );
    }

    // Filter by hospital (if needed for multi-hospital support)
    if (params.hospitalId) {
      // Currently all doctors are at the same hospital, but this is for future expansion
      filteredDoctors = filteredDoctors.filter(() => true);
    }

    // Filter by availability
    if (params.availability) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.availableSlots.length > 0);
    }

    // Filter by minimum rating
    if (params.rating) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.rating >= params.rating!);
    }

    // Filter by experience
    if (params.experience) {
      const experienceYears = parseInt(params.experience.replace(/\D/g, ''));
      filteredDoctors = filteredDoctors.filter(doctor => {
        const doctorExperience = parseInt(doctor.experience.replace(/\D/g, ''));
        return doctorExperience >= experienceYears;
      });
    }

    // Filter by language
    if (params.language) {
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.languages.some(lang => 
          lang.toLowerCase().includes(params.language!.toLowerCase())
        )
      );
    }

    return filteredDoctors;
  }

  static sortDoctors(doctors: Doctor[], sortBy: 'rating' | 'wait' | 'experience'): Doctor[] {
    return [...doctors].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'wait':
          return a.patientsInQueue - b.patientsInQueue;
        case 'experience':
          const aExp = parseInt(a.experience.replace(/\D/g, ''));
          const bExp = parseInt(b.experience.replace(/\D/g, ''));
          return bExp - aExp;
        default:
          return 0;
      }
    });
  }

  static getDoctorsWithShortWait(maxWaitMinutes: number = 10): Doctor[] {
    return getDoctorsByAvailability(maxWaitMinutes);
  }

  static getTopRatedDoctors(minRating: number = 4.5): Doctor[] {
    return doctors.filter(doctor => doctor.rating >= minRating);
  }

  static getDoctorAvailableSlots(doctorId: number): string[] {
    const doctor = getDoctorById(doctorId);
    return doctor?.availableSlots || [];
  }

  static updateDoctorQueuePosition(doctorId: number, newPosition: number): void {
    // In a real app, this would make an API call
    const doctor = getDoctorById(doctorId);
    if (doctor) {
      doctor.patientsInQueue = newPosition;
      // Update estimated wait time based on queue position
      doctor.estimatedWait = `${newPosition * 8} minutes`;
    }
  }

  static bookAppointment(doctorId: number, timeSlot: string): boolean {
    // In a real app, this would make an API call
    const doctor = getDoctorById(doctorId);
    if (doctor && doctor.availableSlots.includes(timeSlot)) {
      doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== timeSlot);
      doctor.patientsInQueue += 1;
      return true;
    }
    return false;
  }
}