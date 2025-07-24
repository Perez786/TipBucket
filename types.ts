// Shared TypeScript interfaces for the tip distribution application

export interface Employee {
  id: number;
  name: string;
  position: string;
  daysWorked: { [day: string]: number }; // e.g., { Monday: 5, Tuesday: 4 }
}

export interface FormData {
  employees: Employee[];
  timeSpan: 'Weekly' | 'Bi-Weekly';
  totalTips?: number;
  templateName?: string;
  location?: string;
  scenario?: string;
  scenarioDetails?: {
    points?: Record<string, number>;
    percentages?: Record<string, number>;
    hybridSplit?: { hours: number; points: number };
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // for any extra fields used temporarily
}

// More specific interface for template pages that always have scenarioDetails
export interface TemplateFormData extends FormData {
  templateName: string;
  scenario: string;
  scenarioDetails: {
    points: Record<string, number>;
    percentages: Record<string, number>;
    hybridSplit: { hours: number; points: number };
  };
}

// Props interfaces for components
export interface EmployeeDataProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
  prevStep: () => void;
  isTemplateMode?: boolean;
}

export interface TimeSpanAndTipsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
}

export interface ScenarioProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
  prevStep: () => void;
}
