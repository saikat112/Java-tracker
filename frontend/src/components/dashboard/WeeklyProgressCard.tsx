'use client';
import { formatCurrency } from '@/lib/utils';

interface Props {
  week: { weekNumber: number; weeklyBudget: number; spent: number; remaining: number; dailySafeSpend: number; daysLeft: number; };
}

export default function WeeklyProgressCard({ week }: Props) {
  const pct = Math.min((week.spent / Math.max(week.weeklyBudget, 1)) * 100, 100);
  const over = week.remaining < 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">Week {week.weekNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">{week.daysLeft} days left</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${over ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
          {over ? 'Over budget' : 'On track'}
        </span>
      </div>

      {/* Bar */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className={`h-full rounded-full transition-all duration-700 ${over ? 'bg-red-400' : pct > 80 ? 'bg-amber-400' : 'bg-violet-500'}`}
          style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Budget', val: formatCurrency(week.weeklyBudget), color: 'text-gray-900' },
          { label: 'Spent', val: formatCurrency(week.spent), color: 'text-gray-900' },
          { label: 'Safe/day', val: formatCurrency(week.dailySafeSpend), color: 'text-violet-600' },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className={`text-sm font-bold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
