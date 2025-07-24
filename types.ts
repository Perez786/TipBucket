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

// Results interfaces
export interface EmployeeResult {
  id?: number;
  name: string;
  position: string;
  earnedTips: number;
  earnedCreditCardTips: number;
  earnedCashTips: number;
  earnedServiceChargeTips: number;
  totalHours: number;
  hourlyRate: number;
  daysWorked: { [day: string]: { hours: number } };
}

export interface EmployeeDetail {
  name: string;
  position: string;
  hoursWorked: number;
  creditCardTips: number;
  cashTips: number;
  serviceChargeTips: number;
  totalTips: number;
  hourlyRate: number;
}

export interface DailyBreakdown {
  dayLabel: string;
  creditCardTips: number;
  cashTips: number;
  serviceChargeTips: number;
  totalTips: number;
  totalHours: number;
  hourlyRate: number;
  employeeDetails: EmployeeDetail[];
}

export interface PositionSummary {
  position: string;
  totalHours: number;
  totalTips: number;
  totalCreditCardTips: number;
  totalCashTips: number;
  totalServiceChargeTips: number;
  employeeCount: number;
  averageHourlyRate: number;
  hourlyRate: number;
}

export interface ResultsSummary {
  totalTipPool: number;
  totalCashTips: number;
  totalCreditCardTips: number;
  totalServiceChargeTips: number;
  totalHours: number;
  totalHoursWorked: number;
  averageHourlyRate: number;
  totalHourlyRate: number;
}

export interface CalculationResults {
  employeeResults: EmployeeResult[];
  summary: ResultsSummary;
  positionSummary: PositionSummary[];
  dailyBreakdown: { [key: string]: DailyBreakdown };
  rawData: FormData;
}

export interface ResultsPageProps {
  results: CalculationResults | null;
  startOver: () => void;
}
