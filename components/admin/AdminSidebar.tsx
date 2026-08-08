'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  FileText,
  Settings,
  History,
  Lock,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dasbor Utama', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Kelola Produk', icon: Package },
  { href: '/admin/gallery', label: 'Kelola Galeri', icon: ImageIcon },
  { href: '/admin/pages', label: 'Konten Halaman', icon: FileText },
  { href: '/admin/settings', label: 'Pengaturan Website', icon: Settings },
  { href: '/admin/activity', label: 'Log Aktivitas', icon: History },
  { href: '/admin/password', label: 'Keamanan Akun', icon: Lock },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // Do not render sidebar on login page
  if (pathname === '/admin/login') return null;

  return (
    <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col border-r border-stone-800 shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <img src="/brand/cetakphoto.svg" alt="CetakPhoto Logo" className="h-7 w-auto filter invert brightness-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Admin
          </span>
        </Link>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Menu Pengelolaan
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20 font-bold'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Icon className={`size-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Public Preview Shortcut */}
      <div className="p-4 border-t border-stone-800 bg-stone-950/50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-lg border border-stone-700/60 transition-all duration-150 group"
        >
          <span>Lihat Website Publik</span>
          <ExternalLink className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </aside>
  );
}
