import { Doctor, Hospital, Appointment } from '../types/medical';

export class DataTransformers {
  // Doctor data transformations
  static transformDoctorForDisplay(doctor: Doctor): Doctor {
    return {
      ...doctor,
      // Standardize experience format
      experience: doctor.experience.includes('year') ? doctor.experience : `${doctor.experience} years`,
      // Ensure estimated wait has consistent format
      estimatedWait: doctor.estimatedWait.includes('minutes') ? doctor.estimatedWait : `${doctor.estimatedWait} minutes`,
      // Capitalize languages
      languages: doctor.languages.map(lang => DataTransformers.capitalizeFirstLetter(lang))
    };
  }

  // Hospital data transformations
  static transformHospitalForDisplay(hospital: Hospital): Hospital {
    return {
      ...hospital,
      // Standardize hospital type display
      type: DataTransformers.capitalizeFirstLetter(hospital.type),
      // Ensure distance format is consistent
      distance: hospital.distance.includes('km') ? hospital.distance : `${hospital.distance} km`,
      // Sort specialties alphabetically
      specialties: hospital.specialties.sort()
    };
  }

  // Convert legacy doctor data to new format
  static convertLegacyDoctor(legacyDoctor: any): Doctor {
    return {
      id: typeof legacyDoctor.id === 'string' ? parseInt(legacyDoctor.id) : legacyDoctor.id,
      name: legacyDoctor.name,
      specialty: legacyDoctor.specialty,
      department: legacyDoctor.department,
      rating: legacyDoctor.rating,
      patientsInQueue: legacyDoctor.patientsInQueue,
      estimatedWait: DataTransformers.standardizeWaitTime(legacyDoctor.estimatedWait),
      availableSlots: legacyDoctor.availableSlots || [],
      experience: DataTransformers.standardizeExperience(legacyDoctor.experience),
      languages: legacyDoctor.languages || ['English'],
      image: legacyDoctor.image,
      education: legacyDoctor.education,
      certifications: legacyDoctor.certifications,
      consultationFee: legacyDoctor.consultationFee
    };
  }

  // Convert legacy hospital data to new format
  static convertLegacyHospital(legacyHospital: any): Hospital {
    return {
      id: typeof legacyHospital.id === 'string' ? parseInt(legacyHospital.id) : legacyHospital.id,
      name: legacyHospital.name,
      address: legacyHospital.address,
      type: legacyHospital.type,
      specialties: legacyHospital.specialties || [],
      rating: legacyHospital.rating,
      distance: DataTransformers.standardizeDistance(legacyHospital.distance || legacyHospital.travelTime),
      phone: legacyHospital.phone,
      emergencyServices: legacyHospital.emergencyServices ?? true,
      image: legacyHospital.imageUrl || legacyHospital.image,
      operatingHours: legacyHospital.operatingHours,
      facilities: legacyHospital.facilities,
      insurance: legacyHospital.insurance
    };
  }

  // Standardize wait time format
  static standardizeWaitTime(waitTime: string): string {
    if (!waitTime) return '15 minutes';
    
    // Remove ~ and "wait" suffixes, ensure "minutes" suffix
    let cleanTime = waitTime.replace(/~/g, '').replace(/\s*wait\s*/gi, '').trim();
    
    if (!cleanTime.includes('minute')) {
      // If it's just a number, add minutes
      const timeNumber = cleanTime.match(/\d+/);
      if (timeNumber) {
        cleanTime = `${timeNumber[0]} minutes`;
      }
    }
    
    return cleanTime;
  }

  // Standardize experience format
  static standardizeExperience(experience: string | number): string {
    if (typeof experience === 'number') {
      return `${experience} years`;
    }
    
    if (typeof experience === 'string') {
      if (experience.includes('year')) return experience;
      const expNumber = experience.match(/\d+/);
      if (expNumber) {
        return `${expNumber[0]} years`;
      }
    }
    
    return '0 years';
  }

  // Standardize distance format
  static standardizeDistance(distance: string): string {
    if (!distance) return '0 km';
    
    // Extract number and ensure km suffix
    const distanceNumber = distance.match(/[\d.]+/);
    if (distanceNumber) {
      return `${distanceNumber[0]} km`;
    }
    
    return distance;
  }

  // Convert 12-hour time to 24-hour format
  static convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier.toUpperCase() === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  // Convert 24-hour time to 12-hour format
  static convertTo12Hour(time24h: string): string {
    const [hours, minutes] = time24h.split(':');
    const hour24 = parseInt(hours, 10);
    
    let hour12 = hour24;
    let modifier = 'AM';
    
    if (hour24 === 0) {
      hour12 = 12;
    } else if (hour24 === 12) {
      modifier = 'PM';
    } else if (hour24 > 12) {
      hour12 = hour24 - 12;
      modifier = 'PM';
    }
    
    return `${hour12}:${minutes} ${modifier}`;
  }

  // Format rating for display
  static formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  // Format price in SGD
  static formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD'
    }).format(amount);
  }

  // Format date for display
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format date and time for display
  static formatDateTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Convert appointment status to display text
  static formatAppointmentStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'Scheduled',
      'confirmed': 'Confirmed',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  // Convert priority to display text with color
  static formatPriority(priority: string): { text: string; color: string } {
    const priorityMap: { [key: string]: { text: string; color: string } } = {
      'low': { text: 'Low', color: 'green' },
      'medium': { text: 'Medium', color: 'yellow' },
      'high': { text: 'High', color: 'orange' },
      'critical': { text: 'Critical', color: 'red' }
    };
    return priorityMap[priority] || { text: priority, color: 'gray' };
  }

  // Extract initials from name
  static extractInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Capitalize first letter of each word
  static capitalizeFirstLetter(text: string): string {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Truncate text with ellipsis
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  // Calculate age from birth date
  static calculateAge(birthDate: string | Date): number {
    const today = new Date();
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Generate color based on text (for avatars, etc.)
  static generateColorFromText(text: string): string {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '');
  }
}