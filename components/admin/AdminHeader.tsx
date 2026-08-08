'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, CheckCircle, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
}

export function AdminHeader({ adminName = 'Admin CetakPhoto', adminEmail = 'admin@cetakphoto.com' }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname === '/admin/login') return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistem Online & Live Dynamic Engine
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Profile Chip */}
        <div className="flex items-center gap-3 pl-3 border-l border-stone-200 dark:border-stone-800">
          <div className="size-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300">
            <User className="size-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{adminName}</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">{adminEmail}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-900/60 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <RefreshCw className="size-3.5 animate-spin" />
          ) : (
            <LogOut className="size-3.5" />
          )}
          <span>{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
        </button>
      </div>
    </header>
  );
}
