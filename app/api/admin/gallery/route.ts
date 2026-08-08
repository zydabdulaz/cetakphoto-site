import { NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryImages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getAdminSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET() {
  const images = await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
  return NextResponse.json({ success: true, images });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl, aspectRatio, sortOrder } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'URL Gambar wajib diisi.' }, { status: 400 });
    }

    const id = `gal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    await db.insert(galleryImages).values({
      id,
      imageUrl,
      aspectRatio: parseFloat(aspectRatio) || 1,
      sortOrder: parseInt(sortOrder) || 0,
      createdAt,
    });

    await logActivity({
      userId: admin.id,
      action: 'upload_galeri',
      targetType: 'galeri',
      targetId: id,
      metadata: { imageUrl, aspectRatio },
    });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal mengunggah gambar.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan.' }, { status: 400 });
    }

    await db.delete(galleryImages).where(eq(galleryImages.id, id));

    await logActivity({
      userId: admin.id,
      action: 'hapus_foto_galeri',
      targetType: 'galeri',
      targetId: id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menghapus gambar.' }, { status: 500 });
  }
}
