export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex flex-col">
      {/* Top decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <div className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-4 animate-pulse-ring">
          <span className="text-3xl">💰</span>
        </div>
        <h1 className="text-2xl font-bold text-white">ExpenseTracker</h1>
        <p className="text-violet-200 text-sm mt-1">Smart Budget Planner</p>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-10 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
