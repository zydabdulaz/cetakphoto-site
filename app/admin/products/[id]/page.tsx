import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { EditProductClient } from '@/components/admin/EditProductClient';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const productList = await db.select().from(products).where(eq(products.id, params.id)).limit(1);

  if (productList.length === 0) {
    notFound();
  }

  return <EditProductClient product={productList[0]} />;
}
