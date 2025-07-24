'use client';
import { useMemo } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  daysWorked?: { [day: string]: number };
}

interface ScenarioDetails {
  points?: { [key: string]: number };
  percentages?: { [key: string]: number };
  hybridSplit?: { hours: number; points: number };
}

interface ScenarioSimpleProps {
  employees: Employee[];
  scenario: string;
  setScenario: (scenario: string) => void;
  scenarioDetails: ScenarioDetails;
  setScenarioDetails: (details: ScenarioDetails | ((prev: ScenarioDetails) => ScenarioDetails)) => void;
}

const scenarioOptions = [
  { id: 'hours-worked', name: 'Hours Worked' },
  { id: 'points-system', name: 'Points System' },
  { id: 'percentage-split', name: 'Percentage-Based Split' },
  { id: 'tip-out', name: 'Tip-Out System' },
  { id: 'hybrid', name: 'Hybrid Model' },
];

export default function ScenarioSimple({ employees, scenario, setScenario, scenarioDetails, setScenarioDetails }: ScenarioSimpleProps) {
// This is a "guard clause". If employees is not a valid array, it stops right here.
  if (!Array.isArray(employees)) {
    return null; // or return a loading indicator, or an empty div
  }

  const employeePositions = useMemo(() => 
    [...new Set(employees.map(emp => emp.position).filter(Boolean))]
  , [employees]);

  const handleDetailChange = (type: 'points' | 'percentages', key: string, value: string) => {
    setScenarioDetails(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: value }
    }));
  };
  
  // ... (You can copy the renderConditionalInputs logic from the main Scenario.tsx if needed)
  // For simplicity, we'll just show the selector here.
  
  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Distribution Scenario</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarioOptions.map(opt => (
          <div 
            key={opt.id} 
            onClick={() => setScenario(opt.id)}
            className={`p-4 border rounded-lg cursor-pointer text-center font-medium transition-all ${
              scenario === opt.id 
                ? 'bg-primary text-white'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
            {opt.name}
          </div>
        ))}
      </div>
       {/* Placeholder for conditional inputs. You can add the full logic from the main Scenario component here later. */}
    </div>
  );
}