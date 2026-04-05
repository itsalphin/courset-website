import { Award, Leaf, Shield, Truck } from 'lucide-react';
import TrustBadge from '@/components/ui/TrustBadge';
import Reveal from '@/components/ui/Reveal';

const badges = [
  { icon: Award, label: 'GIA Certified' },
  { icon: Leaf, label: 'Ethically Sourced' },
  { icon: Shield, label: 'Lifetime Warranty' },
  { icon: Truck, label: 'Insured Delivery' },
];

export default function ProvenanceStrip() {
  return (
    <Reveal className="mt-14">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-8 border-t border-[var(--color-border)]">
        {badges.map((b) => (
          <TrustBadge key={b.label} icon={b.icon} label={b.label} />
        ))}
      </div>
    </Reveal>
  );
}
