import { NavigationStep, Checkpoint } from '../types/navigation';

export const navigationSteps: NavigationStep[] = [
  {
    id: 1,
    title: 'Main Entrance to Elevator',
    description: 'Walk straight ahead to the elevator bank',
    instruction: 'Continue straight through the main lobby, past the information desk',
    floor: 1,
    estimatedTime: '2 minutes',
    landmarks: ['Main lobby', 'Information desk', 'Gift shop']
  },
  {
    id: 2,
    title: 'Elevator Area (Checkpoint 2)',
    description: 'You have reached the elevator area - scan NFC to continue',
    instruction: 'Scan the NFC tag at the elevator area to confirm your location',
    floor: 1,
    estimatedTime: '1 minute',
    landmarks: ['Elevator bank', 'NFC scanner', 'Directory board']
  },
  {
    id: 3,
    title: 'Final Destination',
    description: 'Navigate to your department and scan at reception',
    instruction: 'Take elevator to Level 3, turn right to Neurology Department',
    floor: 3,
    estimatedTime: '3 minutes',
    landmarks: ['Level 3 elevators', 'Neurology signage', 'Reception desk']
  },
  {
    id: 4,
    title: 'Emergency Exit Route',
    description: 'Alternative route for emergency situations',
    instruction: 'Use emergency stairwell if elevators are unavailable',
    floor: 1,
    estimatedTime: '5 minutes',
    landmarks: ['Emergency stairwell', 'Fire exit signs', 'Emergency assembly point']
  }
];

export const checkpoints: Checkpoint[] = [
  {
    id: 1,
    name: 'Main Entrance',
    type: 'entrance',
    floor: 1,
    coordinates: { x: 0, y: 0 },
    description: 'Primary hospital entrance with reception desk'
  },
  {
    id: 2,
    name: 'Elevator Bank',
    type: 'elevator',
    floor: 1,
    coordinates: { x: 50, y: 20 },
    description: 'Central elevator area serving all floors'
  },
  {
    id: 3,
    name: 'Neurology Department',
    type: 'department',
    floor: 3,
    coordinates: { x: 75, y: 15 },
    description: 'Neurology department reception and waiting area'
  },
  {
    id: 4,
    name: 'Cardiology Department',
    type: 'department',
    floor: 2,
    coordinates: { x: 60, y: 25 },
    description: 'Cardiology department with specialized equipment'
  },
  {
    id: 5,
    name: 'Emergency Department',
    type: 'emergency',
    floor: 1,
    coordinates: { x: 100, y: 5 },
    description: '24/7 emergency services and trauma care'
  },
  {
    id: 6,
    name: 'Internal Medicine',
    type: 'department',
    floor: 2,
    coordinates: { x: 40, y: 35 },
    description: 'General internal medicine consultations'
  }
];

export const hospitalFloors = [
  {
    floor: 1,
    departments: ['Emergency', 'Reception', 'Pharmacy', 'Laboratory'],
    facilities: ['Main entrance', 'Elevators', 'Cafeteria', 'Gift shop']
  },
  {
    floor: 2,
    departments: ['Cardiology', 'Internal Medicine', 'Orthopedics'],
    facilities: ['Waiting areas', 'Consultation rooms', 'Diagnostic center']
  },
  {
    floor: 3,
    departments: ['Neurology', 'Pediatrics', 'Dermatology'],
    facilities: ['Specialized equipment', 'Treatment rooms', 'Nursing station']
  }
];

export const getNavigationStepById = (id: number): NavigationStep | undefined => {
  return navigationSteps.find(step => step.id === id);
};

export const getCheckpointById = (id: number): Checkpoint | undefined => {
  return checkpoints.find(checkpoint => checkpoint.id === id);
};

export const getCheckpointsByFloor = (floor: number): Checkpoint[] => {
  return checkpoints.filter(checkpoint => checkpoint.floor === floor);
};

export const getNavigationStepsForFloor = (floor: number): NavigationStep[] => {
  return navigationSteps.filter(step => step.floor === floor);
};

export const getDepartmentCheckpoint = (departmentName: string): Checkpoint | undefined => {
  return checkpoints.find(checkpoint => 
    checkpoint.description.toLowerCase().includes(departmentName.toLowerCase())
  );
};

export const calculateEstimatedTime = (fromCheckpointId: number, toCheckpointId: number): string => {
  const baseTime = 2; // 2 minutes base time
  const distance = Math.abs(toCheckpointId - fromCheckpointId);
  const estimatedMinutes = baseTime + (distance * 1.5);
  return `${Math.round(estimatedMinutes)} minutes`;
};