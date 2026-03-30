import React from 'react';
import StatCard from './StatCard';

export default function AnnualStatCard({ stats }) {
  // Prepare extra stats for display (exclude revenue)
  const extraStats = {
    'New Customers': stats.annualCustomers,
    'Walk-Ins': stats.walkIns,
    'Active Members': stats.activeMembers
  };

  return (
    <div className="flex flex-wrap gap-6">
      <StatCard
        title="Annual Overview"
        value={`$${stats.annualRevenueTotal}`}   // Main metric
        extraStats={extraStats}           // Other stats
        chartData={stats.annualRevenueData}     // Only revenue is charted
        color="bg-green-500"
      />
    </div>
  );
}