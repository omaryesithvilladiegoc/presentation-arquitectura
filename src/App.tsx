"use client";

import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/sections/HeroSection';
import { WhySection } from '@/sections/WhySection';
import { DiagramSection } from '@/sections/DiagramSection';
import { LayersSection } from '@/sections/LayersSection';
import { FacadeSection } from '@/sections/FacadeSection';
import { SimulatorSection } from '@/sections/SimulatorSection';
import { TestingSection } from '@/sections/TestingSection';
import { Footer } from '@/sections/Footer';
import { useLenis } from '@/hooks/useLenis';

export default function App() {
  useLenis();

  return (
    <div className="bg-bg-primary min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <WhySection />
        <DiagramSection />
        <LayersSection />
        <FacadeSection />
        <SimulatorSection />
        <TestingSection />
        <Footer />
      </main>
    </div>
  );
}
