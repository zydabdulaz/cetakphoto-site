import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { EditPageClient } from '@/components/admin/EditPageClient';

export default async function EditSinglePage({ params }: { params: { slug: string } }) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const pageList = await db.select().from(pages).where(eq(pages.slug, params.slug)).limit(1);

  if (pageList.length === 0) {
    notFound();
  }

  return <EditPageClient pageData={pageList[0]} />;
}
