import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // ═══ WAF: Block null bytes ═══
  if (req.nextUrl.toString().includes('%00')) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ═══ CSRF: Verify Origin on state-changing requests ═══
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Skip for Stripe webhooks (signature verification handles it).
    if (!req.nextUrl.pathname.startsWith('/api/webhook')) {
      const origin = req.headers.get('origin');
      const host = req.headers.get('host');

      // Require both — a missing Origin on a state-changing request is itself suspicious.
      if (!origin || !host) {
        return new NextResponse('CSRF validation failed: missing origin', { status: 403 });
      }

      // Parse the Origin URL and compare the EXACT host — not substring/includes,
      // which is bypassable via subdomain confusion (e.g. localhost:3000.attacker.com).
      let originHost: string;
      try {
        originHost = new URL(origin).host;
      } catch {
        return new NextResponse('CSRF validation failed: invalid origin', { status: 403 });
      }
      if (originHost !== host) {
        return new NextResponse('CSRF validation failed', { status: 403 });
      }
    }
  }

  // ═══ Remove server identity ═══
  response.headers.delete('x-powered-by');
  response.headers.delete('server');

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
