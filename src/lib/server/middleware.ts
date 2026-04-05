import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './auth';
import { isIPBlocked } from './audit';
import { hasPermission } from './audit';
import { rateLimit } from '../rate-limit';

type RouteHandler = (
  req: NextRequest,
  context: { user?: { id: string; role: string }; params?: Record<string, string> }
) => Promise<NextResponse>;

// ══════════ AUTH MIDDLEWARE ══════════

export function withAuth(handler: RouteHandler): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    return handler(req, { user: { id: payload.sub, role: payload.role } });
  };
}

// ══════════ RBAC MIDDLEWARE ══════════

export function withPermission(permission: string, handler: RouteHandler): (req: NextRequest) => Promise<NextResponse> {
  return withAuth(async (req, context) => {
    if (!context.user || !hasPermission(context.user.role, permission)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    return handler(req, context);
  });
}

// ══════════ RATE LIMIT MIDDLEWARE ══════════

export function withRateLimit(
  maxRequests: number,
  windowMs: number,
  handler: (req: NextRequest) => Promise<NextResponse>,
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const key = `${req.nextUrl.pathname}:${ip}`;
    const { allowed } = rateLimit(key, maxRequests, windowMs);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(windowMs / 1000)) } },
      );
    }

    return handler(req);
  };
}

// ══════════ WAF MIDDLEWARE ══════════

export function withWAF(handler: (req: NextRequest) => Promise<NextResponse>): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Check IP blacklist
    const blocked = await isIPBlocked(ip);
    if (blocked) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Block null bytes in all string inputs
    const url = req.nextUrl.toString();
    if (url.includes('%00') || url.includes('\0')) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    return handler(req);
  };
}

// ══════════ CSRF MIDDLEWARE ══════════

export function withCSRF(handler: (req: NextRequest) => Promise<NextResponse>): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req);
    }

    const origin = req.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (origin && !appUrl.startsWith(origin)) {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
    }

    return handler(req);
  };
}

// ══════════ COMPOSE MIDDLEWARE ══════════

export function compose(
  ...middlewares: Array<(handler: (req: NextRequest) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>>
) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return middlewares.reduceRight((h, mw) => mw(h), handler);
  };
}
