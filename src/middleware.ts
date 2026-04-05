import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // ═══ WAF: Block null bytes ═══
  if (req.nextUrl.toString().includes('%00')) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ═══ CSRF: Verify Origin on state-changing requests ═══
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');

    // Skip for Stripe webhooks (they have their own signature verification)
    if (!req.nextUrl.pathname.startsWith('/api/webhook')) {
      if (origin && host && !origin.includes(host)) {
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
