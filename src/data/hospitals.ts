import { Hospital } from '../types/medical';

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'Singapore General Hospital',
    address: 'Outram Road',
    type: 'public',
    specialties: ['Cardiology', 'Emergency', 'Internal Medicine', 'Neurology'],
    rating: 4.5,
    distance: '2.5 km away',
    phone: '+65 6222 3322',
    emergencyServices: true,
    image: 'https://www.healthtrip.com/hospital/singapore-general-hospital',
    operatingHours: 'Open 24 hours',
    facilities: ['Emergency Room', 'ICU', 'Surgery', 'Radiology', 'Laboratory'],
    insurance: ['Medisave', 'Private Insurance', 'Corporate Insurance']
  },
  {
    id: 2,
    name: 'National University Hospital',
    address: 'Lower Kent Ridge Road',
    type: 'public',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
    rating: 4.3,
    distance: '4.1 km away',
    phone: '+65 6779 5555',
    emergencyServices: true,
    image: 'https://www.ien.com.my/projects/hospital-sultanah-malihah%2C-langkawi',
    operatingHours: 'Open 24 hours',
    facilities: ['Emergency Room', 'Cancer Center', 'Research Center', 'Pharmacy'],
    insurance: ['Medisave', 'Private Insurance']
  },
  {
    id: 3,
    name: 'Mount Elizabeth Hospital',
    address: 'Mount Elizabeth',
    type: 'private',
    specialties: ['Cardiology', 'Plastic Surgery', 'Orthopedics', 'Gastroenterology'],
    rating: 4.7,
    distance: '3.2 km away',
    phone: '+65 6737 2666',
    emergencyServices: true,
    image: 'https://www.healthtrip.com/hospital/singapore-general-hospital',
    operatingHours: 'Open 24 hours',
    facilities: ['Private Rooms', 'VIP Suites', 'Advanced Surgery', 'Wellness Center'],
    insurance: ['Private Insurance', 'Corporate Insurance', 'International Insurance']
  },
  {
    id: 4,
    name: 'Raffles Hospital',
    address: 'North Bridge Road',
    type: 'private',
    specialties: ['Cardiology', 'Gastroenterology', 'Dermatology', 'Ophthalmology'],
    rating: 4.6,
    distance: '5.8 km away',
    phone: '+65 6311 1111',
    emergencyServices: true,
    image: 'https://www.mountelizabeth.com.sg/why-choose-us/mount-elizabeth-hospital',
    operatingHours: 'Open 24 hours',
    facilities: ['Executive Health Screening', 'Day Surgery', 'Specialist Clinics', 'Concierge Services'],
    insurance: ['Private Insurance', 'Corporate Insurance', 'International Insurance']
  }
];

export const getHospitalById = (id: number): Hospital | undefined => {
  return hospitals.find(hospital => hospital.id === id);
};

export const getHospitalsByType = (type: 'public' | 'private'): Hospital[] => {
  return hospitals.filter(hospital => hospital.type === type);
};

export const getHospitalsBySpecialty = (specialty: string): Hospital[] => {
  return hospitals.filter(hospital => 
    hospital.specialties.some(s => 
      s.toLowerCase().includes(specialty.toLowerCase())
    )
  );
};

export const getNearbyHospitals = (maxDistance?: number): Hospital[] => {
  if (!maxDistance) return hospitals;
  return hospitals.filter(hospital => {
    const distanceKm = parseFloat(hospital.distance.replace(/[^\d.]/g, ''));
    return distanceKm <= maxDistance;
  });
};

export const getHospitalsWithEmergencyServices = (): Hospital[] => {
  return hospitals.filter(hospital => hospital.emergencyServices);
};