import { NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email dan kata sandi wajib diisi.' }, { status: 400 });
    }

    const result = await loginAdmin(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json({ success: false, error: result.error || 'Login gagal.' }, { status: 401 });
    }

    // Log admin login activity
    await logActivity({
      userId: result.user.id,
      action: 'login_admin',
      targetType: 'user',
      targetId: result.user.id,
      metadata: { email: result.user.email },
    });

    return NextResponse.json({ success: true, user: result.user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
