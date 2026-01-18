
export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Case Study' | 'Cultural';
  status?: 'pass' | 'fail';
}

export interface MasterclassData {
  coreConcept: string;
  why: string;
  technicalPoints: string[];
  insiderTip: string;
  redFlags: string[];
}

export interface CareerPathData {
  roadmap: { year: string; milestones: string[] }[];
  highDemandSkills: string[];
  localCerts: string[];
}

export interface SalaryData {
  bands: { min: string; median: string; max: string };
  bonusStructure: string;
  colAdjustment: string;
  equityInsights: string;
}

export interface NetworkingData {
  hubs: string[];
  meetups: string[];
  conferences: string[];
  scripts: { platform: string; content: string }[];
}

export interface AppState {
  jobTitle: string;
  location: string;
  questions: InterviewQuestion[];
  isSearching: boolean;
  isLoadingMore: boolean;
  searchProgress: number;
  error: string | null;
}

export type ViewMode = 'SEARCH' | 'RESULTS' | 'MASTERCLASS' | 'TRAINING' | 'SIMULATION' | 'CAREER_PATH' | 'SALARY_INSIGHTS' | 'NETWORKING';
