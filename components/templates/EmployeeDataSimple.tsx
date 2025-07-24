'use client';
import { useState } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  daysWorked?: { [day: string]: number };
}

interface EmployeeDataSimpleProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

const positions = ["Bartender", "Lead Bartender", "Barback", "Lead Barback", "Server", "Back Server", "Lead Server", "Busser", "Runner", "Line Cook", "Lead Chef", "Dishwasher", "Sommelier", "Host", "Other"];

export default function EmployeeDataSimple({ employees, setEmployees }: EmployeeDataSimpleProps) {
  // Local state for the "Add New Employee" form
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');

  // This is a "guard clause". It MUST be the first thing in the render logic.
  // If the employees prop is not a valid array, we render nothing to prevent crashes.
  if (!Array.isArray(employees)) {
    return null; 
  }

  const handleAddEmployee = () => {
    if (!name || !position) {
      alert("Please provide a name and position.");
      return;
    }
    const newEmployee = { id: Date.now(), name, position };
    // Tell the parent page about the new, complete array
    setEmployees([...employees, newEmployee]);
    // Clear the local form
    setName('');
    setPosition('');
  };

  const handleRemoveEmployee = (idToRemove: number) => {
    console.log("--- handleRemoveEmployee triggered ---");
    console.log("ID to remove:", idToRemove);
    console.log("Array BEFORE filter:", JSON.stringify(employees));
    
    // Create a new array, filtering out the employee with the matching ID
    const updatedEmployees = employees.filter(emp => emp.id !== idToRemove);
    
    console.log("Array AFTER filter:", JSON.stringify(updatedEmployees));
    
    // Tell the parent page about the new, filtered array
    setEmployees(updatedEmployees);
  };
  
  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Employee Roster</h2>
      
      {/* List of current employees */}
      <div className="space-y-2 mb-4">
        {employees.map(emp => (
          <div key={emp.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>{emp.name} - <span className="text-gray-600">{emp.position}</span></span>
            <button onClick={() => handleRemoveEmployee(emp.id)} className="btn btn-xs btn-error btn-outline">Remove</button>
          </div>
        ))}
        {employees.length === 0 && (
            <p className="text-sm text-gray-500 text-center">No employees have been added to this template yet.</p>
        )}
      </div>
      
      {/* Form for adding a new employee */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">New Employee Name </span></label>
            <input type="text" placeholder="John Doe" className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Position </span></label>
            <select className="select select-bordered" value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="" disabled>Select a position</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleAddEmployee} className="btn btn-secondary">Add Employee</button>
        </div>
      </div>
    </div>
  );
}