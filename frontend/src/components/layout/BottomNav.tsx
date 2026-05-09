'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Receipt, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/groups', icon: Users, label: 'Groups' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
        <div className="glass border-t border-gray-100 shadow-lg">
          <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2 relative">
            {navItems.slice(0, 2).map((item) => (
              <NavItem key={item.href} {...item} active={pathname === item.href} />
            ))}

            {/* FAB */}
            <div className="relative -mt-8">
              <button onClick={() => setShowAdd(true)}
                className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-violet-300 flex items-center justify-center active:scale-90 transition-transform">
                <span className="text-white text-3xl font-light leading-none mb-0.5">+</span>
              </button>
            </div>

            {navItems.slice(2).map((item) => (
              <NavItem key={item.href} {...item} active={pathname === item.href} />
            ))}
          </div>
        </div>
      </nav>
      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function NavItem({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all">
      <div className={cn('p-1.5 rounded-xl transition-all', active ? 'bg-violet-100' : '')}>
        <Icon size={20} strokeWidth={active ? 2.5 : 1.8}
          className={active ? 'text-violet-600' : 'text-gray-400'} />
      </div>
      <span className={cn('text-xs font-medium', active ? 'text-violet-600' : 'text-gray-400')}>
        {label}
      </span>
    </Link>
  );
}
