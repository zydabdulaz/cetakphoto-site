import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { SettingsAdminClient } from '@/components/admin/SettingsAdminClient';

export default async function AdminSettingsPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  allSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Pengaturan Website Terpusat
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Ubah identitas situs (nama, logo SVG), kontak WhatsApp, studio address, & media sosial.
        </p>
      </div>

      <SettingsAdminClient initialSettings={settingsMap} />
    </div>
  );
}
