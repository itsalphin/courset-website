import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import CustomizationStudio from '@/components/sections/CustomizationStudio';

export const metadata = {
  title: 'Customize Your Piece \u2014 COURSET\u2122',
  description: 'Design your own luxury pickleball jewelry. Choose shape, metal, karat, diamond, and more.',
};

export default function CustomizePage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />
      <main id="main-content">
        <CustomizationStudio />
      </main>
      <Footer />
    </>
  );
}
