'use client';

import React, { useState } from 'react';

const positionOptions = [
  "Bartender", "Lead Bartender", "Barback", "Lead Barback", "Server", 
  "Back Server", "Lead Server", "Busser", "Runner", "Line Cook", 
  "Lead Chef", "Dishwasher", "Sommelier", "Host", "Other"
];

const EmployeeData = ({ formData, setFormData, nextStep, prevStep, isTemplateMode = false }) => {
  const [employees, setEmployees] = useState(formData.employees.length > 0 ? formData.employees : [{ id: 1, name: '', position: '', daysWorked: {} }]);
  const dayNames = !isTemplateMode ? [...Array(formData.timeSpan === 'Weekly' ? 7 : 14)].map((_, i) => { 
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
    const weekday = weekdays[i % 7];
    return `${weekday} - Day ${i + 1}`;
}) : [];

  const addEmployee = () => {
    setEmployees([...employees, { id: Date.now(), name: '', position: '', daysWorked: {} }]);
  };

  const removeEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleEmployeeChange = (id, field, value) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    );
    setEmployees(updatedEmployees);
  };

  const handleDayChange = (empId, dayIndex, isChecked) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === empId) {
        const newDaysWorked = { ...emp.daysWorked };
        if (isChecked) {
          newDaysWorked[dayIndex] = { hours: '' };
        } else {
          delete newDaysWorked[dayIndex];
        }
        return { ...emp, daysWorked: newDaysWorked };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
  };

  const handleHoursChange = (empId, dayIndex, hours) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === empId) {
        const newDaysWorked = { 
          ...emp.daysWorked,
          [dayIndex]: { hours: parseFloat(hours) || '' }
        };
        return { ...emp, daysWorked: newDaysWorked };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
  };

  const handleNext = () => {
    setFormData({ ...formData, employees });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Step 2: Employee Data</h2>
      
      {employees.map((employee, index) => (
        <div key={employee.id} className="p-4 border border-gray-200 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Employee #{index + 1}</h3>
            {employees.length > 1 && (
              <button onClick={() => removeEmployee(employee.id)} className="text-red-500 hover:text-red-700 font-bold">Remove</button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name of Employee"
              value={employee.name}
              onChange={(e) => handleEmployeeChange(employee.id, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={employee.position}
              onChange={(e) => handleEmployeeChange(employee.id, 'position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Position</option>
              {positionOptions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
          {!isTemplateMode && (
            <div className="mt-4">
              <p className="font-medium mb-2">Days Worked:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {dayNames.map((day, dayIndex) => (
                  <div key={dayIndex} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`day-${employee.id}-${dayIndex}`}
                      checked={!!employee.daysWorked[dayIndex]}
                      onChange={(e) => handleDayChange(employee.id, dayIndex, e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-highlight border-gray-300 rounded"
                    />
                    <label htmlFor={`day-${employee.id}-${dayIndex}`} className="ml-2 text-sm">{day}</label>
                    {employee.daysWorked[dayIndex] && (
                      <input
                        type="number"
                        placeholder="Hrs"
                        value={employee.daysWorked[dayIndex].hours}
                        onChange={(e) => handleHoursChange(employee.id, dayIndex, e.target.value)}
                        className="w-16 ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addEmployee} className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition">
        + Add Another Employee
      </button>

      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-400 transition duration-300">
          Back
        </button>
        <button onClick={handleNext} className="bg-primary text-white font-bold py-2 px-6 rounded hover:bg-primary-dark transition duration-300">
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeData;
