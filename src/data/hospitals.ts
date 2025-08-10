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
    image: 'https://vaidam-images.s3.ap-southeast-1.amazonaws.com/files/main_building_changi_general_hospital_singapore.jpg',
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
    image: 'https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoiaWhoLWhlYWx0aGNhcmUtYmVyaGFkXC9maWxlXC81Q05IMkVRVDZ2dHYzWHVvaFZCcS5wbmcifQ:ihh-healthcare-berhad:XgOhKWzWefi1kZz_ewrQeA9NEnA0jxDqB_RTPx2LP7k?format=webp',
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
    image: 'https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/12/2020/09/istockphoto-1204775285-612x612-1.jpg',
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
    image: 'https://www.hok.com/wp-content/uploads/2019/05/Ng-Teng-Fong-Hospital-Curved-Facade-1900-1600x1069.jpg',
    operatingHours: 'Open 24 hours',
    facilities: ['Executive Health Screening', 'Day Surgery', 'Specialist Clinics', 'Concierge Services'],
    insurance: ['Private Insurance', 'Corporate Insurance', 'International Insurance']
  },
  {
    id: 5,
    name: 'Changi General Hospital',
    address: 'Simei Street 3',
    type: 'public',
    specialties: ['Emergency', 'Internal Medicine', 'Surgery', 'Orthopedics'],
    rating: 4.2,
    distance: '7.3 km away',
    phone: '+65 6788 8833',
    emergencyServices: true,
    image: 'https://vaidam-images.s3.ap-southeast-1.amazonaws.com/files/main_building_changi_general_hospital_singapore.jpg',
    operatingHours: 'Open 24 hours',
    facilities: ['Emergency Room', 'Surgery', 'Outpatient Clinics', 'Laboratory'],
    insurance: ['Medisave', 'Private Insurance', 'Corporate Insurance']
  },
  {
    id: 6,
    name: 'Gleneagles Hospital',
    address: 'Napier Road',
    type: 'private',
    specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Orthopedics'],
    rating: 4.8,
    distance: '4.7 km away',
    phone: '+65 6473 7222',
    emergencyServices: true,
    image: 'https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/12/2020/09/istockphoto-1204775285-612x612-1.jpg',
    operatingHours: 'Open 24 hours',
    facilities: ['Private Suites', 'Advanced ICU', 'Robotic Surgery', 'Executive Lounge'],
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