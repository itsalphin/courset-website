import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing';
import { rateLimit } from '@/lib/rate-limit';

const VALID_SHAPES = ['paddle', 'ball', 'court', 'net', 'custom'] as const;
const VALID_KARATS = [10, 14, 18, 24] as const;
const VALID_METALS = ['yellow-gold', 'white-gold', 'rose-gold', 'platinum'] as const;
const VALID_SIZES = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0] as const;
const VALID_CUTS = ['round', 'princess', 'cushion', 'emerald'] as const;
const VALID_CLARITIES = ['VS2', 'VS1', 'VVS2', 'VVS1', 'IF'] as const;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`price:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const body = await request.json();

    // Validate all fields strictly
    if (
      !VALID_SHAPES.includes(body.shape) ||
      !VALID_KARATS.includes(body.karat) ||
      !VALID_METALS.includes(body.metalType) ||
      typeof body.baseProduct !== 'string' ||
      body.baseProduct.length > 50 ||
      typeof body.engraving !== 'string' ||
      body.engraving.length > 20 ||
      typeof body.diamond?.enabled !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Invalid configuration' }, { status: 400 });
    }

    if (body.diamond.enabled) {
      if (
        !VALID_SIZES.includes(body.diamond.size) ||
        !VALID_CUTS.includes(body.diamond.cut) ||
        !VALID_CLARITIES.includes(body.diamond.clarity)
      ) {
        return NextResponse.json({ error: 'Invalid diamond configuration' }, { status: 400 });
      }
    }

    const breakdown = calculatePrice({
      shape: body.shape,
      karat: body.karat,
      metalType: body.metalType,
      baseProduct: body.baseProduct,
      engraving: body.engraving,
      diamond: {
        enabled: body.diamond.enabled,
        size: body.diamond.size ?? 0.5,
        cut: body.diamond.cut ?? 'round',
        clarity: body.diamond.clarity ?? 'VS1',
      },
    });

    return NextResponse.json(breakdown);
  } catch {
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 400 });
  }
}
