import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import CustomizeExperience from '@/components/configurator/CustomizeExperience';

export const metadata = {
  title: 'Customize Your Piece — COURSET™',
  description: 'Begin a bespoke commission. Choose your silhouette, then tailor metal, finish, stones, and specifications.',
};

export default function CustomizePage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />
      <CustomizeExperience />
      <Footer />
    </>
  );
}
