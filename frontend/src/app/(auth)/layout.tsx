export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-white">ExpenseTracker</h1>
          <p className="text-violet-200 mt-1">Smart Budget Planner</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
