'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeeklyTrend } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function WeeklyTrendChart({ data }: { data: WeeklyTrend[] }) {
  const chartData = data.map((d) => ({
    week: `W${d.week}`,
    Budget: Number(d.budget),
    Spent: Number(d.spent),
  }));

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-1">Weekly Trends</h3>
      <p className="text-xs text-gray-400 mb-4">Budget vs actual spending</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barSize={16} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} width={35} />
          <Tooltip formatter={(v: number) => formatCurrency(v)}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <Bar dataKey="Budget" fill="#EDE9FE" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Spent" fill="#7C3AED" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-violet-200" />
          <span className="text-xs text-gray-500">Budget</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-violet-600" />
          <span className="text-xs text-gray-500">Spent</span>
        </div>
      </div>
    </div>
  );
}
