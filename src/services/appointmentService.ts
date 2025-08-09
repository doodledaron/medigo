import { mockAppointments, mockPatients } from '../data';
import { Appointment, Patient } from '../types/medical';
import { AppointmentRequest, QueueStatus } from '../types/api';
import { DoctorService } from './doctorService';
import { HospitalService } from './hospitalService';

export class AppointmentService {
  static getAllAppointments(): Appointment[] {
    return mockAppointments;
  }

  static getAppointmentById(id: string): Appointment | undefined {
    return mockAppointments.find(appointment => appointment.id === id);
  }

  static getAppointmentsByUserEmail(email: string): Appointment[] {
    return mockAppointments.filter(appointment => appointment.patient_email === email);
  }

  static getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return mockAppointments.filter(appointment => appointment.doctor_id === doctorId);
  }

  static getAppointmentsByHospital(hospitalId: string): Appointment[] {
    return mockAppointments.filter(appointment => appointment.hospital_id === hospitalId);
  }

  static createAppointment(request: AppointmentRequest): { success: boolean; appointmentId?: string; message: string } {
    try {
      // Validate required fields
      if (!request.patient_name || !request.patient_email || !request.patient_phone) {
        return { success: false, message: 'Patient information is incomplete' };
      }

      if (!request.doctor_id || !request.hospital_id || !request.department) {
        return { success: false, message: 'Appointment details are incomplete' };
      }

      // Create appointment directly from request (since it comes from confirmed booking)
      const newAppointment: Appointment = {
        ...request,
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAppointments.push(newAppointment);

      // Update doctor availability if doctor exists in our system
      const doctorId = parseInt(request.doctor_id);
      if (!isNaN(doctorId)) {
        const appointmentTimeSlot = `${request.appointment_time}`;
        DoctorService.bookAppointment(doctorId, appointmentTimeSlot);
      }

      return { 
        success: true, 
        appointmentId: newAppointment.id,
        message: 'Appointment confirmed successfully' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to confirm appointment. Please try again.' 
      };
    }
  }

  static updateAppointmentStatus(appointmentId: string, status: Appointment['status']): boolean {
    const appointmentIndex = mockAppointments.findIndex(app => app.id === appointmentId);
    if (appointmentIndex === -1) return false;

    mockAppointments[appointmentIndex].status = status;
    mockAppointments[appointmentIndex].updatedAt = new Date().toISOString();
    return true;
  }

  static cancelAppointment(appointmentId: string): boolean {
    const appointment = mockAppointments.find(app => app.id === appointmentId);
    if (!appointment) return false;

    // Update status
    appointment.status = 'cancelled';
    appointment.updatedAt = new Date().toISOString();

    // Free up the doctor's time slot if doctor exists in our system
    const doctorId = parseInt(appointment.doctor_id);
    if (!isNaN(doctorId)) {
      const doctor = DoctorService.getDoctorById(doctorId);
      if (doctor) {
        doctor.availableSlots.push(appointment.appointment_time);
        doctor.patientsInQueue = Math.max(0, doctor.patientsInQueue - 1);
      }
    }

    return true;
  }

  static getQueueStatus(userEmail: string, doctorId: string): QueueStatus | null {
    const appointment = mockAppointments.find(
      app => app.patient_email === userEmail && app.doctor_id === doctorId && app.status !== 'cancelled'
    );
    
    if (!appointment) return null;

    const numericDoctorId = parseInt(doctorId);
    const doctor = !isNaN(numericDoctorId) ? DoctorService.getDoctorById(numericDoctorId) : null;
    if (!doctor) return null;

    // Calculate position based on appointment time and current time
    const position = Math.floor(Math.random() * doctor.patientsInQueue) + 1;
    const estimatedWaitTime = `${position * 8} minutes`;

    return {
      patientId: 0, // Deprecated field
      position,
      estimatedWaitTime,
      totalInQueue: doctor.patientsInQueue,
      doctorId: numericDoctorId,
      lastUpdated: new Date().toISOString()
    };
  }

  static getUpcomingAppointments(userEmail: string): Appointment[] {
    const today = new Date();
    return mockAppointments.filter(appointment => 
      appointment.patient_email === userEmail && 
      (appointment.status === 'scheduled' || appointment.status === 'confirmed') &&
      new Date(`${appointment.appointment_date}T${appointment.appointment_time}`) >= today
    ).sort((a, b) => 
      new Date(`${a.appointment_date}T${a.appointment_time}`).getTime() - 
      new Date(`${b.appointment_date}T${b.appointment_time}`).getTime()
    );
  }

  static getTodaysAppointments(doctorId: string): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return mockAppointments.filter(appointment => 
      appointment.doctor_id === doctorId && 
      appointment.appointment_date === today &&
      appointment.status !== 'cancelled'
    ).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
  }

  static rescheduleAppointment(
    appointmentId: string, 
    newSlotTime: string
  ): { success: boolean; message: string } {
    const appointment = mockAppointments.find(app => app.id === appointmentId);
    if (!appointment) {
      return { success: false, message: 'Appointment not found' };
    }

    // Check if new time slot is available
    const doctorId = parseInt(appointment.doctor_id);
    const doctor = !isNaN(doctorId) ? DoctorService.getDoctorById(doctorId) : null;
    if (!doctor?.availableSlots.includes(newSlotTime)) {
      return { success: false, message: 'Selected time slot is not available' };
    }

    // Free up old slot
    doctor.availableSlots.push(appointment.appointment_time);

    // Book new slot
    doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== newSlotTime);

    // Update appointment
    appointment.appointment_time = newSlotTime;
    appointment.status = 'scheduled';
    appointment.updatedAt = new Date().toISOString();

    return { success: true, message: 'Appointment rescheduled successfully' };
  }

  static getUserHistory(userEmail: string): Appointment[] {
    return mockAppointments
      .filter(appointment => appointment.patient_email === userEmail)
      .sort((a, b) => 
        new Date(`${b.appointment_date}T${b.appointment_time}`).getTime() - 
        new Date(`${a.appointment_date}T${a.appointment_time}`).getTime()
      );
  }

  static getDoctorSchedule(doctorId: string, date: string): {
    appointments: Appointment[];
    availableSlots: string[];
    totalPatients: number;
  } {
    const appointments = mockAppointments.filter(
      app => app.doctor_id === doctorId && app.appointment_date === date && app.status !== 'cancelled'
    );

    const numericDoctorId = parseInt(doctorId);
    const doctor = !isNaN(numericDoctorId) ? DoctorService.getDoctorById(numericDoctorId) : null;
    const availableSlots = doctor?.availableSlots || [];

    return {
      appointments,
      availableSlots,
      totalPatients: appointments.length
    };
  }
}