import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { activityLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { History, CheckCircle2 } from 'lucide-react';

export default async function ActivityLogsPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <History className="size-6 text-amber-600" />
          <span>Log Aktivitas Admin</span>
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Catatan riwayat aksi penambahan produk, pengubahan galeri, konten halaman, & pengaturan website.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">Belum ada catatan aktivitas.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 md:p-5 flex items-start justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 capitalize">
                      {log.action.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Target: <span className="font-semibold text-stone-700 dark:text-stone-300 capitalize">{log.targetType}</span>
                      {log.targetId && ` (ID: ${log.targetId})`}
                    </p>
                    {log.metadata && (
                      <pre className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 p-2 rounded-lg mt-2 overflow-x-auto max-w-xl">
                        {log.metadata}
                      </pre>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-stone-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
