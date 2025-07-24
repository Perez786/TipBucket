'use client';

import React from 'react';

const ResultsPage = ({ results, startOver }) => {
  if (!results) {
    return <div>Loading results...</div>;
  }

  const { employeeResults, summary, positionSummary } = results;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const downloadCSV = () => {
  let csvContent = 'data:text/csv;charset=utf-8,' + '\n';

  // Section: Overall Summary
  csvContent += '=== Overall Summary ===\n';
  csvContent += `Total Tip Pool,${summary.totalTipPool.toFixed(2)}\n`;
  csvContent += `Cash Tips,${summary.totalCashTips.toFixed(2)}\n`;
  csvContent += `Credit Card Tips,${summary.totalCreditCardTips.toFixed(2)}\n`;
  csvContent += `Service Charge Tips,${summary.totalServiceChargeTips.toFixed(2)}\n`;
  csvContent += `Total Hours Worked,${summary.totalHoursWorked.toFixed(2)}\n`;
  csvContent += `Hourly Rate,${summary.totalHourlyRate.toFixed(2)}\n\n`;

  // Section: Scenario Details
  csvContent += '=== Scenario Details ===\n';
  if (results.rawData.scenarioDetails?.points) {
    csvContent += 'Points Per Position\n';
    Object.entries(results.rawData.scenarioDetails.points).forEach(([role, pts]) => {
      csvContent += `${role},${pts}\n`;
    });
  }
  if (results.rawData.scenarioDetails?.percentages) {
    csvContent += '\nPercentages Per Position\n';
    Object.entries(results.rawData.scenarioDetails.percentages).forEach(([role, perc]) => {
      csvContent += `${role},${perc}%\n`;
    });
  }
  csvContent += '\n';

  // Section: Employee Breakdown
  csvContent += '=== Employee Breakdown ===\n';
  csvContent += 'Name,Position,Hours Worked,Total Tips,Credit Card Tips,Cash Tips,Service Charge Tips,Hourly Rate\n';
  employeeResults.forEach(emp => {
    csvContent += [
      `"${emp.name}"`,
      `"${emp.position}"`,
      emp.totalHours.toFixed(2),
      emp.earnedTips.toFixed(2),
      emp.earnedCreditCardTips.toFixed(2),
      emp.earnedCashTips.toFixed(2),
      emp.earnedServiceChargeTips.toFixed(2),
      emp.hourlyRate.toFixed(2),
    ].join(',') + '\n';
  });
  csvContent += '\n';

  // Section: Position Summary
  csvContent += '=== Position Summary ===\n';
  csvContent += 'Position,Total Hours,Total Tips,Credit Card Tips,Cash Tips,Service Charge Tips,Hourly Rate\n';
  results.positionSummary.forEach(pos => {
    csvContent += [
      `"${pos.position}"`,
      pos.totalHours.toFixed(2),
      pos.totalTips.toFixed(2),
      pos.totalCreditCardTips.toFixed(2),
      pos.totalCashTips.toFixed(2),
      pos.totalServiceChargeTips.toFixed(2),
      pos.hourlyRate.toFixed(2),
    ].join(',') + '\n';
  });
  csvContent += '\n';

  // Section: Daily Breakdown
  csvContent += '=== Daily Breakdown ===\n';
  Object.entries(results.dailyBreakdown || {}).forEach(([key, day]) => {
    csvContent += `${day.dayLabel}\n`;
    csvContent += `Total Credit Card Tips,${day.creditCardTips.toFixed(2)}\n`;
    csvContent += `Total Cash Tips,${day.cashTips.toFixed(2)}\n`;
    csvContent += `Total Service Charge Tips,${day.serviceChargeTips.toFixed(2)}\n`;
    csvContent += `Total Overall Tips,${day.totalTips.toFixed(2)}\n`;
    csvContent += `Total Hours Worked,${day.totalHours.toFixed(2)}\n`;
    csvContent += `Total Hourly Rate,${day.hourlyRate.toFixed(2)}\n`;

    csvContent += 'Name,Position,Hours Worked,Total Tips,Credit Card Tips,Cash Tips,Service Charge Tips,Hourly Rate\n';
    day.employeeDetails.forEach(emp => {
      csvContent += [
        `"${emp.name}"`,
        `"${emp.position}"`,
        emp.hoursWorked.toFixed(2),
        emp.totalTips.toFixed(2),
        emp.creditCardTips.toFixed(2),
        emp.cashTips.toFixed(2),
        emp.serviceChargeTips.toFixed(2),
        emp.hourlyRate.toFixed(2),
      ].join(',') + '\n';
    });
    csvContent += '\n';
  });

  // Trigger Download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'tip_distribution_full_results.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};




  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">Step 4: Calculation Results</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-800 font-medium">Total Tip Pool</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(summary.totalTipPool)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Cash Tips</p>
          <p className="text-xl font-bold text-yellow-900">{formatCurrency(summary.totalCashTips)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Credit Card Tips</p>
          <p className="text-xl font-bold text-yellow-900">{formatCurrency(summary.totalCreditCardTips)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Service Charge Tips</p>
          <p className="text-xl font-bold text-yellow-900">{formatCurrency(summary.totalServiceChargeTips)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Total Hours Worked</p>
          <p className="text-xl font-bold text-yellow-900">{summary.totalHoursWorked.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Hourly Rate</p>
          <p className="text-xl font-bold text-yellow-900">{formatCurrency(summary.totalHourlyRate)}</p>
        </div>
      </div>

      {/* Scenario Breakdown */}
      {results.rawData?.scenario && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Distribution Scenario Details</h3>
          {results.rawData.scenario === 'points-system' || results.rawData.scenario === 'hybrid' ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-md font-medium mb-2 text-green-800">Points Assigned:</h4>
              <ul className="list-disc list-inside text-green-700">
                {Object.entries(results.rawData.scenarioDetails.points || {}).map(([role, points]) => (
                  <li key={role}><strong>{role}</strong>: {points} points</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(results.rawData.scenario === 'percentage-split' ||
            results.rawData.scenario === 'tip-out' ||
            results.rawData.scenario === 'hybrid') ? (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-4">
              <h4 className="text-md font-medium mb-2 text-purple-800">Percentages Applied:</h4>
              <ul className="list-disc list-inside text-purple-700">
                {Object.entries(results.rawData.scenarioDetails.percentages || {}).map(([role, percentage]) => (
                  <li key={role}><strong>{role}</strong>: {percentage}%</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {/* Employee Results Table */}
      <div className="overflow-x-auto mb-12">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Position</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Total Hours</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Total Tips</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Credit Card Tips</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Cash Tips</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Service Charge Tips</th>
              <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-600">Hourly Rate</th>
            </tr>
          </thead>
          <tbody>
           {employeeResults.map(emp => (
  <tr key={emp.id} className="hover:bg-gray-50">
    <td className="py-3 px-4 border-b text-sm">{emp.name}</td>
    <td className="py-3 px-4 border-b text-sm">{emp.position}</td>
    <td className="py-3 px-4 border-b text-sm text-center">{emp.totalHours.toFixed(2)}</td>
    <td className="py-3 px-4 border-b text-sm text-center font-medium text-primary">{formatCurrency(emp.earnedTips)}</td>
    <td className="py-3 px-4 border-b text-sm text-center">{formatCurrency(emp.earnedCreditCardTips)}</td>
    <td className="py-3 px-4 border-b text-sm text-center">{formatCurrency(emp.earnedCashTips)}</td>
    <td className="py-3 px-4 border-b text-sm text-center">{formatCurrency(emp.earnedServiceChargeTips)}</td>
    <td className="py-3 px-4 border-b text-sm text-center">{formatCurrency(emp.hourlyRate)}</td>
  </tr>
))}
</tbody>
</table>
</div>

{/* Daily Breakdown Section */}
<div className="mb-12">
  <h3 className="text-xl font-semibold mb-4 text-center">Daily Breakdown</h3>
  {Object.entries(results.dailyBreakdown || {}).map(([dayKey, day]) => (
    <div key={dayKey} className="mb-8 border rounded-lg shadow-sm p-4 bg-gray-50">
      <h4 className="text-lg font-bold mb-2">{day.dayLabel}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-700">
        <p><strong>Credit Card Tips:</strong> {formatCurrency(day.creditCardTips)}</p>
        <p><strong>Cash Tips:</strong> {formatCurrency(day.cashTips)}</p>
        <p><strong>Service Charge Tips:</strong> {formatCurrency(day.serviceChargeTips)}</p>
        <p><strong>Total Tips:</strong> {formatCurrency(day.totalTips)}</p>
        <p><strong>Total Hours:</strong> {day.totalHours.toFixed(2)}</p>
        <p><strong>Hourly Rate:</strong> {formatCurrency(day.hourlyRate)}</p>
      </div>

      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Name</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Position</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Hours</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Total Tips</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Credit Card Tips</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Cash Tips</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Service Charge Tips</th>
            <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Hourly Rate</th>
          </tr>
        </thead>
        <tbody>
          {day.employeeDetails.map((emp, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="py-2 px-3 border-b">{emp.name}</td>
              <td className="py-2 px-3 border-b">{emp.position}</td>
              <td className="py-2 px-3 border-b text-center">{emp.hoursWorked.toFixed(2)}</td>
              <td className="py-2 px-3 border-b text-center">{formatCurrency(emp.totalTips)}</td>
              <td className="py-2 px-3 border-b text-center">{formatCurrency(emp.creditCardTips)}</td>
              <td className="py-2 px-3 border-b text-center">{formatCurrency(emp.cashTips)}</td>
              <td className="py-2 px-3 border-b text-center">{formatCurrency(emp.serviceChargeTips)}</td>
              <td className="py-2 px-3 border-b text-center">{formatCurrency(emp.hourlyRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))}
</div>


{/* Position Summary */}
<div className="mb-12">
  <h3 className="text-xl font-semibold mb-4 text-center">Position Summary</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Position</th>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Total Hours</th>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Total Tips</th>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Credit Card Tips</th>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Cash Tips</th>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Service Charge Tips</th>
          <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Hourly Rate</th>
        </tr>
      </thead>
      <tbody>
        {positionSummary.map(pos => (
          <tr key={pos.position} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b text-sm">{pos.position}</td>
            <td className="py-2 px-4 border-b text-sm text-center">{pos.totalHours.toFixed(2)}</td>
            <td className="py-2 px-4 border-b text-sm text-center">{formatCurrency(pos.totalTips)}</td>
            <td className="py-2 px-4 border-b text-sm text-center">{formatCurrency(pos.totalCreditCardTips)}</td>
            <td className="py-2 px-4 border-b text-sm text-center">{formatCurrency(pos.totalCashTips)}</td>
            <td className="py-2 px-4 border-b text-sm text-center">{formatCurrency(pos.totalServiceChargeTips)}</td>
            <td className="py-2 px-4 border-b text-sm text-center">{formatCurrency(pos.hourlyRate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/* Action Buttons */}
<div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
  <button
    onClick={downloadCSV}
    className="w-full md:w-auto bg-secondary text-white font-bold py-2 px-6 rounded hover:bg-opacity-90 transition duration-300"
  >
    Download as CSV
  </button>
  <button
    onClick={startOver}
    className="w-full md:w-auto bg-primary text-white font-bold py-2 px-6 rounded hover:bg-primary-dark transition duration-300"
  >
    Start Over
  </button>
</div>
</div>
  );
};

export default ResultsPage;

