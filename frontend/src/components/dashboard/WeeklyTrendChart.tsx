'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeeklyTrend } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function WeeklyTrendChart({ data }: { data: WeeklyTrend[] }) {
  const d = data.map(w => ({ name: `W${w.week}`, Budget: Number(w.budget), Spent: Number(w.spent) }));
  return (
    <div className="card p-4">
      <p className="font-semibold text-gray-900 mb-1">Weekly Trends</p>
      <p className="text-xs text-gray-400 mb-4">Budget vs Spent</p>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={d} barSize={14} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={32}
            tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => formatCurrency(v)}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
          <Bar dataKey="Budget" fill="#EDE9FE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Spent" fill="#7C3AED" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-2">
        {[['#EDE9FE', 'Budget'], ['#7C3AED', 'Spent']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            <span className="text-xs text-gray-500">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
