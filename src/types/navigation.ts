export interface NavigationStep {
  id: number;
  title: string;
  description: string;
  instruction: string;
  floor?: number;
  estimatedTime?: string;
  landmarks?: string[];
}

export interface Checkpoint {
  id: number;
  name: string;
  type: 'entrance' | 'department' | 'room' | 'elevator' | 'emergency';
  floor: number;
  coordinates?: {
    x: number;
    y: number;
  };
  description?: string;
}

export interface NFCScanResult {
  checkpointId: number;
  timestamp: string;
  patientId?: number;
  success: boolean;
  errorMessage?: string;
}

export interface IndoorMap {
  id: number;
  hospitalId: number;
  floor: number;
  imageUrl: string;
  checkpoints: Checkpoint[];
  paths: NavigationPath[];
}

export interface NavigationPath {
  from: number; // checkpoint ID
  to: number;   // checkpoint ID
  distance: number;
  estimatedTime: string;
  instructions: string[];
}