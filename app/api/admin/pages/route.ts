import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allPages = await db.select().from(pages);
  return NextResponse.json({ success: true, pages: allPages });
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, description, imageUrl, published } = body;

    if (!slug || !title) {
      return NextResponse.json({ success: false, error: 'Slug dan judul halaman wajib diisi.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db
      .update(pages)
      .set({
        title,
        description,
        imageUrl,
        published: published ? 1 : 0,
        updatedAt: now,
      })
      .where(eq(pages.slug, slug));

    await logActivity({
      userId: admin.id,
      action: 'edit_konten_halaman',
      targetType: 'halaman',
      targetId: slug,
      metadata: { title, published },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menyimpan perubahan halaman.' }, { status: 500 });
  }
}
