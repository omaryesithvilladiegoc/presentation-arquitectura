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
    title: 'Mantenibilidad',
    desc: 'La arquitectura hexagonal separa claramente la lógica de negocio de dependencias externas como frameworks, APIs o bases de datos. Esto permite realizar cambios sin afectar el núcleo de la aplicación.',
  },
  {
    icon: AlertTriangle,
    title: 'Testeabilidad',
    desc: 'Facilita probar la lógica de negocio utilizando mocks y stubs, sin necesidad de levantar bases de datos reales o depender de servicios externos.',
  },
  {
    icon: Layers,
    title: 'Facilidad para cambiar implementaciones',
    desc: 'Si una tecnología cambia, por ejemplo pasar de REST a GraphQL, solo es necesario crear un nuevo adaptador sin modificar la aplicación.',
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

      // Animate description
      gsap.from('.why-description', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Animate diagram elements
      if (diagramRef.current) {
        const tradEls =
          diagramRef.current.querySelectorAll('.trad-band');

        const hexEls =
          diagramRef.current.querySelectorAll('.hex-element');

        const tradLines =
          diagramRef.current.querySelectorAll('.trad-line');

        const hexLines =
          diagramRef.current.querySelectorAll('.hex-line');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: diagramRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        });

        // Traditional architecture
        tl.fromTo(
          tradEls,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
          }
        )
          .fromTo(
            tradLines,
            { opacity: 0 },
            { opacity: 1 },
            '<0.2'
          )

          // Hide traditional
          .to(tradLines, {
            opacity: 0,
            duration: 0.3,
          })
          .to(
            tradEls,
            {
              opacity: 0,
              y: -20,
              duration: 0.3,
            },
            '<'
          )

          // Show hexagonal
          .fromTo(
            hexEls,
            {
              opacity: 0,
              scale: 0.8,
            },
            {
              opacity: 1,
              scale: 1,
              stagger: 0.08,
            }
          )
          .fromTo(
            hexLines,
            {
              opacity: 0,
              strokeDashoffset: 30,
            },
            {
              opacity: 0.6,
              strokeDashoffset: 0,
              stagger: 0.05,
            },
            '<0.1'
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="section-padding relative overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">

          {/* Left Column */}
          <div>
            <SectionLabel text="Arquitectura Hexagonal" />

            <SectionHeading
              text="¿Qué es y por qué usarla?"
              className="mb-6"
            />

            {/* Definition */}
            <p className="why-description text-text-secondary leading-relaxed mb-8 max-w-[620px]">
             La arquitectura hexagonal nos organizar un sistema alrededor de un núcleo central llamado aplicación, donde se encuentran las reglas de negocio.
             
              Su objetivo es separar la lógica principal de elementos externos como bases de datos, APIs o frameworks, permitiendo construir aplicaciones más flexibles, mantenibles, fáciles de probar e independientes de tecnologías específicas.
              <br />
              <br />
              También es conocida como arquitectura de
              <span className="text-accent-violet font-medium">
                {' '}puertos y adaptadores
              </span>,
              ya que los puertos permiten acceder a la lógica de negocio y
              los adaptadores conectan elementos externos como APIs,
              bases de datos, interfaces gráficas o servicios externos.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {problems.map((p, i) => (
                <GlassCard
                  key={i}
                  className="why-card"
                  borderLeft="#FFB800"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-amber/10 flex items-center justify-center shrink-0">
                      <p.icon className="w-5 h-5 text-accent-amber" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-text-primary mb-1">
                        {p.title}
                      </h3>

                      <p className="text-sm text-text-secondary leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right Column - Diagram */}
          <div
            ref={diagramRef}
            className="relative aspect-square max-w-[500px] mx-auto"
          >
      

            {/* Hexagonal Architecture */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
            >
              {/* Lines */}
              <g className="hex-line" opacity="0">
                <path
                  d="M200 200 L200 100"
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                />

                <path
                  d="M200 200 L286 250"
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                />

                <path
                  d="M200 200 L114 250"
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                />

                <path
                  d="M200 100 L200 50"
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                />

                <path
                  d="M200 100 L300 80"
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                />

                <path
                  d="M200 100 L100 80"
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                />
              </g>

              {/* Domain */}
              <g className="hex-element" opacity="0">
                <polygon
                  points="200,155 243,180 243,220 200,245 157,220 157,180"
                  fill="rgba(123, 97, 255, 0.15)"
                  stroke="#7B61FF"
                  strokeWidth="1.5"
                />

                <text
                  x="200"
                  y="195"
                  textAnchor="middle"
                  fill="#F0EDE8"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Inter"
                >
                  APLICACIÓN
                </text>

                <text
                  x="200"
                  y="215"
                  textAnchor="middle"
                  fill="#7A7A8D"
                  fontSize="8"
                  fontFamily="JetBrains Mono"
                >
                  Lógica de Negocio
                </text>
              </g>

              {/* Ports */}
              {[
                { x: 200, y: 100, label: 'Puertos' },
                { x: 286, y: 250, label: 'Use Cases' },
                { x: 114, y: 250, label: 'Servicios' },
              ].map((pos, i) => (
                <g
                  key={`app-${i}`}
                  className="hex-element"
                  opacity="0"
                >
                  <polygon
                    points={`${pos.x},${pos.y - 30}
                    ${pos.x + 26},${pos.y - 15}
                    ${pos.x + 26},${pos.y + 15}
                    ${pos.x},${pos.y + 30}
                    ${pos.x - 26},${pos.y + 15}
                    ${pos.x - 26},${pos.y - 15}`}
                    fill="rgba(0, 212, 255, 0.12)"
                    stroke="#00D4FF"
                    strokeWidth="1.2"
                  />

                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="#F0EDE8"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="Inter"
                  >
                    {pos.label}
                  </text>
                </g>
              ))}

              {/* Adapters */}
              {[
                { x: 200, y: 50, label: 'REST API' },
                { x: 300, y: 80, label: 'MySQL' },
                { x: 100, y: 80, label: 'SMTP' },
                { x: 330, y: 180, label: 'GraphQL' },
                { x: 70, y: 180, label: 'Mocks' },
                { x: 200, y: 330, label: 'Frontend' },
              ].map((pos, i) => (
                <g
                  key={`adapt-${i}`}
                  className="hex-element"
                  opacity="0"
                >
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

                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="#7A7A8D"
                    fontSize="8"
                    fontFamily="Inter"
                  >
                    {pos.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}