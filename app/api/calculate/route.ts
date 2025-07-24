import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const results = calculateTips(formData);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Calculation Error:", error);
    return NextResponse.json(
      { message: "An error occurred during calculation.", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateTips(formData: any) {
  const { employees, dailyTips, scenario, scenarioDetails } = formData;

  // 1. Calculate Total Tip Pool & Tip Types
  let totalTipPool = 0;
  let totalCashTips = 0;
  let totalCreditCardTips = 0;
  let totalServiceChargeTips = 0;

  Object.values(dailyTips).forEach((day: any) => {
    totalCreditCardTips += day.creditCardTips || 0;
    totalCashTips += day.cashTips || 0;
    totalServiceChargeTips += day.serviceChargeTips || 0;
  });

  totalTipPool = totalCashTips + totalCreditCardTips + totalServiceChargeTips;

  if (!employees || employees.length === 0) {
    return { totalTipPool, employeeResults: [], summary: {}, positionSummary: [], rawData: formData };
  }

  // 2. Calculate Hours & Points
  let totalHoursWorked = 0;
  let totalPointsEarned = 0;

  const processedEmployees = employees.map(emp => {
    const hours = Object.values(emp.daysWorked).reduce((acc, day) => acc + (day.hours || 0), 0);
    const pointsRate = parseFloat(scenarioDetails.points?.[emp.position]) || 0;
    const points = hours * pointsRate;

    totalHoursWorked += hours;
    totalPointsEarned += points;

    return { ...emp, totalHours: hours, pointsRate, totalPoints: points };
  });

  // 3. Tip Distribution
  let employeeResults = [];

  switch (scenario) {
    case 'hours-worked':
      employeeResults = processedEmployees.map(emp => ({
        ...emp,
        earnedTips: totalHoursWorked > 0 ? (emp.totalHours / totalHoursWorked) * totalTipPool : 0,
      }));
      break;

    case 'points-system':
      employeeResults = processedEmployees.map(emp => ({
        ...emp,
        earnedTips: totalPointsEarned > 0 ? (emp.totalPoints / totalPointsEarned) * totalTipPool : 0,
      }));
      break;

    case 'percentage-split':
    case 'tip-out':
      const tipsByPosition = {};
      processedEmployees.forEach(emp => {
        const percentage = parseFloat(scenarioDetails.percentages?.[emp.position]) || 0;
        const share = (percentage / 100) * totalTipPool;
        if (!tipsByPosition[emp.position]) {
          tipsByPosition[emp.position] = { totalHours: 0, employees: [], totalShare: 0 };
        }
        tipsByPosition[emp.position].totalShare += share / employees.filter(e => e.position === emp.position).length;
        tipsByPosition[emp.position].totalHours += emp.totalHours;
        tipsByPosition[emp.position].employees.push(emp);
      });

      employeeResults = processedEmployees.map(emp => {
        const posGroup = tipsByPosition[emp.position];
        const individualShare = posGroup.totalHours > 0 ? (emp.totalHours / posGroup.totalHours) * posGroup.totalShare : 0;
        return { ...emp, earnedTips: individualShare };
      });
      break;

    case 'hybrid':
      const { hours: hoursPercent = 70, points: pointsPercent = 30 } = scenarioDetails.hybridSplit || {};
      const hoursPool = totalTipPool * (hoursPercent / 100);
      const pointsPool = totalTipPool * (pointsPercent / 100);

      employeeResults = processedEmployees.map(emp => {
        const fromHours = totalHoursWorked > 0 ? (emp.totalHours / totalHoursWorked) * hoursPool : 0;
        const fromPoints = totalPointsEarned > 0 ? (emp.totalPoints / totalPointsEarned) * pointsPool : 0;
        return { ...emp, earnedTips: fromHours + fromPoints };
      });
      break;

    default:
      throw new Error(`Unknown scenario: ${scenario}`);
  }

// 4. Add Tip Type Breakdown & Hourly Rate
employeeResults = employeeResults.map(emp => {
  const tipRatio = emp.earnedTips / totalTipPool;
  const earnedCreditCardTips = tipRatio * totalCreditCardTips;
  const earnedCashTips = tipRatio * totalCashTips;
  const earnedServiceChargeTips = tipRatio * totalServiceChargeTips;
  const hourlyRate = emp.totalHours > 0 ? emp.earnedTips / emp.totalHours : 0;

  return {
    ...emp,
    earnedCreditCardTips,
    earnedCashTips,
    earnedServiceChargeTips,
    hourlyRate,
  };
});


  const totalHourlyRate = totalHoursWorked > 0 ? totalTipPool / totalHoursWorked : 0;

  // 5. Final Summary
  const summary = {
    totalTipPool,
    totalCashTips,
    totalCreditCardTips,
    totalServiceChargeTips,
    totalHoursWorked,
    totalHourlyRate,
    totalEmployees: employees.length,
  };

  // 6. Position-Level Breakdown
  const positionSummary = {};

  employeeResults.forEach(emp => {
    if (!positionSummary[emp.position]) {
      positionSummary[emp.position] = {
        position: emp.position,
        totalCreditCardTips: 0,
        totalCashTips: 0,
        totalServiceChargeTips: 0,
        totalTips: 0,
        totalHours: 0,
        hourlyRate: 0,
      };
    }

    const posData = positionSummary[emp.position];
    posData.totalCreditCardTips += emp.earnedCreditCardTips;
    posData.totalCashTips += emp.earnedCashTips;
    posData.totalServiceChargeTips += emp.earnedServiceChargeTips;
    posData.totalTips += emp.earnedTips;
    posData.totalHours += emp.totalHours;
  });

  Object.values(positionSummary).forEach(pos => {
    pos.hourlyRate = pos.totalHours > 0 ? pos.totalTips / pos.totalHours : 0;
  });

// 7. Daily Breakdown
const dailyBreakdown = {};

Object.entries(dailyTips).forEach(([dayKey, dayTips], i) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayIndex = parseInt(dayKey.replace('day', '')) - 1;
  const weekday = weekdays[dayIndex % 7];
  const dayLabel = `${weekday} - Day ${dayIndex + 1}`;

  const creditCardTips = dayTips.creditCardTips || 0;
  const cashTips = dayTips.cashTips || 0;
  const serviceChargeTips = dayTips.serviceChargeTips || 0;
  const totalTips = creditCardTips + cashTips + serviceChargeTips;

  const employeesForDay = employeeResults.filter(emp => emp.daysWorked?.[dayKey]);
  const totalHours = employeesForDay.reduce(
    (acc, emp) => acc + (emp.daysWorked[dayKey]?.hours || 0),
    0
  );
  const hourlyRate = totalHours > 0 ? totalTips / totalHours : 0;

const employeeDetails = employeesForDay.map(emp => {
  const hoursWorked = emp.daysWorked[dayKey]?.hours || 0;
  const tipRatio = emp.earnedTips / totalTipPool; // Use full earnedTips—not daily hours
  return {
    name: emp.name,
    position: emp.position,
    hoursWorked,
    creditCardTips: creditCardTips * tipRatio,
    cashTips: cashTips * tipRatio,
    serviceChargeTips: serviceChargeTips * tipRatio,
    totalTips: totalTips * tipRatio,
    hourlyRate: hoursWorked > 0 ? (totalTips * tipRatio) / hoursWorked : 0,
  };
});


  dailyBreakdown[dayKey] = {
    dayLabel,
    creditCardTips,
    cashTips,
    serviceChargeTips,
    totalTips,
    totalHours,
    hourlyRate,
    employeeDetails,
  };
});



return {
  employeeResults,
  summary,
  positionSummary: Object.values(positionSummary),
  dailyBreakdown,
  rawData: formData,
};
}; 
