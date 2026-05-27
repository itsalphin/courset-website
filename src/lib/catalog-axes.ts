/**
 * Resolves a Piece's declared axes into render-ready option lists.
 * The UI maps over these — it never hard-codes which controls to show.
 */
import {
  type Piece,
  type AxisKind,
  imagePath,
  METAL_COLORS,
  KARATS,
  TREATMENTS,
  ACCENTS,
  ENAMEL_COLORS,
  EARRING_BACKS,
  BALL_ACCENTS,
  ORIENTATIONS,
  CUT_GRADES,
  CLARITIES,
} from './catalog';

export interface AxisOption {
  id: string | number;
  label: string;
  note?: string;
}

export interface ResolvedAxis {
  key: string;
  label: string;
  kind: AxisKind;
  options: AxisOption[];
}

type Vocab = ReadonlyArray<{ id: string; label: string; note?: string }>;

const META: Record<string, { label: string; vocab?: Vocab }> = {
  metalColor: { label: 'Metal', vocab: METAL_COLORS },
  treatment: { label: 'Finish', vocab: TREATMENTS },
  accent: { label: 'Accent', vocab: ACCENTS },
  enamelColor: { label: 'Enamel Color', vocab: ENAMEL_COLORS },
  earringBack: { label: 'Earring Back', vocab: EARRING_BACKS },
  ballAccent: { label: 'Ball Accent', vocab: BALL_ACCENTS },
  orientation: { label: 'Orientation', vocab: ORIENTATIONS },
  caratVersion: { label: 'Diamond Weight' }, // numeric
  karat: { label: 'Karat', vocab: KARATS },
  cutGrade: { label: 'Cut', vocab: CUT_GRADES },
  clarity: { label: 'Clarity', vocab: CLARITIES },
  chainLength: { label: 'Chain Length' }, // numeric
};

const VISUAL_ORDER = ['metalColor', 'orientation', 'treatment', 'accent', 'enamelColor', 'caratVersion', 'earringBack', 'ballAccent'];
const INFO_ORDER = ['karat', 'cutGrade', 'clarity', 'chainLength'];

function resolve(piece: Piece, key: string): ResolvedAxis | null {
  const allowed = (piece.axes as Record<string, (string | number)[] | undefined>)[key];
  // Skip empty axes AND single-option axes — a one-button picker has no real choice.
  if (!allowed || allowed.length < 2) return null;

  const meta = META[key];
  let options: AxisOption[];

  if (key === 'caratVersion') {
    options = (allowed as number[]).map((n) => ({ id: n, label: `${n.toFixed(2)} ct` }));
  } else if (key === 'chainLength') {
    options = (allowed as number[]).map((n) => ({ id: n, label: `${n}"` }));
  } else {
    const vocab = meta.vocab ?? [];
    options = (allowed as string[]).map((id) => {
      const v = vocab.find((x) => x.id === id);
      return { id, label: v?.label ?? id, note: v?.note };
    });
  }

  const kind: AxisKind = INFO_ORDER.includes(key) ? 'informational' : 'visual';
  return { key, label: meta.label, kind, options };
}

/**
 * Diamond-only axes that should hide when the piece is currently polished
 * (treatment === 'plain').
 */
const DIAMOND_AXES = new Set(['caratVersion', 'cutGrade', 'clarity']);

function axisApplies(key: string, sel?: Record<string, string | number>): boolean {
  if (sel?.treatment === 'plain' && DIAMOND_AXES.has(key)) return false;
  return true;
}

export function getVisualAxes(piece: Piece, sel?: Record<string, string | number>): ResolvedAxis[] {
  return VISUAL_ORDER.map((k) => resolve(piece, k))
    .filter((a): a is ResolvedAxis => a !== null)
    .filter((a) => axisApplies(a.key, sel));
}

export function getInformationalAxes(piece: Piece, sel?: Record<string, string | number>): ResolvedAxis[] {
  return INFO_ORDER.map((k) => resolve(piece, k))
    .filter((a): a is ResolvedAxis => a !== null)
    .filter((a) => axisApplies(a.key, sel));
}

/**
 * Every distinct catalog image path for a piece (cartesian product of visual
 * axis options, deduped). Used to silently warm the Vercel image optimization
 * cache for all variants the user might pick — same trick the rest of the site
 * benefits from naturally, because pages like /collections list every image
 * up-front and the cache stays warm.
 */
export function enumeratePieceImagePaths(piece: Piece): string[] {
  const visualAxes = getVisualAxes(piece); // no sel filter → all axes
  let combos: Array<Record<string, string | number>> = [{ ...piece.defaults }];
  for (const axis of visualAxes) {
    const next: Array<Record<string, string | number>> = [];
    for (const combo of combos) {
      for (const opt of axis.options) {
        next.push({ ...combo, [axis.key]: opt.id });
      }
    }
    combos = next;
  }
  return Array.from(new Set(combos.map((c) => imagePath(piece, c))));
}
