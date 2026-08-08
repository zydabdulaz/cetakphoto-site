import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DATABASE_URL || (process.env.VERCEL ? 'file:/tmp/cetakphoto.db' : 'file:cetakphoto.db');

const client = createClient({
  url: dbUrl,
});

let seedPromise: Promise<boolean> | null = null;

export function seedDatabase(): Promise<boolean> {
  if (!seedPromise) {
    seedPromise = _seedDatabaseInternal();
  }
  return seedPromise;
}

async function _seedDatabaseInternal() {
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
      category TEXT NOT NULL DEFAULT 'print',
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

  // Seed default admin user using INSERT OR IGNORE to avoid race conditions
  const passwordHash = bcrypt.hashSync('admin123', 10);
  await client.execute({
    sql: `INSERT OR IGNORE INTO users (id, email, password_hash, name, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ['usr_admin_1', 'admin@cetakphoto.com', passwordHash, 'Admin CetakPhoto', 'admin', now, now],
  });

  // Seed default settings using INSERT OR IGNORE
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
    await client.execute({
      sql: `INSERT OR IGNORE INTO settings (id, key, value, updated_at) VALUES (?, ?, ?, ?)`,
      args: [`stg_${s.key}`, s.key, s.value, now],
    });
  }

  // Seed default products using INSERT OR IGNORE
  const catalogData = [
    { id: 'p1', name: 'Pas Foto 3x4 / 4x6 Set', slug: 'pas-foto-set', description: 'Paket cetak pas foto resmi 8 lembar dengan kertas foto profesional', price: 25000, category: 'service', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800' },
    { id: 'p2', name: 'Foto Studio Family (Express)', slug: 'studio-family-express', description: 'Sesi studio foto keluarga 15 menit dengan lighting studio lengkap', price: 150000, category: 'service', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800' },
    { id: 'p3', name: 'Self-Studio Slot 20 Menit', slug: 'self-studio-20m', description: 'Sesi foto bebas dengan remote shutter & unlimited all soft files', price: 95000, category: 'service', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800' },
    { id: 'p4', name: 'Photobox Express 2 Strip', slug: 'photobox-2-strip', description: 'Cetak strip instan photobox dengan pilihan background & props', price: 35000, category: 'service', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800' },
    { id: 'p5', name: 'Minimalist Frame Wood 12R', slug: 'minimalist-frame-12r', description: 'Frame kayu minimalis warna natural dengan kaca bening anti debu', price: 120000, category: 'frame', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800' },
    { id: 'p6', name: 'Canvas Fine Art Print 24R', slug: 'canvas-fine-art-24r', description: 'Cetak kanvas HD berkualitas galeri dengan rangka kayu spanram kokoh', price: 350000, category: 'print', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800' },
    { id: 'p7', name: 'Cetak Foto Kertas 4R Glossy', slug: 'cetak-foto-4r', description: 'Kertas foto premium anti luntur 10,2 x 15,2 cm', price: 5000, category: 'print', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800' },
    { id: 'p8', name: 'Frame Decorative 3D Baby', slug: 'frame-3d-baby', description: 'Frame timbul 3D dengan ukiran biodata & cetak foto bayi', price: 195000, category: 'frame', imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800' },
  ];

  for (const p of catalogData) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO products (id, name, slug, description, price, image_url, category, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.id, p.name, p.slug, p.description, p.price, p.imageUrl, p.category, 'active', now, now],
    });
  }

  // Seed default gallery images using INSERT OR IGNORE
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
    await client.execute({
      sql: `INSERT OR IGNORE INTO gallery_images (id, image_url, aspect_ratio, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [g.id, g.imageUrl, g.aspectRatio, g.sortOrder, now],
    });
  }

  // Seed default pages using INSERT OR IGNORE
  const pageItems = [
    { id: 'pg1', slug: 'katalog', title: 'Catalog CetakPhoto', description: 'Semua produk cetak, frame, dan jasa foto studio.', published: 1 },
    { id: 'pg2', slug: 'outlet', title: 'Outlet & Studio CetakPhoto', description: 'Kunjungi studio fisik kami di Kemang & Grand Indonesia.', published: 1 },
    { id: 'pg3', slug: 'hero', title: 'Foto kamu, jadi lebih berarti.', description: 'Mulai dari kebutuhan sehari-hari sampai foto dinding.', published: 1 },
  ];

  for (const pg of pageItems) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO pages (id, slug, title, description, published, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [pg.id, pg.slug, pg.title, pg.description, pg.published, now],
    });
  }

  return true;
}

