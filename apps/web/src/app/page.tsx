/**
 * Landing Page — İşAkış
 *
 * Faz durumu:
 *   [x] Faz 1 — Temel: MarketingNavbar, HeroOperationsFlow, FlowLine, WorkflowNode, OperationTimeline
 *   [x] Faz 2 — Çekirdek: TrustStrip, OperationsBeforeAfter, LifecycleStickySection
 *   [x] Faz 3 — Ürün derinliği: WebMobileSyncShowcase, OperationalFeatureBento, TrustAndSecuritySection
 *   [x] Faz 4 — Dönüşüm: PilotProgramSection, SinglePlanPricing, LandingFaq, FinalWorkOrderCta, MarketingFooter
 *   [ ] Faz 5 — Kalite: a11y audit, perf, SEO, schema
 *
 * DESIGN.md §2.5 — Evidence before claims.
 * Kaldırılan: FloatingCards, TrustBar (tech logos), AnimatedStats, TestimonialMarquee,
 *             FeatureShowcase, BentoBenefits, HowItWorks, Pricing, FaqSection, CtaSection, FooterSection.
 */

import { MarketingNavbar } from '@/components/marketing/MarketingNavbar';
import { HeroOperationsFlow } from '@/components/marketing/HeroOperationsFlow';
import { TrustStrip } from '@/components/marketing/TrustStrip';
import { OperationsBeforeAfter } from '@/components/marketing/OperationsBeforeAfter';
import { LifecycleStickySection } from '@/components/marketing/LifecycleStickySection';
import { OperationalFeatureBento } from '@/components/marketing/OperationalFeatureBento';
import { SinglePlanPricing } from '@/components/marketing/SinglePlanPricing';
import { LandingFaq } from '@/components/marketing/LandingFaq';
import { FinalWorkOrderCta } from '@/components/marketing/FinalWorkOrderCta';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--sf-bg)' }}>
      {/* Faz 1 */}
      <MarketingNavbar />
      <HeroOperationsFlow />

      {/* Faz 2 */}
      <TrustStrip />
      <OperationsBeforeAfter />
      <LifecycleStickySection />

      {/* Faz 3 */}
      <OperationalFeatureBento />
      {/* Faz 4 */}
      <SinglePlanPricing />
      <LandingFaq />
      <FinalWorkOrderCta />
      <MarketingFooter />
    </div>
  );
}
