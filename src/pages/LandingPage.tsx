import { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AboutSection } from '@/components/landing/AboutSection';
import { AiScreeningSection } from '@/components/landing/AiScreeningSection';
import { ChallengesSection } from '@/components/landing/ChallengesSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ModelInfoSection } from '@/components/landing/ModelInfoSection';
import { scrollToHash, useLocation } from '@/lib/routing';

export function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'OptiScan | See Beyond the Image';
  }, []);

  useEffect(() => {
    scrollToHash(hash);
  }, [hash]);

  return (
    <PageLayout>
      <HeroSection />
      <ChallengesSection />
      <HowItWorksSection />
      <ModelInfoSection />
      <AiScreeningSection />
      <AboutSection />
    </PageLayout>
  );
}
