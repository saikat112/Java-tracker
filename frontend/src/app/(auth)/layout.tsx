export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Purple header blob */}
      <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 pt-16 pb-20 px-6 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-5">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-white">ExpenseTracker</h1>
          <p className="text-violet-200 mt-1 text-sm">Smart Budget Planner</p>
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 bg-white -mt-6 rounded-t-[2rem] px-6 pt-8 pb-10 shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">
        {children}
      </div>
    </div>
  );
}
