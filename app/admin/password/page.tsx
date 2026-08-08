import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { ChangePasswordClient } from '@/components/admin/ChangePasswordClient';

export default async function AdminPasswordPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Keamanan & Ganti Kata Sandi
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Perbarui kata sandi akun admin untuk menjaga keamanan akses sistem terpusat CetakPhoto.
        </p>
      </div>

      <ChangePasswordClient />
    </div>
  );
}
