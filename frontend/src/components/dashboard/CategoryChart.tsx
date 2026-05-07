'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CategorySpend } from '@/types';
import { formatCurrency, CATEGORY_COLORS } from '@/lib/utils';

export default function CategoryChart({ data }: { data: CategorySpend[] }) {
  const chartData = data.map((d) => ({
    name: d.category,
    value: d.amount,
    color: d.color || CATEGORY_COLORS[d.category] || '#9CA3AF',
  }));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-3">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
            paddingAngle={3} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.slice(0, 6).map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color || CATEGORY_COLORS[item.category] || '#9CA3AF' }} />
            <span className="text-xs text-gray-600 truncate">{item.category}</span>
            <span className="text-xs font-medium text-gray-800 ml-auto">{item.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
