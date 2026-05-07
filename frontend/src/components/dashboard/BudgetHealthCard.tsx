'use client';

import { formatCurrency, getHealthBg, getProgressColor } from '@/lib/utils';

interface Props {
  budget: {
    totalBudget: number;
    fixedExpenses: number;
    flexibleBudget: number;
    totalSpent: number;
    remaining: number;
    healthStatus: string;
  };
}

export default function BudgetHealthCard({ budget }: Props) {
  const spentPct = Math.min((budget.totalSpent / budget.flexibleBudget) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-violet-200 text-sm">Monthly Budget</p>
          <p className="text-3xl font-bold">{formatCurrency(budget.totalBudget)}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getHealthBg(budget.healthStatus)}`}>
          {budget.healthStatus.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatItem label="Fixed" value={formatCurrency(budget.fixedExpenses)} />
        <StatItem label="Flexible" value={formatCurrency(budget.flexibleBudget)} />
        <StatItem label="Remaining" value={formatCurrency(budget.remaining)} highlight={budget.remaining < 0} />
      </div>

      <div>
        <div className="flex justify-between text-xs text-violet-200 mb-1">
          <span>Spent: {formatCurrency(budget.totalSpent)}</span>
          <span>{spentPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-violet-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${getProgressColor(spentPct)}`}
            style={{ width: `${spentPct}%` }} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white/10 rounded-xl p-2.5 text-center">
      <p className="text-violet-200 text-xs">{label}</p>
      <p className={`font-bold text-sm mt-0.5 ${highlight ? 'text-red-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
