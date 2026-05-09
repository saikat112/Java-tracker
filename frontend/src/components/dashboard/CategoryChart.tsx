'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategorySpend } from '@/types';
import { formatCurrency, CATEGORY_COLORS } from '@/lib/utils';

export default function CategoryChart({ data }: { data: CategorySpend[] }) {
  const items = data.slice(0, 5).map(d => ({
    name: d.category, value: Number(d.amount),
    color: d.color || CATEGORY_COLORS[d.category] || '#9CA3AF',
  }));
  const total = items.reduce((s, i) => s + i.value, 0);

  return (
    <div className="card p-4">
      <p className="font-semibold text-gray-900 mb-4">Spending Breakdown</p>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={items} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {items.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] text-gray-400 text-center leading-tight">Total<br /><span className="text-xs font-bold text-gray-700">{formatCurrency(total)}</span></p>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {items.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-600 flex-1 truncate">{item.name}</span>
              <span className="text-xs font-semibold text-gray-800">{((item.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
