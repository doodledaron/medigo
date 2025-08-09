import { Doctor } from '../types/medical';

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. James Wong',
    specialty: 'Neurology Specialist',
    department: 'Neurology',
    rating: 4.8,
    patientsInQueue: 3,
    estimatedWait: '10 minutes',
    availableSlots: ['2:30 PM', '3:00 PM', '4:15 PM'],
    experience: '12 years',
    languages: ['English', 'Mandarin', 'Cantonese'],
    image: '/doctor-1.jpg',
    education: 'MD, Harvard Medical School',
    certifications: ['Board Certified Neurologist', 'Epilepsy Specialist'],
    consultationFee: 120
  },
  {
    id: 2,
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology Specialist',
    department: 'Cardiology',
    rating: 4.9,
    patientsInQueue: 1,
    estimatedWait: '5 minutes',
    availableSlots: ['2:45 PM', '3:30 PM', '5:00 PM'],
    experience: '15 years',
    languages: ['English', 'Mandarin'],
    image: '/doctor-2.jpg',
    education: 'MD, Johns Hopkins University',
    certifications: ['Board Certified Cardiologist', 'Interventional Cardiology'],
    consultationFee: 150
  },
  {
    id: 3,
    name: 'Dr. Ahmad Rahman',
    specialty: 'Internal Medicine',
    department: 'Internal Medicine',
    rating: 4.7,
    patientsInQueue: 5,
    estimatedWait: '15 minutes',
    availableSlots: ['3:15 PM', '4:00 PM', '4:45 PM'],
    experience: '10 years',
    languages: ['English', 'Malay', 'Tamil'],
    image: '/doctor-3.jpg',
    education: 'MBBS, National University of Singapore',
    certifications: ['Board Certified Internal Medicine', 'Diabetes Specialist'],
    consultationFee: 100
  },
  {
    id: 4,
    name: 'Dr. Li Wei Ming',
    specialty: 'Emergency Medicine',
    department: 'Emergency',
    rating: 4.6,
    patientsInQueue: 2,
    estimatedWait: '8 minutes',
    availableSlots: ['2:00 PM', '2:30 PM', '3:45 PM'],
    experience: '8 years',
    languages: ['English', 'Mandarin', 'Hokkien'],
    image: '/doctor-4.jpg',
    education: 'MD, University of Melbourne',
    certifications: ['Board Certified Emergency Medicine', 'ACLS Certified'],
    consultationFee: 80
  },
  {
    id: 5,
    name: 'Dr. Maria Rodriguez',
    specialty: 'Pediatrics',
    department: 'Pediatrics',
    rating: 4.8,
    patientsInQueue: 3,
    estimatedWait: '12 minutes',
    availableSlots: ['3:00 PM', '4:30 PM', '5:15 PM'],
    experience: '14 years',
    languages: ['English', 'Spanish', 'Portuguese'],
    image: '/doctor-5.jpg',
    education: 'MD, University of Barcelona',
    certifications: ['Board Certified Pediatrician', 'Pediatric Emergency Medicine'],
    consultationFee: 110
  }
];

export const getDoctorById = (id: number): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};

export const getDoctorsByDepartment = (department: string): Doctor[] => {
  if (department === 'All Departments') return doctors;
  return doctors.filter(doctor => doctor.department === department);
};

export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter(doctor => doctor.specialty.toLowerCase().includes(specialty.toLowerCase()));
};

export const getDoctorsByAvailability = (maxWaitTime: number): Doctor[] => {
  return doctors.filter(doctor => {
    const waitMinutes = parseInt(doctor.estimatedWait.replace(/\D/g, ''));
    return waitMinutes <= maxWaitTime;
  });
};