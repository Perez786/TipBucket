'use client';

import React, { useState, useMemo } from 'react';
import { ScenarioProps } from '../../types';

const scenarioOptions = [
  { id: 'hours-worked', name: 'Hours Worked' },
  { id: 'points-system', name: 'Points System' },
  { id: 'percentage-split', name: 'Percentage-Based Split' },
  { id: 'tip-out', name: 'Tip-Out System' },
  { id: 'hybrid', name: 'Hybrid Model' },
];

interface ScenarioComponentProps extends ScenarioProps {
  submitButtonText?: string;
}

const Scenario: React.FC<ScenarioComponentProps> = ({ formData, setFormData, nextStep, prevStep, submitButtonText = 'Calculate Tips' }) => {
  const [selectedScenario, setSelectedScenario] = useState(formData.scenario || '');
  const [details, setDetails] = useState(formData.scenarioDetails || { points: {}, percentages: {}, hybridSplit: { hours: 70, points: 30 } });

  const employeePositions = useMemo(() => 
    [...new Set(formData.employees.map(emp => emp.position).filter(Boolean))]
  , [formData.employees]);

  const handleDetailChange = (type: string, key: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      [type]: { ...(prev[type as keyof typeof prev] as Record<string, number>), [key]: parseFloat(value) || 0 }
    }));
  };

  const handleHybridSplitChange = (part: string, value: string) => {
    const val = parseInt(value, 10) || 0;
    const otherPart = part === 'hours' ? 'points' : 'hours';
    setDetails(prev => ({
        ...prev,
        hybridSplit: {
            ...prev.hybridSplit,
            [part]: val,
            [otherPart]: 100 - val
        }
    }));
  };

  const handleNext = () => {
    setFormData({ ...formData, scenario: selectedScenario, scenarioDetails: details });
    nextStep();
  };

  const renderConditionalInputs = () => {
    const showPoints = selectedScenario === 'points-system' || selectedScenario === 'hybrid';
    const showPercentages = selectedScenario === 'percentage-split' || selectedScenario === 'tip-out' || selectedScenario === 'hybrid';
    const showHybrid = selectedScenario === 'hybrid';

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
                  value={details.hybridSplit?.hours || ''}
                  onChange={(e) => handleHybridSplitChange('hours', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Split by Points (%)</label>
                <input 
                  type="number"
                  value={details.hybridSplit?.points || ''}
                  onChange={(e) => handleHybridSplitChange('points', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
        {showPoints && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 className="font-semibold text-lg mb-3">Assign Points</h4>
            <div className="grid grid-cols-2 gap-4">
              {employeePositions.map(pos => (
                <div key={pos}>
                  <label className="block text-sm font-medium">{pos}</label>
                  <input 
                    type="number"
                    placeholder="e.g., 10"
                    value={details.points?.[pos] || ''}
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
            <h4 className="font-semibold text-lg mb-3">Assign Percentages</h4>
            <div className="grid grid-cols-2 gap-4">
              {employeePositions.map(pos => (
                <div key={pos}>
                  <label className="block text-sm font-medium">{pos} (%)</label>
                  <input 
                    type="number"
                    placeholder="e.g., 15"
                    value={details.percentages?.[pos] || ''}
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
            }`}>
            {opt.name}
          </div>
        ))}
      </div>

      {selectedScenario && renderConditionalInputs()}

      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-400 transition duration-300">
          Back
        </button>
        <button onClick={handleNext} disabled={!selectedScenario} className="bg-primary text-white font-bold py-2 px-6 rounded hover:bg-primary-dark transition duration-300 disabled:bg-gray-400">
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default Scenario;
