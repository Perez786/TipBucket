'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Employee, TemplateFormData } from '../../../types';

const scenarioOptions = [
  { id: 'hours-worked', name: 'Hours Worked' },
  { id: 'points-system', name: 'Points System' },
  { id: 'percentage-split', name: 'Percentage-Based Split' },
  { id: 'tip-out', name: 'Tip-Out System' },
  { id: 'hybrid', name: 'Hybrid Model' },
];

// Define the official list of positions once
const positions = [
  "Bartender", "Lead Bartender", "Barback", "Lead Barback", 
  "Server", "Back Server", "Lead Server", "Busser", "Runner", 
  "Line Cook", "Lead Chef", "Dishwasher", "Sommelier", "Host", "Other"
];

export default function NewTemplatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TemplateFormData>({
    templateName: '',
    timeSpan: 'Weekly',
    employees: [],
    scenario: '',
    scenarioDetails: {
      points: {},
      percentages: {},
      hybridSplit: { hours: 70, points: 30 }
    }
  });

  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });
  const [error, setError] = useState('');

  const employeePositions = useMemo(() => (
    [...new Set(formData.employees.map(emp => emp.position).filter(Boolean))]
  ), [formData.employees]);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) {
      setError("Please provide a name and select a position for the new employee.");
      return;
    }
    setError('');
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, { ...newEmployee, id: Date.now(), daysWorked: {} }] // Add a temporary ID and daysWorked
    }));
    setNewEmployee({ name: '', position: '' }); // Reset the form
  };

  const handleRemoveEmployee = (idToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        employees: prev.employees.filter(emp => emp.id !== idToRemove)
    }));
  };

  const handleScenarioSelect = (id: string) => {
    setFormData(prev => ({
      ...prev,
      scenario: id,
    }));
  };

  const handleDetailChange = (type: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scenarioDetails: {
        ...prev.scenarioDetails,
        [type]: {
          ...(prev.scenarioDetails[type as keyof typeof prev.scenarioDetails] as Record<string, number>),
          [key]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleHybridSplitChange = (part: string, value: string) => {
    const val = parseFloat(value) || 0;
    const otherPart = part === 'hours' ? 'points' : 'hours';
    setFormData(prev => ({
      ...prev,
      scenarioDetails: {
        ...prev.scenarioDetails,
        hybridSplit: {
          ...prev.scenarioDetails.hybridSplit,
          [part]: val,
          [otherPart]: Math.max(0, 100 - val)
        }
      }
    }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.templateName) {
        setError("Template name is required.");
        return;
    }
    if (formData.employees.length === 0) {
        setError("Please add at least one employee.");
        return;
    }
    if (!formData.scenario) {
        setError("Please select a distribution scenario.");
        return;
    }

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Template creation failed');
      router.push('/templates');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const showPoints = ['points-system', 'hybrid'].includes(formData.scenario);
  const showPercentages = ['percentage-split', 'tip-out', 'hybrid'].includes(formData.scenario);
  const showHybridSplit = formData.scenario === 'hybrid';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Template</h1>

      <div className="space-y-8">
        {/* Template Name & Time Span */}
        <div className="card bg-base-100 shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Template Name</span></label>
              <input
                value={formData.templateName}
                onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Time Span</span></label>
              <select
                value={formData.timeSpan}
                onChange={(e) => setFormData({ ...formData, timeSpan: e.target.value as 'Weekly' | 'Bi-Weekly' })}
                className="select select-bordered w-full"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Employee Roster */}
        <div className="card bg-base-100 shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Employee Roster</h2>
            <div className="space-y-2 mb-4">
                {formData.employees.map((emp: Employee) => (
                  <div key={emp.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{emp.name} - <span className="text-gray-600">{emp.position}</span></span>
                    <button onClick={() => handleRemoveEmployee(emp.id)} className="btn btn-xs btn-error btn-outline">Remove</button>
                  </div>
                ))}
                {formData.employees.length === 0 && <p className="text-sm text-center text-gray-500">No employees added yet.</p>}
            </div>
            <div className="flex gap-4 items-end border-t pt-4">
                <div className="form-control flex-grow">
                  <label className="label pb-1"><span className="label-text">Employee Name</span></label>
                  <input
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control flex-grow">
                    <label className="label pb-1"><span className="label-text">Position</span></label>
                    {/* THIS IS THE CORRECTED DROPDOWN */}
                    <select
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled>Select a position</option>
                        {positions.map(p => (<option key={p} value={p}>{p}</option>))}
                    </select>
                </div>
                <button onClick={handleAddEmployee} className="btn btn-secondary">Add</button>
            </div>
        </div>

        {/* Distribution Scenario */}
        <div className="card bg-base-100 shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Distribution Scenario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarioOptions.map(opt => (
              <div
                key={opt.id}
                onClick={() => handleScenarioSelect(opt.id)}
                className={`p-4 border rounded-lg text-center font-medium cursor-pointer transition-all ${
                  formData.scenario === opt.id 
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {opt.name}
              </div>
            ))}
          </div>

          {/* Dynamic Inputs Based on Scenario */}
          <div className="mt-6 space-y-6">
            {showHybridSplit && (
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-lg mb-3">Hybrid Model Split</h4>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Split by Hours (%)</label>
                    <input type="number" value={formData.scenarioDetails.hybridSplit.hours} onChange={(e) => handleHybridSplitChange('hours', e.target.value)} className="w-full px-3 py-2 border rounded-md"/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Split by Points (%)</label>
                    <input type="number" value={formData.scenarioDetails.hybridSplit.points} onChange={(e) => handleHybridSplitChange('points', e.target.value)} className="w-full px-3 py-2 border rounded-md"/>
                  </div>
                </div>
              </div>
            )}

            {showPoints && (
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-lg mb-3">Assign Points</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {employeePositions.map(pos => (
                    <div key={pos}>
                      <label className="block text-sm font-medium">{pos}</label>
                      <input type="number" placeholder="e.g., 10" value={formData.scenarioDetails.points[pos] || ''} onChange={(e) => handleDetailChange('points', pos, e.target.value)} className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showPercentages && (
              <div className="p-4 border rounded-lg bg-purple-50">
                <h4 className="font-semibold text-lg mb-3">Assign Percentages</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {employeePositions.map(pos => (
                    <div key={pos}>
                      <label className="block text-sm font-medium">{pos} (%)</label>
                      <input type="number" placeholder="e.g., 20" value={formData.scenarioDetails.percentages[pos] || ''} onChange={(e) => handleDetailChange('percentages', pos, e.target.value)} className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-error text-center mt-4">{error}</p>}

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}