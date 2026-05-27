/**
 * Resolves a Piece's declared axes into render-ready option lists.
 * The UI maps over these — it never hard-codes which controls to show.
 */
import {
  type Piece,
  type AxisKind,
  METAL_COLORS,
  KARATS,
  TREATMENTS,
  ACCENTS,
  ENAMEL_COLORS,
  EARRING_BACKS,
  BALL_ACCENTS,
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
  caratVersion: { label: 'Diamond Weight' }, // numeric
  karat: { label: 'Karat', vocab: KARATS },
  cutGrade: { label: 'Cut', vocab: CUT_GRADES },
  clarity: { label: 'Clarity', vocab: CLARITIES },
  chainLength: { label: 'Chain Length' }, // numeric
};

const VISUAL_ORDER = ['metalColor', 'treatment', 'accent', 'enamelColor', 'caratVersion', 'earringBack', 'ballAccent'];
const INFO_ORDER = ['karat', 'cutGrade', 'clarity', 'chainLength'];

function resolve(piece: Piece, key: string): ResolvedAxis | null {
  const allowed = (piece.axes as Record<string, (string | number)[] | undefined>)[key];
  if (!allowed || allowed.length === 0) return null;

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
