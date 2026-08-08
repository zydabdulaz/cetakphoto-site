import { db } from '@/db';
import { activityLogs } from '@/db/schema';

export async function logActivity({
  userId,
  action,
  targetType,
  targetId,
  metadata,
}: {
  userId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();
    await db.insert(activityLogs).values({
      id,
      userId: userId || 'usr_admin_1',
      action,
      targetType,
      targetId: targetId || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt,
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}
