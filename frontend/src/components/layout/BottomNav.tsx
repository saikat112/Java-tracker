'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Receipt, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';

const nav = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/groups', icon: Users, label: 'Groups' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-1px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-around px-2 py-2">
            {nav.slice(0, 2).map(item => <NavBtn key={item.href} {...item} active={path === item.href} />)}

            {/* FAB */}
            <button onClick={() => setOpen(true)}
              className="tap flex flex-col items-center justify-center w-14 h-14 -mt-7 bg-violet-600 rounded-2xl shadow-xl shadow-violet-300/60">
              <span className="text-white text-2xl font-light leading-none">+</span>
            </button>

            {nav.slice(2).map(item => <NavBtn key={item.href} {...item} active={path === item.href} />)}
          </div>
        </div>
      </div>
      {open && <AddExpenseModal onClose={() => setOpen(false)} />}
    </>
  );
}

function NavBtn({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 px-3 py-1 tap">
      <Icon size={22} strokeWidth={active ? 2.5 : 1.8} className={active ? 'text-violet-600' : 'text-gray-400'} />
      <span className={cn('text-[10px] font-semibold', active ? 'text-violet-600' : 'text-gray-400')}>{label}</span>
    </Link>
  );
}
