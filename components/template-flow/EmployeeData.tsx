'use client';

import { FormData } from '../../types';
import React from 'react';

interface TemplateEmployeeDataProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onCalculate: () => void;
  prevStep: () => void;
}

const EmployeeData: React.FC<TemplateEmployeeDataProps> = ({ formData, setFormData, onCalculate, prevStep }) => {
  // Guard clause to ensure all necessary data is loaded before rendering
  if (!formData || !formData.employees || !formData.dailyTips) {
    return <div className="text-center p-10"><span className="loading loading-spinner"></span></div>;
  }

  // Define the day names for our label
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayKeys = Object.keys(formData.dailyTips);

  // This function handles when a day's checkbox is checked or unchecked
  const handleDayChange = (employeeId: number, dayKey: string, isChecked: boolean) => {
    const updatedEmployees = formData.employees.map(emp => {
      if (emp.id === employeeId) {
        const newDaysWorked = { ...emp.daysWorked };
        if (isChecked) {
          newDaysWorked[dayKey] = 0; // Start with 0 hours
        } else {
          delete newDaysWorked[dayKey];
        }
        return { ...emp, daysWorked: newDaysWorked };
      }
      return emp;
    });
    setFormData({ ...formData, employees: updatedEmployees });
  };

  // This function handles changes to the hours input field
  const handleHoursChange = (employeeId: number, dayKey: string, hours: string) => {
    const updatedEmployees = formData.employees.map(emp => {
      if (emp.id === employeeId) {
        const newDaysWorked = { ...emp.daysWorked };
        newDaysWorked[dayKey] = parseFloat(hours) || 0;
        return { ...emp, daysWorked: newDaysWorked };
      }
      return emp;
    });
    setFormData({ ...formData, employees: updatedEmployees });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Step 2: Enter Hours Worked</h2>
      
      <div className="space-y-6">
        {formData.employees.map((employee) => (
          <div key={employee.id} className="card bg-base-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold">{employee.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{employee.position}</p>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 text-sm"> Select days worked and enter hours:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                {dayKeys.map((dayKey, index) => {
                    const dayIndex = index + 1; // 1-based index for display
                    const isChecked = employee.daysWorked.hasOwnProperty(dayKey);
                    
                    // THIS IS THE CORRECTED NAMING CONVENTION
                    const dayName = dayNames[index % 7];
                    const dayLabel = `${dayName} - Day ${dayIndex}`;

                    return (
                        <div key={dayKey} className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleDayChange(employee.id, dayKey, e.target.checked)}
                                    className="checkbox checkbox-primary"
                                />
                                <span className="label-text text-sm">{dayLabel}</span>
                            </label>
                            {isChecked && (
                                <input 
                                    type="number" 
                                    placeholder="Hours"
                                    value={employee.daysWorked[dayKey] || ''}
                                    onChange={(e) => handleHoursChange(employee.id, dayKey, e.target.value)}
                                    className="input input-bordered input-sm w-full mt-1" 
                                />
                            )}
                        </div>
                    )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} className="btn">Back</button>
        <button onClick={onCalculate} className="btn btn-primary">Calculate Tips</button>
      </div>
    </div>
  );
};

export default EmployeeData;