import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { ProductListClient } from '@/components/admin/ProductListClient';

export default async function AdminProductsPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Kelola Produk & Katalog
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Tambah produk baru, ubah rincian harga, gambar, dan status publikasi di katalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {/* Product List Client Component */}
      <ProductListClient initialProducts={allProducts} />
    </div>
  );
}
