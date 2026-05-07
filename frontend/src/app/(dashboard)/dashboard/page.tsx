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

export default function DashboardPage() {
  const { dashboard, fetchDashboard, isLoading } = useBudgetStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Greeting */}
      <div>
        <p className="text-gray-500 text-sm">Good {getGreeting()},</p>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name?.split(' ')[0]} 👋</h1>
      </div>

      {!dashboard?.budget ? (
        <NoBudgetCard />
      ) : (
        <>
          <BudgetHealthCard budget={dashboard.budget} />
          {dashboard.currentWeek && <WeeklyProgressCard week={dashboard.currentWeek} />}
          {dashboard.categoryBreakdown?.length > 0 && <CategoryChart data={dashboard.categoryBreakdown} />}
          {dashboard.weeklyTrends?.length > 0 && <WeeklyTrendChart data={dashboard.weeklyTrends} />}
          <SavingsCard prediction={dashboard.savingsPrediction} />
        </>
      )}
    </div>
  );
}

function NoBudgetCard() {
  return (
    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white text-center">
      <div className="text-4xl mb-3">📊</div>
      <h3 className="text-xl font-bold mb-2">Set Your Monthly Budget</h3>
      <p className="text-violet-200 text-sm mb-4">Start tracking your expenses by setting up your budget</p>
      <Link href="/budget" className="inline-block bg-white text-violet-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-violet-50 transition">
        Set Budget
      </Link>
    </div>
  );
}

function SavingsCard({ prediction }: { prediction: number }) {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
      <p className="text-emerald-100 text-sm">Savings Prediction</p>
      <p className="text-2xl font-bold mt-1">{formatCurrency(prediction)}</p>
      <p className="text-emerald-200 text-xs mt-1">Estimated savings this month</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
      ))}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
