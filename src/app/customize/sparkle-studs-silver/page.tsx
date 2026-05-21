import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import CustomizeClient from './CustomizeClient';

export const metadata = {
  title: 'Customize Sparkle Studs Silver — COURSET™',
  description:
    'Personalize your Sparkle Studs Silver — explore the piece in motion and choose your diamond carat weight (0.50, 0.75, or 0.98 ct twt).',
};

export default function CustomizeSparkleStudsSilverPage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />
      <CustomizeClient />
      <Footer />
    </>
  );
}
