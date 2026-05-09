import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { label: 'Acoplamiento', trad: 85, hex: 15 },
  { label: 'Testabilidad', trad: 20, hex: 95 },
  { label: 'Mantenibilidad', trad: 30, hex: 90 },
  { label: 'Flexibilidad', trad: 25, hex: 95 },
];

const comparisons = [
  { problem: 'Cambiar DB = refactorizar toda la app', solution: 'Cambia solo el adaptador. El dominio ni se entera.' },
  { problem: 'Tests necesitan base de datos real', solution: 'Mockea los puertos. Tests puros y rapidos.' },
  { problem: 'Logica de negocio mezclada con HTTP', solution: 'Controller solo traduce. Logica pura en el dominio.' },
  { problem: 'Dependencias circulares ocultas', solution: 'Dependencias explicitas y unidireccionales.' },
];

export function ComparisonSection() {
  const [activeView, setActiveView] = useState<'both' | 'traditional' | 'hexagonal'>('both');
  const sectionRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!metricsRef.current) return;
      const bars = metricsRef.current.querySelectorAll('.metric-bar');

      gsap.from(bars, {
        scrollTrigger: {
          trigger: metricsRef.current,
          start: 'top 80%',
        },
        width: '0%',
        duration: 1,
        ease: 'power2.out',
        stagger: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="comparison" className="section-padding relative overflow-hidden" style={{ background: '#0E0E18' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <SectionLabel text="Comparacion" />
          <SectionHeading text="Antes vs Despues" className="mb-4" />
          <p className="text-text-secondary max-w-xl mx-auto">
            Compara la arquitectura tradicional con la arquitectura hexagonal en terminos concretos.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1 flex">
            {[
              { key: 'both' as const, label: 'Ambas' },
              { key: 'traditional' as const, label: 'Tradicional' },
              { key: 'hexagonal' as const, label: 'Hexagonal' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setActiveView(opt.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeView === opt.key
                    ? 'bg-accent-cyan/[0.12] text-accent-cyan'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Architecture Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Traditional */}
          <motion.div
            animate={{
              opacity: activeView === 'hexagonal' ? 0.3 : 1,
              filter: activeView === 'hexagonal' ? 'grayscale(0.5)' : 'grayscale(0)',
            }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="border-l-2" borderLeft="#FFB800">
              <h3 className="text-lg font-semibold text-accent-amber mb-1">Arquitectura Tradicional</h3>
              <p className="text-sm text-text-secondary mb-6">Capas acopladas, dependencias fragiles</p>

              <div className="space-y-3 mb-4">
                {['UI', 'Controller', 'Service', 'Repository', 'Base de Datos'].map((layer, i) => (
                  <div key={i} className="relative">
                    <div
                      className="h-10 rounded-lg flex items-center px-4 text-sm font-medium border"
                      style={{
                        background: `rgba(255, 59, 48, ${0.06 + i * 0.02})`,
                        borderColor: `rgba(255, 59, 48, ${0.15 + i * 0.05})`,
                        color: '#7A7A8D',
                      }}
                    >
                      {layer}
                    </div>
                    {i < 4 && (
                      <div className="flex justify-center py-1">
                        <svg width="20" height="16" viewBox="0 0 20 16">
                          <path d="M10 0 L10 12 M4 8 L10 14 L16 8" stroke="#FF4444" strokeWidth="1.5" fill="none" opacity="0.4" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-accent-amber/70">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium">ACOPLAMIENTO ALTO</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Hexagonal */}
          <motion.div
            animate={{
              opacity: activeView === 'traditional' ? 0.3 : 1,
              filter: activeView === 'traditional' ? 'grayscale(0.5)' : 'grayscale(0)',
            }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="border-l-2" borderLeft="#00E5A0">
              <h3 className="text-lg font-semibold text-accent-emerald mb-1">Arquitectura Hexagonal</h3>
              <p className="text-sm text-text-secondary mb-6">Desacoplada, testeable, flexible</p>

              <div className="flex flex-col items-center space-y-2 mb-4">
                {/* Center - Domain */}
                <div
                  className="w-40 h-14 rounded-xl flex items-center justify-center text-sm font-semibold border"
                  style={{ background: 'rgba(123, 97, 255, 0.15)', borderColor: '#7B61FF', color: '#F0EDE8' }}
                >
                  Dominio
                </div>

                {/* Ports ring */}
                <div className="flex gap-3">
                  {['Use Cases', 'Ports', 'App Services'].map((label) => (
                    <div
                      key={label}
                      className="px-4 py-2 rounded-lg text-xs font-medium border"
                      style={{ background: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.25)', color: '#00D4FF' }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Adapters ring */}
                <div className="flex flex-wrap justify-center gap-2">
                  {['Controller', 'DB', 'SMTP', 'API', 'Queue'].map((label) => (
                    <div
                      key={label}
                      className="px-3 py-1.5 rounded-md text-[0.65rem] font-medium border"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#7A7A8D' }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-accent-emerald/70">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">DESACOPLADO</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Metrics */}
        <div ref={metricsRef} className="mb-12">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6 text-center">Metricas Comparativas</h3>
          <div className="space-y-4 max-w-[600px] mx-auto">
            {metrics.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-text-secondary">{m.label}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-xs text-text-muted w-12 text-right">Trad</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="metric-bar h-full rounded-full"
                      style={{
                        width: `${m.trad}%`,
                        background: 'linear-gradient(90deg, #FF4444, #FFB800)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-text-muted w-10">{m.trad}%</span>
                </div>
                <div className="flex gap-3 items-center mt-1">
                  <span className="text-xs text-text-muted w-12 text-right">Hex</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="metric-bar h-full rounded-full"
                      style={{
                        width: `${m.hex}%`,
                        background: 'linear-gradient(90deg, #00D4FF, #00E5A0)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-text-muted w-10">{m.hex}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Differences */}
        <div className="grid sm:grid-cols-2 gap-4">
          {comparisons.map((c, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-0">
              <GlassCard className="rounded-r-none border-r-0" borderLeft="#FFB800">
                <p className="text-sm text-text-secondary">{c.problem}</p>
              </GlassCard>
              <GlassCard className="rounded-l-none" borderLeft="#00E5A0">
                <p className="text-sm text-text-secondary">{c.solution}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
