'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

const scenarioOptions = [
  { id: 'hours-worked', name: 'Hours Worked' },
  { id: 'points-system', name: 'Points System' },
  { id: 'percentage-split', name: 'Percentage-Based Split' },
  { id: 'tip-out', name: 'Tip-Out System' },
  { id: 'hybrid', name: 'Hybrid Model' },
];

const positions = [
  "Bartender", "Lead Bartender", "Barback", "Lead Barback", 
  "Server", "Back Server", "Lead Server", "Busser", "Runner", 
  "Line Cook", "Lead Chef", "Dishwasher", "Sommelier", "Host", "Other"
];

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const { templateId } = params;
  
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });

  useEffect(() => {
    if (!templateId) return;
    const fetchTemplate = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/templates/${templateId}`);
        if (!response.ok) throw new Error('Template not found');
        const data = await response.json();
        const employeesWithIds = data.employees.map((emp: any, index: number) => ({
          ...emp,
          id: emp.id || Date.now() + index,
        }));
        setFormData({ ...data, employees: employeesWithIds });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  const employeePositions = useMemo(() => {
    if (!formData?.employees) return [];
    return [...new Set(formData.employees.map(emp => emp.position).filter(Boolean))];
  }, [formData?.employees]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) return;
    handleFormChange('employees', [...formData.employees, { ...newEmployee, id: Date.now() }]);
    setNewEmployee({ name: '', position: '' });
  };
  
  const handleRemoveEmployee = (idToRemove) => {
    handleFormChange('employees', formData.employees.filter(emp => emp.id !== idToRemove));
  };
  
  const handleDetailChange = (type, key, value) => {
    handleFormChange('scenarioDetails', {
      ...formData.scenarioDetails,
      [type]: {
        ...formData.scenarioDetails[type],
        [key]: parseFloat(value) || 0,
      }
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError('');
    try {
        const response = await fetch(`/api/templates/${templateId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to save changes.");
        router.push('/templates');
    } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="text-center p-10"><span className="loading loading-spinner"></span></div>;
  }
  
  const showPoints = ['points-system', 'hybrid'].includes(formData.scenario);
  const showPercentages = ['percentage-split', 'tip-out', 'hybrid'].includes(formData.scenario);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Template</h1>
      <div className="space-y-8">
        
        {/* THIS IS THE MISSING PIECE */}
        <div className="card bg-base-100 shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Template Name</span>
                </label>
                <input 
                  type="text" 
                  value={formData.templateName} 
                  onChange={(e) => handleFormChange('templateName', e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Time Span</span>
                </label>
                <select 
                  className="select select-bordered" 
                  value={formData.timeSpan} 
                  onChange={(e) => handleFormChange('timeSpan', e.target.value)}
                >
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                </select>
              </div>
          </div>
        </div>
        {/* END OF MISSING PIECE */}

        {/* Employee Roster */}
        <div className="card bg-base-100 shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Employee Roster</h2>
            <div className="space-y-2 mb-4">
                {formData.employees.map((emp) => (
                  <div key={emp.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{emp.name} - <span className="text-gray-600">{emp.position}</span></span>
                    <button onClick={() => handleRemoveEmployee(emp.id)} className="btn btn-xs btn-error btn-outline">Remove</button>
                  </div>
                ))}
            </div>
            <div className="flex gap-4 items-end border-t pt-4">
                <div className="form-control flex-grow">
                  <label className="label pb-1"><span className="label-text">Employee Name</span></label>
                  <input placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="input input-bordered w-full"/>
                </div>
                <div className="form-control flex-grow">
                    <label className="label pb-1"><span className="label-text">Position</span></label>
                    <select value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} className="select select-bordered w-full">
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
                onClick={() => handleFormChange('scenario', opt.id)}
                className={`p-4 border rounded-lg text-center font-medium cursor-pointer transition-all ${
                  formData.scenario === opt.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {opt.name}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-6">
            {showPoints && (
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-lg mb-3">Assign Points</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {employeePositions.map(pos => (
                    <div key={pos}>
                      <label className="block text-sm font-medium">{pos}</label>
                      <input type="number" placeholder="e.g., 10" value={formData.scenarioDetails.points?.[pos] || ''} onChange={(e) => handleDetailChange('points', pos, e.target.value)} className="w-full px-3 py-2 border rounded-md"/>
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
                      <input type="number" placeholder="e.g., 20" value={formData.scenarioDetails.percentages?.[pos] || ''} onChange={(e) => handleDetailChange('percentages', pos, e.target.value)} className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {error && <p className="text-error text-center mt-4">{error}</p>}
        <div className="flex justify-end pt-4">
          <button onClick={handleSaveChanges} className={`btn btn-primary ${isSaving ? 'loading' : ''}`} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}