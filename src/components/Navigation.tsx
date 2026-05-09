import { useActiveSection } from '@/hooks/useActiveSection';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const navLinks = [
  { id: 'hero', label: 'Inicio' },
  { id: 'why', label: '¿Por qué?' },
  { id: 'diagram', label: 'Diagrama' },
  { id: 'layers', label: 'Capas' },
  { id: 'facade', label: 'Facade' },
  { id: 'simulator', label: 'Simulador' },
  { id: 'testing', label: 'Testing' },
];

export function Navigation() {
  const activeSection = useActiveSection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isLinkActive = (id: string) => {
    if (id === 'facade') return activeSection.startsWith('facade');
    return activeSection === id;
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled ? 'bg-bg-primary/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative px-3 py-1.5 text-[0.8125rem] font-medium transition-colors duration-200 ${
                isLinkActive(link.id) ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.label}
              {isLinkActive(link.id) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-px bg-accent-cyan/50"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo('diagram')}
          className="hidden lg:block text-[0.75rem] font-semibold px-5 py-2 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-violet text-bg-primary hover:shadow-glow-cyan transition-all duration-300"
        >
          Explorar Diagrama
        </button>
      </div>
    </motion.nav>
  );
}
