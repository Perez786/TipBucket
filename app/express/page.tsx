'use client';

import { useState, useEffect } from 'react';
import { FormData } from '../../types';
import TimeSpanAndTips from '@/components/express-flow/TimeSpanAndTips';
import EmployeeData from '@/components/express-flow/EmployeeData';
import Scenario from '@/components/express-flow/Scenario';
import ResultsPage from '@/components/express-flow/ResultsPage';

const initialFormData: FormData = {
  timeSpan: 'Weekly' as 'Weekly' | 'Bi-Weekly',
  dailyTips: {},
  employees: [],
  scenario: '',
  scenarioDetails: {},
  templateName: '',
};

export default function ExpressPage() { // Renamed from DashboardPage to ExpressPage
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      const templateData = JSON.parse(selectedTemplate);
      // Pre-populate the form data with the template
      setFormData({
        ...initialFormData,
        employees: templateData.employees,
        scenario: templateData.scenario,
        scenarioDetails: templateData.scenarioDetails,
        timeSpan: templateData.timeSpan,
      });
      // Clear the item so it's not used again on refresh
      localStorage.removeItem('selectedTemplate');
    }
  }, []);

  const nextStep = async () => {
    if (step === 3) {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Calculation failed. Please check your data.');
        }
        const data = await response.json();
        setResults(data);
        setStep(prev => prev + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const startOver = () => {
    setStep(1);
    setFormData(initialFormData);
    setResults(null);
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <TimeSpanAndTips formData={formData} setFormData={setFormData} nextStep={nextStep} />;
      case 2:
        return <EmployeeData formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Scenario formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        if (isLoading) return <div>Calculating...</div>;
        if (error) return <div><p className="text-red-500">{error}</p><button onClick={() => setStep(3)}>Go Back</button></div>;
        return <ResultsPage results={results} startOver={startOver} />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Express Tip Distribution</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {renderStep()}
      </div>
    </div>
  );
}
