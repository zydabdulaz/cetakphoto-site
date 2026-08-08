import { NextResponse } from 'next/server';
import { getAdminSession, updateAdminPassword } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Kata sandi lama dan baru wajib diisi.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Kata sandi baru minimal 6 karakter.' }, { status: 400 });
    }

    const result = await updateAdminPassword(admin.id, currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    await logActivity({
      userId: admin.id,
      action: 'ganti_kata_sandi',
      targetType: 'user',
      targetId: admin.id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
