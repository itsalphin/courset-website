export interface SpecRow {
  label: string;
  value: string;
}

interface SpecSheetProps {
  rows: SpecRow[];
}

/** Live specification sheet — reflects every selection (visual + informational). */
export default function SpecSheet({ rows }: SpecSheetProps) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
        Specification
      </h3>
      <dl className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4">
            <dt className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">{r.label}</dt>
            <dd className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-primary)] text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
