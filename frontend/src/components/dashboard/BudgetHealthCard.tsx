'use client';

import { formatCurrency, getProgressColor } from '@/lib/utils';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';

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

const statusConfig = {
  HEALTHY: { label: 'On Track', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  WARNING: { label: 'Warning', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  OVER_BUDGET: { label: 'Over Budget', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function BudgetHealthCard({ budget }: Props) {
  const spentPct = Math.min((budget.totalSpent / (budget.flexibleBudget || 1)) * 100, 100);
  const status = statusConfig[budget.healthStatus as keyof typeof statusConfig] || statusConfig.HEALTHY;

  return (
    <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-violet-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-violet-200 text-xs font-medium uppercase tracking-wide">Monthly Budget</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(budget.totalBudget)}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatBox label="Fixed" value={formatCurrency(budget.fixedExpenses)} icon="🔒" />
        <StatBox label="Flexible" value={formatCurrency(budget.flexibleBudget)} icon="💳" />
        <StatBox label="Remaining" value={formatCurrency(budget.remaining)}
          icon={budget.remaining >= 0 ? '✅' : '⚠️'} negative={budget.remaining < 0} />
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-violet-200 mb-2">
          <span>Spent: {formatCurrency(budget.totalSpent)}</span>
          <span>{spentPct.toFixed(0)}% used</span>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${getProgressColor(spentPct)}`}
            style={{ width: `${spentPct}%` }} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, negative }: { label: string; value: string; icon: string; negative?: boolean }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 text-center">
      <span className="text-base">{icon}</span>
      <p className="text-violet-200 text-xs mt-1">{label}</p>
      <p className={`font-bold text-sm mt-0.5 ${negative ? 'text-red-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
