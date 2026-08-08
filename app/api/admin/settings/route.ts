import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  allSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });
  return NextResponse.json({ success: true, settings: settingsMap });
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json(); // Record<string, string>
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(body)) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);

      if (existing.length > 0) {
        await db.update(settings).set({ value: stringValue, updatedAt: now }).where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({ id: `stg_${key}`, key, value: stringValue, updatedAt: now });
      }
    }

    await logActivity({
      userId: admin.id,
      action: 'update_pengaturan_website',
      targetType: 'pengaturan',
      targetId: 'site_settings',
      metadata: body,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Gagal menyimpan pengaturan.' }, { status: 500 });
  }
}
