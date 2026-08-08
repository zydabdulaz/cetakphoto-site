import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || (process.env.VERCEL ? 'file:/tmp/cetakphoto.db' : 'file:cetakphoto.db');

const client = createClient({
  url: dbUrl,
});

const db = drizzle(client, { schema });

export async function seedDatabase() {
  const now = new Date().toISOString();

  // Create SQLite tables if they do not exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS galleries (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      layout_type TEXT NOT NULL DEFAULT 'grid',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      gallery_id TEXT,
      image_url TEXT NOT NULL,
      aspect_ratio REAL NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      content TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default admin user if not existing
  const existingUser = await db.select().from(schema.users).limit(1);
  if (existingUser.length === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    await db.insert(schema.users).values({
      id: 'usr_admin_1',
      email: 'admin@cetakphoto.com',
      passwordHash,
      name: 'Admin CetakPhoto',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });
  }

  // Seed default settings if not existing
  const defaultSettings = [
    { key: 'site_name', value: 'CetakPhoto' },
    { key: 'logo_url', value: '/brand/cetakphoto.svg' },
    { key: 'phone', value: '6281234567890' },
    { key: 'address', value: 'Jl. Kemang Raya No. 12, Jakarta Selatan' },
    { key: 'instagram', value: '@cetakphoto.id' },
    { key: 'hero_title', value: 'Foto kamu, jadi lebih berarti.' },
    { key: 'hero_subtitle', value: 'Mulai dari kebutuhan sehari-hari sampai foto yang ingin kamu simpan di dinding.' },
  ];

  for (const s of defaultSettings) {
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.key, s.key)).limit(1);
    if (existing.length === 0) {
      await db.insert(schema.settings).values({
        id: `stg_${s.key}`,
        key: s.key,
        value: s.value,
        updatedAt: now,
      });
    }
  }

  // Seed default products
  const existingProducts = await db.select().from(schema.products).limit(1);
  if (existingProducts.length === 0) {
    const catalogData = [
      { id: 'p1', name: 'Pas Foto 3x4 / 4x6 Set', slug: 'pas-foto-set', description: 'Paket cetak pas foto resmi 8 lembar dengan kertas foto profesional', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800' },
      { id: 'p2', name: 'Foto Studio Family (Express)', slug: 'studio-family-express', description: 'Sesi studio foto keluarga 15 menit dengan lighting studio lengkap', price: 150000, imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800' },
      { id: 'p3', name: 'Self-Studio Slot 20 Menit', slug: 'self-studio-20m', description: 'Sesi foto bebas dengan remote shutter & unlimited all soft files', price: 95000, imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800' },
      { id: 'p4', name: 'Photobox Express 2 Strip', slug: 'photobox-2-strip', description: 'Cetak strip instan photobox dengan pilihan background & props', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800' },
      { id: 'p5', name: 'Minimalist Frame Wood 12R', slug: 'minimalist-frame-12r', description: 'Frame kayu minimalis warna natural dengan kaca bening anti debu', price: 120000, imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800' },
      { id: 'p6', name: 'Canvas Fine Art Print 24R', slug: 'canvas-fine-art-24r', description: 'Cetak kanvas HD berkualitas galeri dengan rangka kayu spanram kokoh', price: 350000, imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800' },
    ];

    for (const p of catalogData) {
      await db.insert(schema.products).values({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Seed default gallery images
  const existingGallery = await db.select().from(schema.galleryImages).limit(1);
  if (existingGallery.length === 0) {
    const galleryItems = [
      { id: 'g1', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800', aspectRatio: 0.75, sortOrder: 1 },
      { id: 'g2', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800', aspectRatio: 0.75, sortOrder: 2 },
      { id: 'g3', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800', aspectRatio: 1.0, sortOrder: 3 },
      { id: 'g4', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800', aspectRatio: 0.75, sortOrder: 4 },
      { id: 'g5', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200', aspectRatio: 1.333, sortOrder: 5 },
      { id: 'g6', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200', aspectRatio: 1.333, sortOrder: 6 },
      { id: 'g7', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800', aspectRatio: 1.0, sortOrder: 7 },
      { id: 'g8', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200', aspectRatio: 1.333, sortOrder: 8 },
      { id: 'g9', imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=800', aspectRatio: 0.75, sortOrder: 9 },
    ];

    for (const g of galleryItems) {
      await db.insert(schema.galleryImages).values({
        id: g.id,
        imageUrl: g.imageUrl,
        aspectRatio: g.aspectRatio,
        sortOrder: g.sortOrder,
        createdAt: now,
      });
    }
  }

  // Seed default pages
  const existingPages = await db.select().from(schema.pages).limit(1);
  if (existingPages.length === 0) {
    const pageItems = [
      { id: 'pg1', slug: 'katalog', title: 'Catalog CetakPhoto', description: 'Semua produk cetak, frame, dan jasa foto studio.', published: 1 },
      { id: 'pg2', slug: 'outlet', title: 'Outlet & Studio CetakPhoto', description: 'Kunjungi studio fisik kami di Kemang & Grand Indonesia.', published: 1 },
      { id: 'pg3', slug: 'hero', title: 'Foto kamu, jadi lebih berarti.', description: 'Mulai dari kebutuhan sehari-hari sampai foto dinding.', published: 1 },
    ];

    for (const pg of pageItems) {
      await db.insert(schema.pages).values({
        id: pg.id,
        slug: pg.slug,
        title: pg.title,
        description: pg.description,
        published: pg.published,
        updatedAt: now,
      });
    }
  }

  return true;
}
