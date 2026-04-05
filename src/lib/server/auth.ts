import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { prisma } from './db';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

// ══════════ PASSWORD HASHING (Argon2id) ══════════

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

// ══════════ JWT TOKENS ══════════

interface TokenPayload {
  sub: string;
  role: string;
  type: 'access' | 'refresh';
}

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role, type: 'access' } as TokenPayload, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// ══════════ REFRESH TOKEN ROTATION ══════════

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const familyId = crypto.randomUUID();

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return token;
}

export async function rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const oldHash = crypto.createHash('sha256').update(oldToken).digest('hex');
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: oldHash } });

  if (!stored || stored.expiresAt < new Date()) return null;

  // Detect reuse — revoke entire family
  if (stored.used) {
    await prisma.refreshToken.deleteMany({ where: { familyId: stored.familyId } });
    return null;
  }

  // Mark as used
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { used: true } });

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) return null;

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = await generateRefreshToken(user.id);

  return { accessToken, refreshToken };
}

// ══════════ SESSION MANAGEMENT ══════════

export async function createSession(userId: string, userAgent: string, ip: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.session.create({
    data: {
      userId,
      token: tokenHash,
      userAgent,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    },
  });

  return token;
}

export async function validateSession(token: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const session = await prisma.session.findUnique({
    where: { token: tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function invalidateSession(token: string): Promise<void> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await prisma.session.deleteMany({ where: { token: tokenHash } });
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

// ══════════ ACCOUNT LOCKOUT ══════════

export async function recordFailedLogin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;

  const failedLogins = user.failedLogins + 1;
  const lockedUntil = failedLogins >= MAX_FAILED_LOGINS
    ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
    : null;

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLogins, lockedUntil },
  });

  return failedLogins >= MAX_FAILED_LOGINS;
}

export async function resetFailedLogins(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLogins: 0, lockedUntil: null },
  });
}

export function isAccountLocked(user: { lockedUntil: Date | null }): boolean {
  return user.lockedUntil !== null && user.lockedUntil > new Date();
}

// ══════════ PASSWORD RESET ══════════

export async function createPasswordResetToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await prisma.passwordReset.create({
    data: {
      email,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  return token;
}

export async function validatePasswordResetToken(token: string): Promise<string | null> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const reset = await prisma.passwordReset.findUnique({ where: { tokenHash } });

  if (!reset || reset.used || reset.expiresAt < new Date()) return null;

  await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });
  return reset.email;
}

// ══════════ FIELD ENCRYPTION ══════════

const ENCRYPTION_KEY = Buffer.from(process.env.FIELD_ENCRYPTION_KEY || '0'.repeat(64), 'hex');

export function encryptField(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(ciphertext: string): string {
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  return decipher.update(encryptedHex, 'hex', 'utf8') + decipher.final('utf8');
}
