import { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AboutSection } from '@/components/landing/AboutSection';
import { AiScreeningSection } from '@/components/landing/AiScreeningSection';
import { ChallengesSection } from '@/components/landing/ChallengesSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { scrollToHash, useLocation } from '@/lib/routing';

export function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'OptiScan | Detect Early. Protect Vision.';
  }, []);

  useEffect(() => {
    scrollToHash(hash);
  }, [hash]);

  return (
    <PageLayout>
      <HeroSection />
      <ChallengesSection />
      <HowItWorksSection />
      <AiScreeningSection />
      <AboutSection />
    </PageLayout>
  );
}
