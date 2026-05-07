'use client';

import { formatCurrency, getProgressColor } from '@/lib/utils';
import { Calendar, TrendingDown } from 'lucide-react';

interface Props {
  week: {
    weekNumber: number;
    weeklyBudget: number;
    spent: number;
    remaining: number;
    dailySafeSpend: number;
    daysLeft: number;
  };
}

export default function WeeklyProgressCard({ week }: Props) {
  const spentPct = Math.min((week.spent / week.weeklyBudget) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-violet-500" />
          <span className="font-semibold text-gray-800">Week {week.weekNumber}</span>
        </div>
        <span className="text-xs text-gray-500">{week.daysLeft} days left</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Spent</p>
          <p className="font-bold text-gray-900">{formatCurrency(week.spent)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className={`font-bold ${week.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
            {formatCurrency(week.remaining)}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${getProgressColor(spentPct)}`}
            style={{ width: `${spentPct}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3">
        <TrendingDown size={16} className="text-blue-500" />
        <div>
          <p className="text-xs text-blue-600">Safe to spend per day</p>
          <p className="font-bold text-blue-700">{formatCurrency(week.dailySafeSpend)}</p>
        </div>
      </div>
    </div>
  );
}
