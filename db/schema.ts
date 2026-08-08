import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  imageUrl: text('image_url').notNull(),
  status: text('status').notNull().default('active'), // active | draft
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const galleries = sqliteTable('galleries', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  layoutType: text('layout_type').notNull().default('grid'), // grid | slider
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const galleryImages = sqliteTable('gallery_images', {
  id: text('id').primaryKey(),
  galleryId: text('gallery_id').references(() => galleries.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  aspectRatio: real('aspect_ratio').notNull().default(1), // 1 | 0.75 | 1.33
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), // katalog | outlet | hero
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  content: text('content'), // JSON or structured text
  published: integer('published').notNull().default(1), // 1 = published, 0 = draft
  updatedAt: text('updated_at').notNull(),
});

export const settings = sqliteTable('settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(), // site_name | logo_url | phone | address | instagram | theme
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const activityLogs = sqliteTable('activity_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(), // create_product | update_product | upload_gallery | update_page | update_setting
  targetType: text('target_type').notNull(), // product | gallery | page | setting
  targetId: text('target_id'),
  metadata: text('metadata'), // JSON string
  createdAt: text('created_at').notNull(),
});
