export interface Symptom {
  id: number;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  icon: string;
  suggestedSpecialty?: string;
  description?: string;
}

export const commonSymptoms: Symptom[] = [
  {
    id: 1,
    name: 'Chest Pain',
    category: 'cardiovascular',
    severity: 'high',
    icon: 'heart',
    suggestedSpecialty: 'Cardiology',
    description: 'Pain or discomfort in the chest area'
  },
  {
    id: 2,
    name: 'Headache',
    category: 'neurological',
    severity: 'medium',
    icon: 'brain',
    suggestedSpecialty: 'Neurology',
    description: 'Pain in the head or upper neck'
  },
  {
    id: 3,
    name: 'Fever',
    category: 'general',
    severity: 'medium',
    icon: 'thermometer',
    suggestedSpecialty: 'Internal Medicine',
    description: 'Body temperature higher than normal'
  },
  {
    id: 4,
    name: 'Stomach Pain',
    category: 'gastrointestinal',
    severity: 'medium',
    icon: 'stomach',
    suggestedSpecialty: 'Gastroenterology',
    description: 'Pain in the abdominal area'
  },
  {
    id: 5,
    name: 'Shortness of Breath',
    category: 'respiratory',
    severity: 'high',
    icon: 'lungs',
    suggestedSpecialty: 'Cardiology',
    description: 'Difficulty breathing or feeling breathless'
  },
  {
    id: 6,
    name: 'Joint Pain',
    category: 'musculoskeletal',
    severity: 'low',
    icon: 'bone',
    suggestedSpecialty: 'Orthopedics',
    description: 'Pain in joints or surrounding areas'
  },
  {
    id: 7,
    name: 'Skin Rash',
    category: 'dermatological',
    severity: 'low',
    icon: 'skin',
    suggestedSpecialty: 'Dermatology',
    description: 'Unusual skin changes or irritation'
  },
  {
    id: 8,
    name: 'Dizziness',
    category: 'neurological',
    severity: 'medium',
    icon: 'balance',
    suggestedSpecialty: 'Neurology',
    description: 'Feeling lightheaded or unsteady'
  },
  {
    id: 9,
    name: 'Nausea',
    category: 'gastrointestinal',
    severity: 'low',
    icon: 'stomach',
    suggestedSpecialty: 'Gastroenterology',
    description: 'Feeling of sickness with urge to vomit'
  },
  {
    id: 10,
    name: 'Fatigue',
    category: 'general',
    severity: 'low',
    icon: 'tired',
    suggestedSpecialty: 'Internal Medicine',
    description: 'Extreme tiredness or lack of energy'
  }
];

export const emergencySymptoms = [
  'Severe Chest Pain',
  'Difficulty Breathing',
  'Severe Head Injury',
  'Severe Bleeding',
  'Loss of Consciousness',
  'Severe Burns',
  'Signs of Stroke',
  'Severe Allergic Reaction'
];

export const symptomCategories = [
  'cardiovascular',
  'neurological',
  'respiratory',
  'gastrointestinal',
  'musculoskeletal',
  'dermatological',
  'general'
];

export const getSymptomById = (id: number): Symptom | undefined => {
  return commonSymptoms.find(symptom => symptom.id === id);
};

export const getSymptomsByCategory = (category: string): Symptom[] => {
  return commonSymptoms.filter(symptom => symptom.category === category);
};

export const getSymptomsBySeverity = (severity: 'low' | 'medium' | 'high' | 'emergency'): Symptom[] => {
  return commonSymptoms.filter(symptom => symptom.severity === severity);
};

export const getSymptomsBySpecialty = (specialty: string): Symptom[] => {
  return commonSymptoms.filter(symptom => 
    symptom.suggestedSpecialty?.toLowerCase().includes(specialty.toLowerCase())
  );
};

export const isEmergencySymptom = (symptomName: string): boolean => {
  return emergencySymptoms.some(emergency => 
    emergency.toLowerCase().includes(symptomName.toLowerCase())
  );
};