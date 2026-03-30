import React from 'react';
import StatCard from './StatCard';

export default function MonthlyStatCard({ stats }) {
  // Prepare extra stats for display (exclude revenue)
  const extraStats = {
    'New Customers': stats.annualCustomers,
    'Walk-Ins': stats.walkIns,
    'Active Members': stats.activeMembers
  };

  return (
    <div className="flex flex-wrap gap-6">
      <StatCard
        title="Monthly Overview"
        value={`$${stats.monthlyRevenueTotal}`}   // Main metric
        extraStats={extraStats}           // Other stats
        chartData={stats.monthlyRevenueData}     // Only revenue is charted
        color="bg-blue-400"
      />
    </div>
  );
}