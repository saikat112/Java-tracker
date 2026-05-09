'use client';

import { useEffect } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { useAuthStore } from '@/store/authStore';
import BudgetHealthCard from '@/components/dashboard/BudgetHealthCard';
import WeeklyProgressCard from '@/components/dashboard/WeeklyProgressCard';
import CategoryChart from '@/components/dashboard/CategoryChart';
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { dashboard, fetchDashboard, isLoading } = useBudgetStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4 animate-fade-in pb-2">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{greeting()},</p>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name?.split(' ')[0]} 👋</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {!dashboard?.budget ? (
        <NoBudgetCard />
      ) : (
        <>
          <BudgetHealthCard budget={dashboard.budget} />
          {dashboard.currentWeek && <WeeklyProgressCard week={dashboard.currentWeek} />}

          {/* Savings Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-4 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-medium">Savings Prediction</p>
              <p className="text-white text-2xl font-bold mt-0.5">{formatCurrency(dashboard.savingsPrediction)}</p>
              <p className="text-emerald-200 text-xs mt-0.5">Estimated this month</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>

          {dashboard.categoryBreakdown?.length > 0 && (
            <CategoryChart data={dashboard.categoryBreakdown} />
          )}
          {dashboard.weeklyTrends?.length > 0 && (
            <WeeklyTrendChart data={dashboard.weeklyTrends} />
          )}
        </>
      )}
    </div>
  );
}

function NoBudgetCard() {
  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white">
      <div className="text-5xl mb-4">📊</div>
      <h3 className="text-xl font-bold mb-2">Set Your Monthly Budget</h3>
      <p className="text-violet-200 text-sm mb-5 leading-relaxed">
        Start by setting up your monthly budget to track expenses and savings.
      </p>
      <Link href="/budget"
        className="inline-flex items-center gap-2 bg-white text-violet-600 font-semibold px-5 py-3 rounded-2xl hover:bg-violet-50 transition active:scale-95">
        Set Budget <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse" />
      {[180, 140, 100, 200, 180].map((h, i) => (
        <div key={i} className={`bg-gray-200 rounded-3xl animate-pulse`} style={{ height: h }} />
      ))}
    </div>
  );
}
