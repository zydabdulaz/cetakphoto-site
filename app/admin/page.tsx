import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { products, galleryImages, pages, activityLogs } from '@/db/schema';
import { count, desc } from 'drizzle-orm';
import {
  Package,
  Image as ImageIcon,
  FileText,
  Plus,
  Upload,
  Settings as SettingsIcon,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  // Fetch summary stats
  const [productCount] = await db.select({ value: count() }).from(products);
  const [galleryCount] = await db.select({ value: count() }).from(galleryImages);
  const [pageCount] = await db.select({ value: count() }).from(pages);
  const [activityCount] = await db.select({ value: count() }).from(activityLogs);

  // Fetch recent activities
  const recentActivities = await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(8);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-2">
            Control Center
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {admin.name}! 👋
          </h1>
          <p className="text-amber-100 text-sm mt-1 max-w-xl">
            Kelola seluruh produk, galeri foto, konten halaman, dan identitas website CetakPhoto dari dasbor ini.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-white text-stone-900 font-bold text-xs rounded-xl hover:bg-stone-100 shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="size-4 text-stone-900" />
            <span className="text-stone-900">Tambah Produk</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="px-4 py-2.5 bg-amber-800/80 text-white font-bold text-xs rounded-xl hover:bg-amber-800 shadow-md border border-amber-500/30 transition-all inline-flex items-center gap-2"
          >
            <Upload className="size-4" />
            <span>Upload Galeri</span>
          </Link>
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Produk</span>
            <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              {productCount?.value || 0}
            </h3>
            <span className="text-[11px] text-stone-400 mt-1 block">Aktif di katalog publik</span>
          </div>
          <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Package className="size-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Foto Galeri</span>
            <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              {galleryCount?.value || 0}
            </h3>
            <span className="text-[11px] text-stone-400 mt-1 block">Rasio 1:1, 3:4, & 4:3</span>
          </div>
          <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <ImageIcon className="size-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Halaman Dikelola</span>
            <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              {pageCount?.value || 0}
            </h3>
            <span className="text-[11px] text-stone-400 mt-1 block">Katalog, Outlet, & Hero</span>
          </div>
          <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <FileText className="size-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Aktivitas</span>
            <h3 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              {activityCount?.value || 0}
            </h3>
            <span className="text-[11px] text-stone-400 mt-1 block">Tercatat di sistem</span>
          </div>
          <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Clock className="size-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pintasan Cepat */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            Pintasan Cepat
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="p-4 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Tambah Produk Baru</h4>
                  <p className="text-xs text-stone-500">Nama, deskripsi, harga, & gambar</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/gallery"
              className="p-4 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Upload className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Kelola Galeri Foto</h4>
                  <p className="text-xs text-stone-500">Unggah & susun rasio foto studio</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <SettingsIcon className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Pengaturan Website</h4>
                  <p className="text-xs text-stone-500">Logo SVG, nomor WA, & alamat studio</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Aktivitas Terbaru Admin</h2>
            <Link href="/admin/activity" className="text-xs font-semibold text-amber-600 hover:underline">
              Lihat Semua Log →
            </Link>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800/60 overflow-hidden shadow-sm">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-sm">Belum ada catatan aktivitas.</div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 capitalize">
                        {act.action.replace('_', ' ')}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Target: <span className="font-semibold text-stone-700 dark:text-stone-300 capitalize">{act.targetType}</span>
                        {act.metadata && ` • ${act.metadata}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">
                    {new Date(act.createdAt).toLocaleDateString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
