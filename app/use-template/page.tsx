'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TimeSpanAndTips from '@/components/template-flow/TimeSpanAndTips';
import EmployeeData from '@/components/template-flow/EmployeeData';
import Scenario from '@/components/template-flow/Scenario';
import ResultsPage from '@/components/template-flow/ResultsPage';

export default function UseTemplatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('id');

    if (!templateId) {
      router.push('/templates');
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${templateId}`);
        if (!response.ok) throw new Error('Failed to fetch template');
        const templateData = await response.json();

        const numDays = templateData.timeSpan === 'Weekly' ? 7 : 14;
        const initialDailyTips: any = {};

        for (let i = 1; i <= numDays; i++) {
          initialDailyTips[`day${i}`] = {
            creditCardTips: '',
            serviceChargeTips: '',
            cashTips: ''
          };
        }

        const hydratedEmployees = templateData.employees.map((emp: any, index: number) => ({
          ...emp,
          id: emp.id || Date.now() + index,
          daysWorked: {}
        }));

        setFormData({
          ...templateData,
          employees: hydratedEmployees,
          dailyTips: initialDailyTips,
          scenario: templateData.scenario,
          scenarioDetails: templateData.scenarioDetails
        });
      } catch (err) {
        console.error("Template load failed:", err);
        setError('Failed to load template data.');
      } finally {
        setIsPreparing(false);
      }
    };

    fetchTemplate();
  }, [router]);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Calculation failed.');
      const data = await response.json();
      setResults(data);
      setStep(4); // 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const startOver = () => router.push('/templates');

  const renderStep = () => {
    switch (step) {
      case 1:
        return <TimeSpanAndTips formData={formData} setFormData={setFormData} nextStep={nextStep} />;
      case 2:
        return <EmployeeData formData={formData} setFormData={setFormData} onCalculate={handleCalculate} prevStep={prevStep} />;
      case 3:
        return <Scenario formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        if (isLoading) return <div className="text-center p-10"><span className="loading loading-spinner"></span><p>Calculating...</p></div>;
        if (error) return <div className="text-center text-red-500"><p>Error: {error}</p><button onClick={startOver} className="btn mt-4">Back to Templates</button></div>;
        return <ResultsPage results={results} startOver={startOver} />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  if (isPreparing || !formData) {
    return <div className="text-center p-10"><span className="loading loading-spinner"></span></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-2">Using Template: {formData.templateName}</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {renderStep()}
      </div>
    </div>
  );
}