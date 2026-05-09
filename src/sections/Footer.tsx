import { motion } from 'framer-motion';
import { LuminousDivider } from '@/components/LuminousDivider';

const linkGroups = [
  {
    title: 'Aprender',
    links: ['Que es?', 'Diagrama', 'Capas', 'Simulador'],
  },
  {
    title: 'Recursos',
    links: ['Documentacion', 'Ejemplos NestJS', 'Testing', 'Patrones'],
  },
  {
    title: 'Comunidad',
    links: ['GitHub', 'Discord', 'Issues', 'Contribuir'],
  },
];

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative pt-20 pb-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ filter: 'blur(100px)', opacity: 0.06 }}
        animate={{ x: [-50, 50, -50] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, #7B61FF 0%, #00D4FF 50%, transparent 70%)',
          }}
        />
      </motion.div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <motion.h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight max-w-[700px] mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Domina la Arquitectura Hexagonal
          </motion.h2>
          <motion.p
            className="mt-4 text-text-secondary max-w-[500px] mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Construye aplicaciones que perduran. Codigo que escala. Sistemas que respiran.
          </motion.p>
          <motion.button
            onClick={() => scrollTo('diagram')}
            className="mt-8 px-8 py-3.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-accent-cyan to-accent-violet text-bg-primary hover:shadow-glow-cyan transition-all inline-flex items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Explorar Ahora
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.button>
        </div>

        <LuminousDivider className="mb-10" />

        {/* Footer Links */}
        <div className="grid sm:grid-cols-3 gap-8 mb-12">
          {linkGroups.map(group => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map(link => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === 'Que es?') scrollTo('why');
                        else if (link === 'Diagrama') scrollTo('diagram');
                        else if (link === 'Capas') scrollTo('layers');
                        else if (link === 'Simulador') scrollTo('simulator');
                        else scrollTo('hero');
                      }}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-text-muted">
            &copy; 2025 Hexagonal.dev — Aprende arquitectura de software
          </p>
        </div>
      </div>
    </footer>
  );
}
