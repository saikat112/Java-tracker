'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WeeklyTrend } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function WeeklyTrendChart({ data }: { data: WeeklyTrend[] }) {
  const chartData = data.map((d) => ({
    week: `W${d.week}`,
    Budget: d.budget,
    Spent: d.spent,
  }));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-3">Weekly Trends</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="Budget" fill="#DDD6FE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Spent" fill="#7C3AED" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
