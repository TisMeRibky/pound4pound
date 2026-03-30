import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function StatCard({ title, value, extraStats = {}, chartData = [] , color='bg-blue-500'}) {
  return (
    <div className={`p-4 rounded shadow ${color} text-white w-80`}>
      {/* Title */}
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* Total value */}
      <p className="text-2xl font-bold mt-2">{value}</p>

      {/* Extra stats */}
      <div className="flex justify-between mt-4 text-sm">
        {Object.entries(extraStats).map(([key, val]) => (
          <div key={key} className="text-white/80">
            <p>{key}</p>
            <p className="font-semibold">{val}</p>
          </div>
        ))}
      </div>

      {/* Revenue line chart */}
      {chartData.length > 0 && (
        <div className="mt-4 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}