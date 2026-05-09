import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HexagonScene } from '@/components/HexagonScene';
import { TagPill } from '@/components/TagPill';

const titleWords = ['Arquitectura', 'Hexagonal'];
const subtitleWords = ['y', 'Patrón', 'Facade'];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height * 0.8))
      );

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >

      {/* Ambient gradient overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 30%, #08080F 75%), radial-gradient(ellipse at 50% 70%, rgba(0, 212, 255, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{
          opacity: 1 - scrollProgress,
          transform: `scale(${1 - scrollProgress * 0.05})`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <TagPill text="Arquitectura de Software" />
        </motion.div>

        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.03em] text-text-primary">
          <span className="block">
            {titleWords.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.25em]"
                initial={{
                  clipPath: 'inset(100% 0 0 0)',
                  y: 30,
                  opacity: 0,
                }}
                animate={{
                  clipPath: 'inset(0% 0 0 0)',
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.4 + i * 0.08,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>

          <motion.span
            className="block mt-2"
            initial={{
              clipPath: 'inset(100% 0 0 0)',
              y: 30,
              opacity: 0,
            }}
            animate={{
              clipPath: 'inset(0% 0 0 0)',
              y: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.6,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {subtitleWords.map((word) => (
              <span
                key={word}
                className="inline-block mr-[0.25em] bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-transparent"
              >
                {word}
              </span>
            ))}
          </motion.span>
        </h1>

        <motion.div
          className="mt-8 text-lg leading-relaxed space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>
            Omar Villadiego • David Hernandez
          </p>

          <p>
            Clase de Arquitectura de Software
          </p>

          <p>
            Profesor Andres Marin
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <button
            onClick={() => scrollToSection('diagram')}
            className="px-8 py-3.5 rounded-lg text-[0.875rem] font-semibold bg-gradient-to-r from-accent-cyan to-accent-violet text-bg-primary hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-300"
          >
            Explorar Arquitectura
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="relative w-px h-10 bg-text-muted/30">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-cyan"
            animate={{ y: [0, 40] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}