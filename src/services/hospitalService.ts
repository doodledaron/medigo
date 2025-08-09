import {
  hospitals,
  getHospitalById,
  getHospitalsByType,
  getHospitalsBySpecialty,
  getNearbyHospitals,
  getHospitalsWithEmergencyServices
} from '../data/hospitals';
import { Hospital } from '../types/medical';
import { HospitalSearchParams } from '../types/api';

export class HospitalService {
  static getAllHospitals(): Hospital[] {
    return hospitals;
  }

  static getHospitalById(id: number): Hospital | undefined {
    return getHospitalById(id);
  }

  static searchHospitals(params: HospitalSearchParams): Hospital[] {
    let filteredHospitals = hospitals;

    // Filter by type (public/private)
    if (params.type && params.type !== 'all') {
      filteredHospitals = getHospitalsByType(params.type as 'public' | 'private');
    }

    // Filter by specialty
    if (params.specialty) {
      filteredHospitals = getHospitalsBySpecialty(params.specialty);
    }

    // Filter by distance
    if (params.distance) {
      filteredHospitals = getNearbyHospitals(params.distance);
    }

    // Filter by emergency services
    if (params.emergencyServices) {
      filteredHospitals = filteredHospitals.filter(hospital => hospital.emergencyServices);
    }

    // Filter by minimum rating
    if (params.rating) {
      filteredHospitals = filteredHospitals.filter(hospital => hospital.rating >= params.rating!);
    }

    // Filter by insurance acceptance
    if (params.insurance) {
      filteredHospitals = filteredHospitals.filter(hospital =>
        hospital.insurance?.some(ins => 
          ins.toLowerCase().includes(params.insurance!.toLowerCase())
        )
      );
    }

    return filteredHospitals;
  }

  static getHospitalsByDistance(userLocation?: { lat: number; lng: number }): Hospital[] {
    // In a real app, this would calculate actual distances
    // For now, we'll return hospitals sorted by the distance string
    return hospitals.sort((a, b) => {
      const aDistance = parseFloat(a.distance.replace(/[^\d.]/g, ''));
      const bDistance = parseFloat(b.distance.replace(/[^\d.]/g, ''));
      return aDistance - bDistance;
    });
  }

  static getHospitalWaitTimes(hospitalId: number): { [department: string]: string } {
    // Mock wait times - in real app would fetch from API
    const hospital = getHospitalById(hospitalId);
    if (!hospital) return {};

    const waitTimes: { [department: string]: string } = {};
    hospital.specialties.forEach(specialty => {
      // Generate realistic wait times based on department
      const baseWait = specialty === 'Emergency' ? 5 : 15;
      const randomWait = Math.floor(Math.random() * 20) + baseWait;
      waitTimes[specialty] = `${randomWait} minutes`;
    });

    return waitTimes;
  }

  static getHospitalQueueInfo(hospitalId: number): { waitTime: string; peopleAhead: number; travelTime: string } {
    // Mock queue information - in real app would fetch from API
    const hospital = getHospitalById(hospitalId);
    if (!hospital) return { waitTime: '0 min', peopleAhead: 0, travelTime: '0 min' };

    // Generate realistic queue data based on hospital type
    const baseWait = hospital.type === 'private' ? 10 : 25;
    const randomWait = Math.floor(Math.random() * 15) + baseWait;
    const peopleAhead = Math.floor(Math.random() * 5);
    
    // Calculate travel time based on distance
    const distanceKm = parseFloat(hospital.distance.replace(/[^\d.]/g, '')) || 2.5;
    const travelTime = Math.ceil(distanceKm * 5); // Assume 5 min per km in city traffic

    return {
      waitTime: `${randomWait} min`,
      peopleAhead,
      travelTime: `${travelTime} min`
    };
  }

  static getHospitalContact(hospitalId: number): { phone: string; address: string } | null {
    const hospital = getHospitalById(hospitalId);
    if (!hospital) return null;

    return {
      phone: hospital.phone,
      address: hospital.address
    };
  }

  static checkHospitalCapacity(hospitalId: number): {
    currentCapacity: number;
    maxCapacity: number;
    availabilityStatus: 'low' | 'medium' | 'high';
  } {
    // Mock capacity data - in real app would fetch from API
    const currentCapacity = Math.floor(Math.random() * 100) + 50;
    const maxCapacity = 200;
    const utilizationRate = currentCapacity / maxCapacity;

    let availabilityStatus: 'low' | 'medium' | 'high' = 'high';
    if (utilizationRate > 0.8) availabilityStatus = 'low';
    else if (utilizationRate > 0.6) availabilityStatus = 'medium';

    return {
      currentCapacity,
      maxCapacity,
      availabilityStatus
    };
  }

  static getHospitalFacilities(hospitalId: number): string[] {
    const hospital = getHospitalById(hospitalId);
    return hospital?.facilities || [];
  }

  static getNearestEmergencyHospital(userLocation?: { lat: number; lng: number }): Hospital | null {
    const emergencyHospitals = getHospitalsWithEmergencyServices();
    if (emergencyHospitals.length === 0) return null;

    // Return the closest emergency hospital (first in the list for now)
    return emergencyHospitals[0];
  }

  static getHospitalRating(hospitalId: number): { 
    rating: number; 
    totalReviews: number; 
    categories: { [key: string]: number }; 
  } | null {
    const hospital = getHospitalById(hospitalId);
    if (!hospital) return null;

    // Mock detailed rating breakdown
    return {
      rating: hospital.rating,
      totalReviews: Math.floor(Math.random() * 500) + 100,
      categories: {
        'Medical Care': hospital.rating + 0.1,
        'Staff Friendliness': hospital.rating - 0.1,
        'Cleanliness': hospital.rating + 0.2,
        'Wait Time': hospital.rating - 0.3,
        'Facilities': hospital.rating
      }
    };
  }
}