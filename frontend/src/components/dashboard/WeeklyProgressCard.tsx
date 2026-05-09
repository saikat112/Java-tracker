'use client';

import { formatCurrency, getProgressColor } from '@/lib/utils';
import { Calendar, Zap } from 'lucide-react';

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
  const spentPct = Math.min((week.spent / (week.weeklyBudget || 1)) * 100, 100);
  const isOver = week.remaining < 0;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
            <Calendar size={16} className="text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Week {week.weekNumber}</p>
            <p className="text-xs text-gray-400">{week.daysLeft} days remaining</p>
          </div>
        </div>
        <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${isOver ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {isOver ? 'Over budget' : 'On track'}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>{formatCurrency(week.spent)} spent</span>
          <span>{formatCurrency(week.weeklyBudget)} budget</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${getProgressColor(spentPct)}`}
            style={{ width: `${spentPct}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-2xl p-3">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className={`font-bold text-base mt-0.5 ${isOver ? 'text-red-500' : 'text-gray-900'}`}>
            {formatCurrency(Math.abs(week.remaining))}
            {isOver && <span className="text-xs font-normal ml-1">over</span>}
          </p>
        </div>
        <div className="bg-violet-50 rounded-2xl p-3">
          <div className="flex items-center gap-1 mb-0.5">
            <Zap size={12} className="text-violet-500" />
            <p className="text-xs text-violet-600">Safe/day</p>
          </div>
          <p className="font-bold text-base text-violet-700">{formatCurrency(week.dailySafeSpend)}</p>
        </div>
      </div>
    </div>
  );
}
