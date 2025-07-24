'use client';

import React, { useState, useMemo, useEffect } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  daysWorked: { [day: string]: number };
}

interface FormData {
  employees: Employee[];
  dailyTips: { [day: string]: { creditCardTips: number; cashTips: number; serviceChargeTips: number } };
  timeSpan: 'Weekly' | 'Bi-Weekly';
  scenario: string;
  scenarioDetails: {
    points?: { [key: string]: number };
    percentages?: { [key: string]: number };
    hybridSplit?: { hours: number; points: number };
  };
  templateName?: string;
}

interface ScenarioProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitButtonText?: string;
}

const scenarioOptions = [
  { id: 'hours-worked', name: 'Hours Worked' },
  { id: 'points-system', name: 'Points System' },
  { id: 'percentage-split', name: 'Percentage-Based Split' },
  { id: 'tip-out', name: 'Tip-Out System' },
  { id: 'hybrid', name: 'Hybrid Model' },
];

const Scenario: React.FC<ScenarioProps> = ({ formData, setFormData, nextStep, prevStep, submitButtonText = 'Calculate Tips' }) => {
  const [selectedScenario, setSelectedScenario] = useState(formData.scenario || '');
  const [details, setDetails] = useState(formData.scenarioDetails || {
    points: {},
    percentages: {},
    hybridSplit: { hours: 70, points: 30 }
  });

  const employeePositions = useMemo(() => (
    [...new Set(formData.employees?.map(emp => emp.position).filter(Boolean))]
  ), [formData.employees]);

  const readyToRenderInputs = selectedScenario && employeePositions.length > 0;

  useEffect(() => {
    console.log("✅ Scenario.tsx mounted");
    console.log("Selected Scenario:", selectedScenario);
    console.log("Employee Positions:", employeePositions);
    console.log("Details:", details);
  }, [selectedScenario, employeePositions, details]);

  const handleDetailChange = (type: 'points' | 'percentages', key: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: parseFloat(value) || 0
      }
    }));
  };

  const handleHybridSplitChange = (part: 'hours' | 'points', value: string) => {
    const val = parseFloat(value) || 0;
    const otherPart = part === 'hours' ? 'points' : 'hours';
    setDetails(prev => ({
      ...prev,
      hybridSplit: {
        hours: part === 'hours' ? val : Math.max(0, 100 - val),
        points: part === 'points' ? val : Math.max(0, 100 - val)
      }
    }));
  };

  const handleNext = () => {
    setFormData({ ...formData, scenario: selectedScenario, scenarioDetails: details });
    nextStep();
  };

  const renderConditionalInputs = () => {
    const showHybrid = selectedScenario === 'hybrid';
    const showPoints = selectedScenario === 'points-system' || showHybrid;
    const showPercentages = ['percentage-split', 'tip-out', 'hybrid'].includes(selectedScenario);

    return (
      <div className="mt-6 space-y-6">
        {showHybrid && (
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-semibold text-lg mb-3">Hybrid Model Split</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Split by Hours (%)</label>
                <input 
                  type="number"
                  value={details.hybridSplit?.hours || 0}
                  onChange={(e) => handleHybridSplitChange('hours', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Split by Points (%)</label>
                <input 
                  type="number"
                  value={details.hybridSplit?.points || 0}
                  onChange={(e) => handleHybridSplitChange('points', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {showPoints && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 className="font-semibold text-lg mb-3">Assign Points to Each Position</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {employeePositions.map(pos => (
                <div key={pos}>
                  <label className="block text-sm font-medium">{pos}</label>
                  <input 
                    type="number"
                    placeholder="e.g., 10"
                    value={details.points?.[pos] ?? ''}
                    onChange={(e) => handleDetailChange('points', pos, e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {showPercentages && (
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h4 className="font-semibold text-lg mb-3">Assign Percentages to Each Position</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {employeePositions.map(pos => (
                <div key={pos}>
                  <label className="block text-sm font-medium">{pos} (%)</label>
                  <input 
                    type="number"
                    placeholder="e.g., 20"
                    value={details.percentages?.[pos] ?? ''}
                    onChange={(e) => handleDetailChange('percentages', pos, e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ✅ Prompt if no employees exist yet
  if (!formData || !formData.employees || formData.employees.length === 0) {
    return (
      <div className="text-center p-10 text-gray-600">
        <h2 className="text-xl font-semibold mb-4">Step 3: Distribution Scenario</h2>
        <p>Please add employees before choosing a distribution scenario.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Step 3: Distribution Scenario</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarioOptions.map(opt => (
          <div 
            key={opt.id} 
            onClick={() => setSelectedScenario(opt.id)}
            className={`p-4 border rounded-lg cursor-pointer text-center font-medium transition-all ${
              selectedScenario === opt.id 
                ? 'bg-primary text-white border-primary-dark ring-2 ring-highlight'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {opt.name}
          </div>
        ))}
      </div>

      <p className="text-center mt-4 text-sm text-gray-500">Selected scenario: {selectedScenario}</p>

      {readyToRenderInputs ? renderConditionalInputs() : (
        <div className="mt-6 text-center text-sm text-gray-500">
          No positions found yet. Please create your employee roster first.
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-400 transition duration-300"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedScenario}
          className={`py-2 px-6 font-bold rounded transition duration-300 ${
            !selectedScenario ? 'bg-gray-400 text-gray-700' : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default Scenario;
