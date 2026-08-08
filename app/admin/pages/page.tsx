import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { Edit, FileText, ArrowRight, CheckCircle2, EyeOff } from 'lucide-react';

export default async function AdminPagesIndexPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const allPages = await db.select().from(pages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Kelola Konten Halaman Website
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Pilih halaman yang ingin diperbarui teks judul, deskripsi, ilustrasi, & status terbitnya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allPages.map((pg) => (
          <div
            key={pg.id}
            className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between shadow-sm space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <FileText className="size-5" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    pg.published === 1
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-800 dark:text-stone-400'
                  }`}
                >
                  {pg.published === 1 ? (
                    <>
                      <CheckCircle2 className="size-3 text-emerald-500" /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3 text-stone-400" /> Draft
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">{pg.title}</h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">/{pg.slug}</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                  {pg.description || 'Tidak ada deskripsi.'}
                </p>
              </div>
            </div>

            <Link
              href={`/admin/pages/${pg.slug}`}
              className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-black font-bold text-xs rounded-xl flex items-center justify-between transition-colors group"
            >
              <span>Edit Konten Halaman</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
