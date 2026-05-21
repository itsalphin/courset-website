import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import CustomizeClient from './CustomizeClient';

export const metadata = {
  title: 'Customize Paddle Pavé Silver — COURSET™',
  description:
    'Explore the Paddle Pavé Silver pendant in motion — a .74ct pavé-set white-gold paddle on a cable chain.',
};

export default function CustomizePaddlePaveSilverPage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />
      <CustomizeClient />
      <Footer />
    </>
  );
}
