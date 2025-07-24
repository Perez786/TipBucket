'use client';

import React from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  daysWorked: { [day: string]: number };
}

interface DailyTips {
  creditCardTips: number;
  cashTips: number;
  serviceChargeTips: number;
}

interface FormData {
  employees: Employee[];
  dailyTips: { [day: string]: DailyTips };
  timeSpan: 'Weekly' | 'Bi-Weekly';
  scenario: string;
  scenarioDetails: {
    points?: { [key: string]: number };
    percentages?: { [key: string]: number };
    hybridSplit?: { hours: number; points: number };
  };
  templateName?: string;
}

interface TimeSpanAndTipsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  nextStep: () => void;
}

const TimeSpanAndTips: React.FC<TimeSpanAndTipsProps> = ({ formData, setFormData, nextStep }) => {
  if (!formData || !formData.dailyTips) {
    return (
      <div className="text-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  const days = formData.timeSpan === 'Weekly' ? 7 : 14;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleTipChange = (dayKey: string, field: keyof DailyTips, value: string) => {
    const updatedDailyTips = {
      ...formData.dailyTips,
      [dayKey]: {
        ...formData.dailyTips[dayKey],
        [field]: parseFloat(value) || 0,
      },
    };
    setFormData({ ...formData, dailyTips: updatedDailyTips });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Step 1: Enter Daily Tips</h2>
      <p className="text-center text-gray-500 mb-6">
        Time Span: <strong>{formData.timeSpan}</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(days)].map((_, i) => {
          const dayKey = `day${i + 1}`;
          const dayLabel = `${dayNames[i % 7]} – Day ${i + 1}`;
          const tips = formData.dailyTips[dayKey] || {};

          return (
            <div key={dayKey} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-3">{dayLabel}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600">Credit Card Tips</label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    value={tips.creditCardTips ?? '0.00'}
                    onChange={(e) => handleTipChange(dayKey, 'creditCardTips', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Service Charge Tips</label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    value={tips.serviceChargeTips ?? '0.00'}
                    onChange={(e) => handleTipChange(dayKey, 'serviceChargeTips', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Cash Tips</label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    value={tips.cashTips ?? '0.00'}
                    onChange={(e) => handleTipChange(dayKey, 'cashTips', e.target.value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={nextStep}
          className="bg-primary text-white font-bold py-2 px-6 rounded hover:bg-primary-dark transition duration-300"
        >
          Next: Enter Hours
        </button>
      </div>
    </div>
  );
};

export default TimeSpanAndTips;
