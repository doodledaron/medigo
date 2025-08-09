import { Department } from '../types/medical';

export const departments: Department[] = [
  {
    id: 1,
    name: 'Cardiology',
    description: 'Heart and cardiovascular system treatment',
    specialties: ['Interventional Cardiology', 'Electrophysiology', 'Heart Surgery'],
    color: '#EF4444' // red-500
  },
  {
    id: 2,
    name: 'Neurology',
    description: 'Brain and nervous system disorders',
    specialties: ['Epilepsy', 'Stroke Care', 'Movement Disorders', 'Neurocritical Care'],
    color: '#8B5CF6' // violet-500
  },
  {
    id: 3,
    name: 'Internal Medicine',
    description: 'General internal medicine and chronic conditions',
    specialties: ['Diabetes Care', 'Hypertension', 'Infectious Diseases'],
    color: '#06B6D4' // cyan-500
  },
  {
    id: 4,
    name: 'Emergency',
    description: 'Emergency and critical care services',
    specialties: ['Trauma Care', 'Critical Care', 'Emergency Surgery'],
    color: '#F59E0B' // amber-500
  },
  {
    id: 5,
    name: 'Orthopedics',
    description: 'Bone, joint, and musculoskeletal treatment',
    specialties: ['Sports Medicine', 'Joint Replacement', 'Spine Surgery'],
    color: '#10B981' // emerald-500
  },
  {
    id: 6,
    name: 'Dermatology',
    description: 'Skin, hair, and nail conditions',
    specialties: ['Skin Cancer', 'Cosmetic Dermatology', 'Pediatric Dermatology'],
    color: '#F97316' // orange-500
  },
  {
    id: 7,
    name: 'Pediatrics',
    description: 'Medical care for infants, children, and adolescents',
    specialties: ['Pediatric Emergency', 'Neonatology', 'Pediatric Surgery'],
    color: '#EC4899' // pink-500
  },
  {
    id: 8,
    name: 'Gastroenterology',
    description: 'Digestive system and liver disorders',
    specialties: ['Endoscopy', 'Hepatology', 'IBD Care'],
    color: '#84CC16' // lime-500
  }
];

export const departmentNames = [
  'All Departments',
  'Cardiology',
  'Neurology',
  'Internal Medicine',
  'Emergency',
  'Orthopedics',
  'Dermatology',
  'Pediatrics',
  'Gastroenterology'
];

export const getDepartmentById = (id: number): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getDepartmentByName = (name: string): Department | undefined => {
  return departments.find(dept => dept.name.toLowerCase() === name.toLowerCase());
};

export const getAllDepartmentNames = (): string[] => {
  return departmentNames;
};

export const getDepartmentSpecialties = (departmentName: string): string[] => {
  const dept = getDepartmentByName(departmentName);
  return dept?.specialties || [];
};