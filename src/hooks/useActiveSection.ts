import { useState, useEffect } from 'react';

const sections = [
  'hero',
  'why',
  'diagram',
  'layers',
  'facade',
  'facade-flow',
  'facade-code',
  'simulator',
  'comparison',
  'testing',
  'footer',
];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return activeSection;
}
