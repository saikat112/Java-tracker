'use client';
import { formatCurrency } from '@/lib/utils';

interface Props {
  budget: {
    totalBudget: number; fixedExpenses: number; flexibleBudget: number;
    totalSpent: number; remaining: number; healthStatus: string;
  };
}

const STATUS: Record<string, { label: string; color: string; bar: string }> = {
  HEALTHY:     { label: '✅ On Track',    color: 'text-emerald-400', bar: 'bg-emerald-400' },
  WARNING:     { label: '⚠️ Warning',     color: 'text-amber-400',   bar: 'bg-amber-400' },
  OVER_BUDGET: { label: '🔴 Over Budget', color: 'text-red-400',     bar: 'bg-red-400' },
};

export default function BudgetHealthCard({ budget }: Props) {
  const pct = Math.min((budget.totalSpent / Math.max(budget.flexibleBudget, 1)) * 100, 100);
  const s = STATUS[budget.healthStatus] || STATUS.HEALTHY;

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-5 text-white">
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Monthly Budget</p>
          <p className="text-4xl font-bold mt-1 tracking-tight">{formatCurrency(budget.totalBudget)}</p>
        </div>
        <span className={`text-xs font-semibold ${s.color}`}>{s.label}</span>
      </div>

      {/* 3 stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Fixed', val: budget.fixedExpenses, icon: '🔒' },
          { label: 'Flexible', val: budget.flexibleBudget, icon: '💳' },
          { label: 'Remaining', val: budget.remaining, icon: budget.remaining >= 0 ? '💚' : '🔴' },
        ].map(s => (
          <div key={s.label} className="bg-white/8 rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <span className="text-lg">{s.icon}</span>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{s.label}</p>
            <p className={`text-sm font-bold mt-0.5 ${s.label === 'Remaining' && s.val < 0 ? 'text-red-400' : 'text-white'}`}>
              {formatCurrency(s.val)}
            </p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Spent {formatCurrency(budget.totalSpent)}</span>
          <span>{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${s.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
