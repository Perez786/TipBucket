'use client';

import React from 'react';

const TimeSpanAndTips = ({ formData, setFormData, nextStep }) => {
  const days = formData.timeSpan === 'Weekly' ? 7 : 14;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleTimeSpanChange = (e) => {
    setFormData({ ...formData, timeSpan: e.target.value, dailyTips: {} });
  };

  const handleTipChange = (dayIndex, tipType, value) => {
    const dayKey = `day${dayIndex + 1}`;
    const updatedDailyTips = {
      ...formData.dailyTips,
      [dayKey]: {
        ...formData.dailyTips[dayKey],
        [tipType]: parseFloat(value) || 0,
      },
    };
    setFormData({ ...formData, dailyTips: updatedDailyTips });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Step 1: Time Span & Tips</h2>
      
      <div className="mb-6">
        <label htmlFor="time-span" className="block text-sm font-medium text-gray-700 mb-2">Select Time Span</label>
        <select
          id="time-span"
          value={formData.timeSpan}
          onChange={handleTimeSpanChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-highlight"
        >
          <option value="Weekly">Weekly</option>
          <option value="Bi-Weekly">Bi-Weekly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(days)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-3">{dayNames[i % 7]} - Day {i + 1}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600">Credit Card Tips</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => handleTipChange(i, 'creditCardTips', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Service Charge Tips</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => handleTipChange(i, 'serviceChargeTips', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Cash Tips</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  onChange={(e) => handleTipChange(i, 'cashTips', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={nextStep}
          className="bg-primary text-white font-bold py-2 px-6 rounded hover:bg-primary-dark transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TimeSpanAndTips;
