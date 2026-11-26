/**
 * R·J UI Per-Component Usage & Props Implementation Snippets
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import { MonarchComponent } from '../types.js';

const USAGE_MAP: Record<string, string> = {
  'spotlight-bento': `import { SpotlightBento } from '@/components/rjui/SpotlightBento';

export default function FeaturesSection() {
  return (
    <SpotlightBento
      spotlightColor="rgba(229, 193, 88, 0.22)"
      items={[
        {
          title: 'Zero-Dependency Core',
          description: 'Clean TypeScript primitives you own in your repo.',
          badge: 'Architecture',
          colSpan: 'md:col-span-8'
        },
        {
          title: '60fps Physics',
          description: 'GPU-accelerated pointer transforms.',
          badge: 'Motion',
          colSpan: 'md:col-span-4'
        }
      ]}
    />
  );
}`,
  'spatial-dock': `import { SpatialDock } from '@/components/rjui/SpatialDock';

export default function AppDock() {
  return (
    <SpatialDock
      magnification={1.45}
      items={[
        { id: 'home', label: 'Home', icon: <span>01</span>, onClick: () => console.log('Home') },
        { id: 'studio', label: 'Studio', icon: <span>02</span>, onClick: () => console.log('Studio') },
        { id: 'tokens', label: 'Tokens', icon: <span>03</span>, onClick: () => console.log('Tokens') }
      ]}
    />
  );
}`,
  'kinetic-card-3d': `import { KineticCard3D } from '@/components/rjui/KineticCard3D';

export default function ShowcaseCard() {
  return (
    <KineticCard3D maxTiltDeg={12}>
      <h3 className="text-lg font-semibold text-white">Royal Junction Edition</h3>
      <p className="mt-2 text-sm text-neutral-400">Move your cursor to tilt in 3D space.</p>
    </KineticCard3D>
  );
}`,
  'command-palette': `import { CommandPalette } from '@/components/rjui/CommandPalette';

export default function GlobalSearch() {
  return (
    <CommandPalette
      commands={[
        { id: 'docs', label: 'Open Documentation', shortcut: 'G D', onSelect: () => console.log('Docs') },
        { id: 'theme', label: 'Toggle Dark Mode', shortcut: '⌘ T', onSelect: () => console.log('Theme') }
      ]}
    />
  );
}`,
  'champagne-button': `import { ChampagneButton } from '@/components/rjui/ChampagneButton';

export default function HeroActions() {
  return (
    <ChampagneButton
      label="Explore Collection"
      strength={0.28}
      onClick={() => console.log('CTA clicked')}
    />
  );
}`,
  'dynamic-island': `import { DynamicIsland } from '@/components/rjui/DynamicIsland';

export default function StatusHeader() {
  return (
    <DynamicIsland
      title="Deployment Live"
      detail="Edge CDN synced across 38 PoPs in 42ms"
    />
  );
}`,
  'aurora-hero': `import { AuroraHero } from '@/components/rjui/AuroraHero';

export default function LandingHero() {
  return (
    <AuroraHero
      headline="Crafted for the Extraordinary."
      subtitle="Zero-dependency spatial primitives engineered with Apple-grade motion."
    />
  );
}`,
  'pricing-crown': `import { PricingCrown } from '@/components/rjui/PricingCrown';

export default function PricingSection() {
  return (
    <PricingCrown
      monthlyPrice={49}
      annualDiscount={0.2}
    />
  );
}`,
  'kinetic-marquee': `import { KineticMarquee } from '@/components/rjui/KineticMarquee';

export default function LogoStrip() {
  return (
    <KineticMarquee
      items={['NEXT.JS', 'TAILWIND', 'THREE.JS', 'STRIPE', 'LINEAR']}
    />
  );
}`,
  'metric-sparkline': `import { MetricSparkline } from '@/components/rjui/MetricSparkline';

export default function RevenueCard() {
  return (
    <MetricSparkline
      label="Net Revenue"
      value="$148,920"
      delta="+24.8%"
    />
  );
}`,
  'split-compare': `import { SplitCompare } from '@/components/rjui/SplitCompare';

export default function BeforeAfter() {
  return (
    <SplitCompare
      beforeLabel="Standard UI"
      afterLabel="Royal Junction"
    />
  );
}`,
  'founder-wall': `import { FounderWall } from '@/components/rjui/FounderWall';

export default function Testimonials() {
  return (
    <FounderWall
      quotes={[
        { author: 'Alex Chen', role: 'CTO', quote: 'Cleanest grid architecture we have shipped.' },
        { author: 'Maya Lin', role: 'Staff Eng', quote: 'Zero runtime deps, instant copy-paste.' }
      ]}
    />
  );
}`
};

export function getComponentUsage(comp: MonarchComponent): string {
  return (
    USAGE_MAP[comp.id] ||
    `import { ${comp.filename.replace('.tsx', '')} } from '@/components/rjui/${comp.filename.replace('.tsx', '')}';`
  );
}
