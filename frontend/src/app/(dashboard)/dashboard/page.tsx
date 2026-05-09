'use client';
import { useEffect } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import BudgetHealthCard from '@/components/dashboard/BudgetHealthCard';
import WeeklyProgressCard from '@/components/dashboard/WeeklyProgressCard';
import CategoryChart from '@/components/dashboard/CategoryChart';
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart';

export default function DashboardPage() {
  const { dashboard, fetchDashboard, isLoading } = useBudgetStore();
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (isLoading) return <Skeleton />;

  return (
    <div className="space-y-4 stagger fade-in">
      {/* Greeting */}
      <div className="fade-in">
        <p className="text-gray-400 text-sm">{greeting} 👋</p>
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight">{user?.name?.split(' ')[0]}</h1>
      </div>

      {!dashboard?.budget ? <NoBudget /> : (
        <>
          <BudgetHealthCard budget={dashboard.budget} />
          {dashboard.currentWeek && <WeeklyProgressCard week={dashboard.currentWeek} />}
          <SavingsCard amount={dashboard.savingsPrediction} />
          {dashboard.categoryBreakdown?.length > 0 && <CategoryChart data={dashboard.categoryBreakdown} />}
          {dashboard.weeklyTrends?.length > 0 && <WeeklyTrendChart data={dashboard.weeklyTrends} />}
        </>
      )}
    </div>
  );
}

function SavingsCard({ amount }: { amount: number }) {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-5 flex justify-between items-center">
      <div>
        <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">Savings Prediction</p>
        <p className="text-white text-2xl font-bold mt-1">{formatCurrency(amount)}</p>
        <p className="text-emerald-200 text-xs mt-0.5">Estimated this month</p>
      </div>
      <div className="text-4xl">🎯</div>
    </div>
  );
}

function NoBudget() {
  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white">
      <div className="text-5xl mb-4">📊</div>
      <h3 className="text-xl font-bold mb-2">Set Your Budget</h3>
      <p className="text-violet-200 text-sm mb-5">Set up your monthly budget to start tracking expenses and savings.</p>
      <Link href="/budget" className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-5 py-3 rounded-2xl tap text-sm">
        Set Budget →
      </Link>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-36 bg-gray-200 rounded-xl animate-pulse" />
      <div className="h-48 bg-gray-200 rounded-3xl animate-pulse" />
      <div className="h-36 bg-gray-200 rounded-3xl animate-pulse" />
      <div className="h-24 bg-gray-200 rounded-3xl animate-pulse" />
      <div className="h-48 bg-gray-200 rounded-3xl animate-pulse" />
    </div>
  );
}
