export interface UserProfile {
  id: string;
  name: string;
  citizenship: string; // Origin
}

export interface VisaOption {
  id: string;
  country: string;
  visaName: string; // e.g., "H-1B", "Job Seeker"
  intent: string; // "Work", "Study"
  maxDuration: string;
  processingTime: string;
  difficulty: 'Low' | 'Medium' | 'High';
  requirementsSummary: string;
}

export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  status: 'active' | 'locked' | 'completed';
  requiredDoc?: string;
}

export interface ApplicationInstance {
  id: string;
  visaOption: VisaOption;
  startDate: string;
  progress: number; // 0 to 100
  currentStepIndex: number;
  steps: ChecklistStep[];
}

export enum AppView {
  DISCOVERY = 'DISCOVERY',
  BINDER = 'BINDER',
  PROFILE = 'PROFILE'
}