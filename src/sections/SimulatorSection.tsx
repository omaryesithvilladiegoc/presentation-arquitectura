import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { Globe, Server, Workflow, Plug, Cpu, Database, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const steps = [
  {
    title: 'Cliente envia HTTP POST',
    desc: 'Un cliente (Postman, navegador, frontend) envia un POST /orders con los datos del pedido.',
    code: `POST /api/orders\nContent-Type: application/json\n\n{ "items": [{ "product": "T-Shirt", "qty": 2 }] }`,
  },
  {
    title: 'Controller recibe y valida',
    desc: 'El Controller de NestJS recibe la peticion, valida el DTO con class-validator y extrae los datos.',
    code: `@Post()\nasync create(\n  @Body() dto: CreateOrderDto\n) { /* delega */ }`,
  },
  {
    title: 'Use Case ejecuta logica',
    desc: 'El caso de uso recibe el comando, aplica reglas de negocio y decide que puertos invocar.',
    code: `const order = Order.create(dto.items);\nawait this.payment.process(order.total());\norder.confirm();`,
  },
  {
    title: 'Port define la interfaz',
    desc: 'El puerto es solo una interfaz TypeScript. El dominio dice "necesito esto" sin saber como se implementa.',
    code: `interface OrderRepositoryPort {\n  save(order: Order): Promise<void>;\n  findById(id: string): Promise<Order | null>;\n}`,
  },
  {
    title: 'Adapter implementa concreto',
    desc: 'El adaptador concreto (Postgres, Mongo, Mock) implementa la interfaz del puerto.',
    code: `class PostgresOrderRepo\n  implements OrderRepositoryPort {\n  async save(order: Order) {\n    await this.repo.save(order);\n  }\n}`,
  },
  {
    title: 'Base de datos persiste',
    desc: 'Los datos se guardan en PostgreSQL. El dominio nunca supo que usamos SQL!',
    code: `await this.dataSource.transaction(\n  async (manager) => {\n    await manager.save(entity);\n  }\n);`,
  },
];

const nodes = [
  { icon: Globe, label: 'Cliente HTTP', x: 5, y: 25 },
  { icon: Server, label: 'Controller', x: 22, y: 50 },
  { icon: Workflow, label: 'Use Case', x: 42, y: 25 },
  { icon: Plug, label: 'Port', x: 60, y: 50 },
  { icon: Cpu, label: 'Adapter', x: 78, y: 25 },
  { icon: Database, label: 'Base de Datos', x: 92, y: 50 },
];

export function SimulatorSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= steps.length - 1) {
        setIsReturning(true);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setIsReturning(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsReturning(false);
    setIsAutoPlaying(false);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsReturning(true);
            setTimeout(() => {
              setCurrentStep(0);
              setIsReturning(false);
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAutoPlaying]);

  const getNodeState = (index: number) => {
    if (isReturning) {
      if (index <= currentStep && index >= 0) return 'completed';
      return 'inactive';
    }
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <section id="simulator" className="section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 60%)',
        }}
      />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="text-center mb-12">
          <SectionLabel text="Simulador Interactivo" />
          <SectionHeading text="Sigue el Viaje de un Request" className="mb-4" />
          <p className="text-text-secondary max-w-xl mx-auto">
            Observa como un request HTTP viaja a traves de cada capa de la arquitectura hexagonal.
          </p>
        </div>

        {/* Node Diagram */}
        <div className="relative h-[200px] mb-8 overflow-hidden">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {nodes.slice(0, -1).map((_, i) => {
              const curr = nodes[i];
              const next = nodes[i + 1];
              const isActive = i < currentStep || (i === currentStep && !isReturning);
              const isCurrent = i === currentStep;
              return (
                <line
                  key={i}
                  x1={curr.x}
                  y1={curr.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={isActive ? '#00D4FF' : 'rgba(255,255,255,0.06)'}
                  strokeWidth={isCurrent ? 1.5 : 0.8}
                  opacity={isActive ? 0.6 : 0.15}
                  strokeDasharray={isCurrent ? '10 5' : 'none'}
                  className={isCurrent ? 'animate-flow-dash' : ''}
                />
              );
            })}
            {/* Data packet */}
            {currentStep < steps.length && (
              <motion.circle
                r="2"
                fill="#00D4FF"
                filter="drop-shadow(0 0 4px rgba(0,212,255,0.6))"
                animate={{
                  cx: nodes[currentStep]?.x,
                  cy: nodes[currentStep]?.y,
                }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const state = getNodeState(i);
            return (
              <motion.div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => { setCurrentStep(i); setIsReturning(false); }}
                whileHover={{ scale: 1.1 }}
                animate={{
                  scale: state === 'active' ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                  style={{
                    background: state === 'active' ? 'rgba(0, 212, 255, 0.12)' : state === 'completed' ? 'rgba(0, 229, 160, 0.08)' : 'rgba(255,255,255,0.03)',
                    borderColor: state === 'active' ? '#00D4FF' : state === 'completed' ? '#00E5A0' : 'rgba(255,255,255,0.08)',
                    boxShadow: state === 'active' ? '0 0 20px rgba(0, 212, 255, 0.3)' : 'none',
                  }}
                >
                  <node.icon className="w-6 h-6" style={{ color: state === 'active' ? '#00D4FF' : state === 'completed' ? '#00E5A0' : '#4A4A5C' }} />
                </div>
                <span className="text-[0.65rem] mt-2 text-text-muted whitespace-nowrap">{node.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Step Explanation Panel */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block text-[0.65rem] font-semibold uppercase tracking-wider text-accent-cyan px-3 py-1 rounded-full border border-accent-cyan/15 bg-accent-cyan/[0.06]">
              Paso {currentStep + 1}/{steps.length}
            </span>
            {isAutoPlaying && (
              <span className="text-xs text-accent-emerald animate-pulse">Reproduciendo...</span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">{steps[currentStep].title}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{steps[currentStep].desc}</p>
              <div className="rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <pre className="font-mono text-[0.75rem] text-accent-cyan/80 whitespace-pre-wrap">{steps[currentStep].code}</pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/[0.08] text-text-primary hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button
            onClick={currentStep >= steps.length - 1 ? reset : nextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-accent-cyan to-accent-violet text-bg-primary hover:shadow-glow-cyan transition-all"
          >
            {currentStep >= steps.length - 1 ? (
              <><RotateCcw className="w-4 h-4" /> Reiniciar</>
            ) : (
              <>Siguiente <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/[0.08] text-text-primary hover:bg-white/5 transition-all"
          >
            {isAutoPlaying ? <><Pause className="w-4 h-4" /> Pausa</> : <><Play className="w-4 h-4" /> Auto-Play</>}
          </button>
        </div>
      </div>
    </section>
  );
}
