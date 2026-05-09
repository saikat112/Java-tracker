'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategorySpend } from '@/types';
import { formatCurrency, CATEGORY_COLORS } from '@/lib/utils';

export default function CategoryChart({ data }: { data: CategorySpend[] }) {
  const chartData = data.slice(0, 6).map((d) => ({
    name: d.category,
    value: Number(d.amount),
    color: d.color || CATEGORY_COLORS[d.category] || '#9CA3AF',
  }));

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Spending by Category</h3>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <ResponsiveContainer width={130} height={130}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={38} outerRadius={58}
                paddingAngle={3} dataKey="value" strokeWidth={0}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600 truncate max-w-[80px]">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
