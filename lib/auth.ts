import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

const ADMIN_SESSION_COOKIE = 'cp_admin_session';

export async function getAdminSession() {
  await seedDatabase();
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  try {
    const [userId, timestamp] = sessionToken.split(':');
    if (!userId) return null;

    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length === 0) return null;

    return userList[0];
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, passwordPlain: string) {
  await seedDatabase();
  const cleanEmail = email.trim().toLowerCase();
  const userList = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);

  if (userList.length === 0) {
    return { success: false, error: 'Email atau kata sandi tidak ditemukan.' };
  }

  const user = userList[0];
  const isValid = bcrypt.compareSync(passwordPlain, user.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Kata sandi yang Anda masukkan salah.' };
  }

  const cookieStore = cookies();
  const sessionValue = `${user.id}:${Date.now()}`;
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, user };
}

export async function logoutAdmin() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { success: true };
}

export async function updateAdminPassword(userId: string, currentPasswordPlain: string, newPasswordPlain: string) {
  const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (userList.length === 0) {
    return { success: false, error: 'User tidak ditemukan.' };
  }

  const user = userList[0];
  const isValid = bcrypt.compareSync(currentPasswordPlain, user.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Kata sandi lama Anda salah.' };
  }

  const newHash = bcrypt.hashSync(newPasswordPlain, 10);
  const now = new Date().toISOString();

  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: now })
    .where(eq(users.id, userId));

  return { success: true };
}
