import { prisma } from './db';

interface AuditEvent {
  userId?: string;
  action: string;
  outcome: 'success' | 'failure' | 'blocked';
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  severity?: 'info' | 'warn' | 'critical';
}

export async function logAudit(event: AuditEvent): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: event.userId,
        action: event.action,
        outcome: event.outcome,
        resource: event.resource,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        details: event.details ? JSON.stringify(event.details) : null,
        severity: event.severity || 'info',
      },
    });
  } catch (error) {
    // Never let audit logging failure break the app
    console.error('[AUDIT] Failed to log:', error);
  }
}

// ══════════ WAF / IP BLOCKING ══════════

export async function isIPBlocked(ip: string): Promise<boolean> {
  const blocked = await prisma.blockedIP.findUnique({ where: { ipAddress: ip } });
  if (!blocked) return false;
  if (blocked.expiresAt && blocked.expiresAt < new Date()) {
    await prisma.blockedIP.delete({ where: { id: blocked.id } });
    return false;
  }
  return true;
}

export async function blockIP(ip: string, reason: string, durationMinutes?: number): Promise<void> {
  await prisma.blockedIP.upsert({
    where: { ipAddress: ip },
    create: {
      ipAddress: ip,
      reason,
      expiresAt: durationMinutes ? new Date(Date.now() + durationMinutes * 60 * 1000) : null,
    },
    update: {
      reason,
      expiresAt: durationMinutes ? new Date(Date.now() + durationMinutes * 60 * 1000) : null,
    },
  });
}

// ══════════ RBAC PERMISSIONS ══════════

const ROLE_PERMISSIONS: Record<string, string[]> = {
  superadmin: ['*'],
  admin: [
    'users:read', 'users:update', 'users:delete',
    'orders:read', 'orders:update',
    'products:read', 'products:update',
    'audit:read',
  ],
  user: [
    'profile:read', 'profile:update',
    'orders:create', 'orders:read:own',
    'products:read',
  ],
  guest: ['products:read'],
};

export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function requireRole(...roles: string[]) {
  return (userRole: string): boolean => roles.includes(userRole);
}
