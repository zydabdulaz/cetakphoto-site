import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();

  // If not logged in, render children directly (e.g. for /admin/login) or handle redirect inside page
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex font-sans antialiased">
      {admin && <AdminSidebar />}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {admin && <AdminHeader adminName={admin.name} adminEmail={admin.email} />}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
