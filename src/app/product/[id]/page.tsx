import { notFound } from 'next/navigation';
import { getProductById, getProductsByCollection } from '@/lib/products';
import ProductDetailView from '@/components/product/ProductDetailView';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  return {
    title: `${product.name}${product.productCode ? ` ${product.productCode}` : ''} — COURSET`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: `${product.name}${product.productCode ? ` ${product.productCode}` : ''} — COURSET`,
      description: product.tagline || product.description?.substring(0, 100),
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getProductsByCollection(product.collection)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Navigation />
      <ConciergeButton />
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
      <Footer />
    </>
  );
}
