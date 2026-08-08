import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function GET() {
  const allProducts = await db.select().from(products);
  return NextResponse.json({ success: true, products: allProducts });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, price, imageUrl, status } = body;

    if (!name || !price || !imageUrl) {
      return NextResponse.json({ success: false, error: 'Nama, harga, dan gambar produk wajib diisi.' }, { status: 400 });
    }

    const productId = `prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    await db.insert(products).values({
      id: productId,
      name,
      slug: productSlug,
      description: description || '',
      price: parseFloat(price),
      imageUrl,
      status: status || 'active',
      createdAt: now,
      updatedAt: now,
    });

    await logActivity({
      userId: admin.id,
      action: 'tambah_produk',
      targetType: 'produk',
      targetId: productId,
      metadata: { name, price, status },
    });

    return NextResponse.json({ success: true, id: productId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menyimpan produk.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, slug, description, price, imageUrl, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID produk tidak valid.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db
      .update(products)
      .set({
        name,
        slug,
        description,
        price: parseFloat(price),
        imageUrl,
        status,
        updatedAt: now,
      })
      .where(eq(products.id, id));

    await logActivity({
      userId: admin.id,
      action: 'ubah_detail_produk',
      targetType: 'produk',
      targetId: id,
      metadata: { name, price, status },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal memperbarui produk.' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'ID produk tidak ditemukan.' }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, id));

    await logActivity({
      userId: admin.id,
      action: 'hapus_produk',
      targetType: 'produk',
      targetId: id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menghapus produk.' }, { status: 500 });
  }
}
