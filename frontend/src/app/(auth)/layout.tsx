export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top violet section */}
      <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 px-6 pt-14 pb-16 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />
        <div className="absolute top-8 -left-8 w-32 h-32 bg-indigo-400/20 rounded-full" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-5">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ExpenseTracker</h1>
          <p className="text-violet-200 text-sm mt-1.5">Smart Budget Planner</p>
        </div>
      </div>

      {/* White card overlapping */}
      <div className="flex-1 bg-white -mt-5 rounded-t-[2rem] px-6 pt-8 pb-12 shadow-[0_-8px_40px_rgba(0,0,0,0.1)]">
        {children}
      </div>

    </div>
  );
}
