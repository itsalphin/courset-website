import { notFound } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import Configurator from '@/components/configurator/Configurator';
import { CATALOG, byId } from '@/lib/catalog.config';

interface ConfigurePageProps {
  params: Promise<{ pieceId: string }>;
}

// Catalog pieces only. The bespoke static routes (sparkle-studs-silver, etc.)
// live in their own folders and take precedence over this dynamic segment.
export function generateStaticParams() {
  return CATALOG.map((p) => ({ pieceId: p.id }));
}

export async function generateMetadata({ params }: ConfigurePageProps) {
  const { pieceId } = await params;
  const piece = byId(pieceId);
  if (!piece) return {};
  return {
    title: `Customize ${piece.name} — COURSET™`,
    description: `Configure your ${piece.name} — choose metal, finish, stones, and specifications.`,
  };
}

export default async function ConfigurePage({ params }: ConfigurePageProps) {
  const { pieceId } = await params;
  const piece = byId(pieceId);
  if (!piece) notFound();

  return (
    <>
      <Navigation />
      <ConciergeButton />
      <Configurator piece={piece} />
      <Footer />
    </>
  );
}
