import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/db';
import { galleryImages } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { GalleryAdminClient } from '@/components/admin/GalleryAdminClient';

export default async function AdminGalleryPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Kelola Galeri Foto Studio
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Tambah gambar galeri baru, pilih rasio presisi (1:1, 3:4 Portrait, 4:3 Landscape), & atur urutan posisi.
        </p>
      </div>

      <GalleryAdminClient initialImages={images} />
    </div>
  );
}
