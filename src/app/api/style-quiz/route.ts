import { NextResponse } from 'next/server';
import { getQuizRecommendations } from '@/lib/recommendations';
import { rateLimit } from '@/lib/rate-limit';

const VALID_STYLES = ['minimalist', 'bold', 'classic', 'artistic'] as const;
const VALID_OCCASIONS = ['self-reward', 'gift', 'milestone', 'everyday'] as const;
const VALID_METALS = ['yellow-gold', 'white-gold', 'rose-gold', 'surprise'] as const;
const VALID_DIAMONDS = ['essential', 'nice-to-have', 'not-for-me'] as const;
const VALID_BUDGETS = ['under-1k', '1k-3k', '3k-7k', '7k-plus'] as const;

export async function POST(request: Request) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`quiz:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const body = await request.json();

    // Strict validation — allowlist values only
    if (
      !VALID_STYLES.includes(body.style) ||
      !VALID_OCCASIONS.includes(body.occasion) ||
      !VALID_METALS.includes(body.metal) ||
      !VALID_DIAMONDS.includes(body.diamond) ||
      !VALID_BUDGETS.includes(body.budget)
    ) {
      return NextResponse.json({ error: 'Invalid quiz answers' }, { status: 400 });
    }

    const recommendations = getQuizRecommendations({
      style: body.style,
      occasion: body.occasion,
      metal: body.metal,
      diamond: body.diamond,
      budget: body.budget,
    });

    return NextResponse.json({ recommendations });
  } catch {
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
  }
}
