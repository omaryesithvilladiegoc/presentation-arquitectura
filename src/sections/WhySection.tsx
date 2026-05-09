import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { Link2, AlertTriangle, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: Link2,
    title: 'Alto Acoplamiento',
    desc: 'Capas superiores dependen directamente de implementaciones concretas. Cambiar una base de datos requiere reescribir código en múltiples lugares.',
  },
  {
    icon: AlertTriangle,
    title: 'Tests Imposibles',
    desc: 'No puedes testear tu lógica de negocio sin levantar una base de datos real, conectar a servicios externos o mockear frameworks enteros.',
  },
  {
    icon: Layers,
    title: 'Código Frágil',
    desc: 'Un cambio en infraestructura — SMTP, API externa, cola de mensajes — provoca cascada de errores en toda la aplicación.',
  },
];

export function WhySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards
      gsap.from('.why-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Animate diagram elements
      if (diagramRef.current) {
        const tradEls = diagramRef.current.querySelectorAll('.trad-band');
        const hexEls = diagramRef.current.querySelectorAll('.hex-element');
        const tradLines = diagramRef.current.querySelectorAll('.trad-line');
        const hexLines = diagramRef.current.querySelectorAll('.hex-line');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: diagramRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        });

        // Phase 1: Traditional visible
        tl.fromTo(tradEls, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 })
          .fromTo(tradLines, { opacity: 0 }, { opacity: 1 }, '<0.2')
          // Phase 2: Break apart
          .to(tradLines, { opacity: 0, duration: 0.3 })
          .to(tradEls, { opacity: 0, y: -20, duration: 0.3 }, '<')
          // Phase 3: Hexagonal appears
          .fromTo(hexEls, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.08 })
          .fromTo(hexLines, { opacity: 0, strokeDashoffset: 30 }, { opacity: 0.6, strokeDashoffset: 0, stagger: 0.05 }, '<0.1');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why" className="section-padding relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">
          {/* Left Column - Text + Cards */}
          <div>
            <SectionLabel text="El Problema" />
            <SectionHeading text="¿Por qué Arquitectura Hexagonal?" className="mb-10" />

            <div className="space-y-4">
              {problems.map((p, i) => (
                <GlassCard key={i} className="why-card" borderLeft="#FFB800">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-amber/10 flex items-center justify-center shrink-0">
                      <p.icon className="w-5 h-5 text-accent-amber" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-primary mb-1">{p.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right Column - Animated Diagram */}
          <div ref={diagramRef} className="relative aspect-square max-w-[500px] mx-auto">
            {/* Traditional Architecture - Bands */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {['Frontend', 'Controller', 'Service', 'Repository', 'Base de Datos'].map((label, i) => (
                <div
                  key={`trad-${i}`}
                  className="trad-band w-64 h-12 rounded-lg flex items-center justify-center text-sm font-medium border"
                  style={{
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderColor: 'rgba(0, 212, 255, 0.2)',
                    color: '#7A7A8D',
                  }}
                >
                  {label}
                </div>
              ))}
              <div className="trad-line absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[0.7rem] font-semibold tracking-wider text-accent-amber bg-bg-primary px-3 py-1 rounded">
                  ACOPLAMIENTO ALTO
                </span>
              </div>
            </div>

            {/* Hexagonal Architecture */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              {/* Connection lines */}
              <g className="hex-line" opacity="0">
                <path d="M200 200 L200 100" stroke="#00D4FF" strokeWidth="1" fill="none" strokeDasharray="8 4" />
                <path d="M200 200 L286 250" stroke="#00D4FF" strokeWidth="1" fill="none" strokeDasharray="8 4" />
                <path d="M200 200 L114 250" stroke="#00D4FF" strokeWidth="1" fill="none" strokeDasharray="8 4" />
                <path d="M200 100 L200 50" stroke="#00D4FF" strokeWidth="1" fill="none" strokeDasharray="8 4" />
                <path d="M200 100 L300 80" stroke="#00D4FF" strokeWidth="1" fill="none" strokeDasharray="8 4" />
                <path d="M200 100 L100 80" stroke="#00D4FF" strokeWidth="1" fill="none" strokeDasharray="8 4" />
              </g>

              {/* Center hexagon - Domain */}
              <g className="hex-element" opacity="0">
                <polygon
                  points="200,155 243,180 243,220 200,245 157,220 157,180"
                  fill="rgba(123, 97, 255, 0.15)"
                  stroke="#7B61FF"
                  strokeWidth="1.5"
                />
                <text x="200" y="195" textAnchor="middle" fill="#F0EDE8" fontSize="13" fontWeight="700" fontFamily="Inter">DOMINIO</text>
                <text x="200" y="215" textAnchor="middle" fill="#7A7A8D" fontSize="8" fontFamily="JetBrains Mono">Entities, Value Objects</text>
              </g>

              {/* Application ring - Ports */}
              {[
                { x: 200, y: 100, label: 'Use Cases' },
                { x: 286, y: 250, label: 'Ports' },
                { x: 114, y: 250, label: 'App Services' },
              ].map((pos, i) => (
                <g key={`app-${i}`} className="hex-element" opacity="0">
                  <polygon
                    points={`${pos.x},${pos.y - 30} ${pos.x + 26},${pos.y - 15} ${pos.x + 26},${pos.y + 15} ${pos.x},${pos.y + 30} ${pos.x - 26},${pos.y + 15} ${pos.x - 26},${pos.y - 15}`}
                    fill="rgba(0, 212, 255, 0.12)"
                    stroke="#00D4FF"
                    strokeWidth="1.2"
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#F0EDE8" fontSize="9" fontWeight="600" fontFamily="Inter">{pos.label}</text>
                </g>
              ))}

              {/* Outer adapters */}
              {[
                { x: 200, y: 50, label: 'Controller' },
                { x: 300, y: 80, label: 'DB Adapter' },
                { x: 100, y: 80, label: 'SMTP' },
                { x: 330, y: 180, label: 'API REST' },
                { x: 70, y: 180, label: 'Queue' },
                { x: 200, y: 330, label: 'WebSocket' },
              ].map((pos, i) => (
                <g key={`adapt-${i}`} className="hex-element" opacity="0">
                  <rect
                    x={pos.x - 40}
                    y={pos.y - 18}
                    width="80"
                    height="36"
                    rx="6"
                    fill="rgba(255,255,255,0.03)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#7A7A8D" fontSize="8" fontFamily="Inter">{pos.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
