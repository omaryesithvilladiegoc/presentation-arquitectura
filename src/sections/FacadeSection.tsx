import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Code2,
  CreditCard,
  Eye,
  Mail,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wand2,
  Workflow,
  XCircle,
} from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { CodeCard } from '@/components/CodeCard';

const subsystems = [
  { label: 'Inventory', icon: Boxes, color: '#00D4FF', x: '20%', y: '24%' },
  { label: 'Payments', icon: CreditCard, color: '#7B61FF', x: '80%', y: '24%' },
  { label: 'Shipping', icon: PackageCheck, color: '#00E5A0', x: '20%', y: '76%' },
  { label: 'Notifications', icon: Mail, color: '#FFB800', x: '80%', y: '76%' },
];

const flowSteps = [
  {
    title: 'Controller simple',
    desc: 'Recibe la peticion y delega una unica intencion de negocio.',
    icon: Eye,
  },
  {
    title: 'Facade coordina',
    desc: 'Ordena llamadas, maneja dependencias y conserva el flujo legible.',
    icon: Wand2,
  },
  {
    title: 'Subsistemas trabajan',
    desc: 'Cada servicio especializado resuelve una parte sin exponer ruido.',
    icon: Workflow,
  },
  {
    title: 'Respuesta limpia',
    desc: 'La capa externa recibe un resultado simple, no diez detalles internos.',
    icon: CheckCircle2,
  },
];

const facadeCode = `@Injectable()
export class CheckoutFacade {
  constructor(
    private readonly inventory: InventoryService,
    private readonly payments: PaymentService,
    private readonly shipping: ShippingService,
    private readonly notifications: NotificationService,
  ) {}

  async completeCheckout(command: CheckoutCommand) {
    const reservation = await this.inventory.reserve(command.items);
    const payment = await this.payments.charge(command.payment);
    const shipment = await this.shipping.create(command.address);

    await this.notifications.sendConfirmation({
      orderId: command.orderId,
      shipmentId: shipment.id,
    });

    return CheckoutResult.confirmed({
      reservationId: reservation.id,
      paymentId: payment.id,
      shipmentId: shipment.id,
    });
  }
}`;

const controllerCode = `@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkout: CheckoutFacade) {}

  @Post()
  complete(@Body() dto: CheckoutDto) {
    return this.checkout.completeCheckout(dto);
  }
}`;

const withoutFacade = [
  'Controller conoce inventario, pagos, envios y emails.',
  'El flujo de negocio queda partido entre muchas clases externas.',
  'Cada cambio de orden rompe tests y endpoints.',
  'La UI o API aprende detalles que no deberia saber.',
];

const withFacade = [
  'Controller solo expresa la intencion: completar checkout.',
  'El orden del proceso vive en una clase nombrada por negocio.',
  'Los subsistemas cambian detras de una puerta estable.',
  'Los tests verifican un flujo completo con mocks pequenos.',
];

export function FacadeSection() {
  const [activeStep, setActiveStep] = useState(0);

  const beamDelays = useMemo(() => [0, 0.25, 0.5, 0.75], []);

  return (
    <>
      <section id="facade" className="section-padding relative overflow-hidden bg-bg-primary">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(123, 97, 255, 0.12) 0%, transparent 34%), radial-gradient(circle at 70% 75%, rgba(0, 229, 160, 0.08) 0%, transparent 32%)',
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-[42%_58%] gap-12 lg:gap-16 items-center">
            <div>
              <SectionLabel text="Patron Facade" />
              <SectionHeading text="Una Puerta Simple para un Sistema Complejo" className="mb-6" />
              <p className="text-text-secondary leading-relaxed mb-8">
                Facade crea una interfaz clara delante de varios servicios. No elimina la complejidad:
                la organiza para que controllers, casos de uso o modulos externos no tengan que conocer
                cada pieza interna del proceso.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Oculta ruido', 'El consumidor ve una accion de negocio, no una coreografia tecnica.'],
                  ['Reduce acoplamiento', 'Los cambios internos quedan detras de una API estable.'],
                  ['Mejora tests', 'Pruebas el flujo como unidad y mockeas subsistemas pequenos.'],
                  ['Nombra intenciones', 'completeCheckout comunica mas que llamar cinco servicios sueltos.'],
                ].map(([title, desc], i) => (
                  <motion.div
                    key={title}
                    initial={{ y: 24, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                  >
                    <GlassCard className="h-full" hoverGlow borderLeft={i % 2 === 0 ? '#00D4FF' : '#7B61FF'}>
                      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[520px]">
              <motion.div
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative w-44 h-44 rounded-[2rem] border border-accent-cyan/35 bg-bg-secondary/80 backdrop-blur-xl flex flex-col items-center justify-center shadow-glow-cyan">
                  <motion.div
                    className="absolute inset-[-12px] rounded-[2.4rem] border border-accent-cyan/20"
                    animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <ShieldCheck className="w-10 h-10 text-accent-cyan mb-3" />
                  <span className="text-lg font-semibold text-text-primary">Facade</span>
                  <span className="text-[0.7rem] text-text-muted uppercase tracking-wider mt-1">API estable</span>
                </div>
              </motion.div>

              {subsystems.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: item.x, top: item.y }}
                  initial={{ scale: 0.75, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="w-36 h-28 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col items-center justify-center">
                    <item.icon className="w-7 h-7 mb-3" style={{ color: item.color }} />
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  </div>
                </motion.div>
              ))}

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 520">
                {[
                  ['M300 260 C210 210 170 150 120 125', '#00D4FF'],
                  ['M300 260 C390 210 430 150 480 125', '#7B61FF'],
                  ['M300 260 C210 310 170 370 120 395', '#00E5A0'],
                  ['M300 260 C390 310 430 370 480 395', '#FFB800'],
                ].map(([d, color], i) => (
                  <g key={d}>
                    <path d={d} stroke={color} strokeWidth="1.5" fill="none" opacity="0.28" strokeDasharray="8 8" />
                    <motion.circle
                      r="4"
                      fill={color}
                      filter="drop-shadow(0 0 8px currentColor)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: beamDelays[i] }}
                    >
                      <animateMotion dur="2s" repeatCount="indefinite" begin={`${beamDelays[i]}s`} path={d} />
                    </motion.circle>
                  </g>
                ))}
              </svg>

              <motion.div
                className="absolute left-1/2 top-8 -translate-x-1/2 glass-card px-5 py-3 flex items-center gap-3"
                initial={{ opacity: 0, y: -16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Sparkles className="w-4 h-4 text-accent-amber" />
                <span className="text-sm text-text-secondary">Un metodo publico, varios subsistemas protegidos</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="facade-flow" className="section-padding relative overflow-hidden" style={{ background: '#0E0E18' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <SectionLabel text="Flujo del Facade" />
            <SectionHeading text="Del Caos a una Orquestacion Clara" className="mb-4" />
            <p className="text-text-secondary max-w-2xl mx-auto">
              Un Facade es especialmente util cuando una accion de negocio necesita coordinar varios pasos,
              pero quieres que el borde de la app siga siendo simple.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch mb-14">
            <GlassCard borderLeft="#FFB800">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-5 h-5 text-accent-amber" />
                <h3 className="text-lg font-semibold text-text-primary">Sin Facade</h3>
              </div>
              <div className="space-y-3">
                {withoutFacade.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex gap-3 text-sm text-text-secondary"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-amber shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                animate={{ x: [-6, 6, -6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full border border-accent-cyan/25 bg-accent-cyan/10 flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6 text-accent-cyan" />
              </motion.div>
            </div>

            <GlassCard borderLeft="#00E5A0">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
                <h3 className="text-lg font-semibold text-text-primary">Con Facade</h3>
              </div>
              <div className="space-y-3">
                {withFacade.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex gap-3 text-sm text-text-secondary"
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-emerald shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="relative">
            <div className="absolute left-4 right-4 top-8 hidden lg:block h-px bg-gradient-to-r from-accent-cyan/10 via-accent-violet/70 to-accent-emerald/10" />
            <div className="grid lg:grid-cols-4 gap-4">
              {flowSteps.map((step, i) => (
                <motion.button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  onMouseEnter={() => setActiveStep(i)}
                  className={`relative text-left rounded-xl border p-5 transition-all duration-300 ${
                    activeStep === i
                      ? 'border-accent-cyan/50 bg-accent-cyan/[0.08] shadow-glow-cyan'
                      : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16]'
                  }`}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-bg-primary border border-white/10 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <span className="text-[0.65rem] font-mono text-text-muted">0{i + 1}</span>
                  <h3 className="text-base font-semibold text-text-primary mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="facade-code" className="section-padding relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(123,97,255,0.025) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center mb-16">
            <SectionLabel text="NestJS Facade" />
            <SectionHeading text="Como se ve en Codigo" className="mb-4" />
            <p className="text-text-secondary max-w-2xl mx-auto">
              En NestJS, un Facade suele ser un provider inyectable. El controller llama una accion
              expresiva y el Facade coordina servicios especializados.
            </p>
          </div>

          <div className="grid lg:grid-cols-[38%_62%] gap-6 items-start">
            <motion.div
              initial={{ x: -32, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
            >
              <CodeCard filename="checkout.controller.ts" badge="Entrada" badgeColor="#FFB800" code={controllerCode} />
            </motion.div>

            <motion.div
              initial={{ x: 32, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.12 }}
            >
              <CodeCard filename="checkout.facade.ts" badge="Facade" badgeColor="#00D4FF" code={facadeCode} />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {[
              ['Cuando usarlo', 'Cuando un flujo llama varios servicios y quieres una API de negocio clara.'],
              ['Donde ponerlo', 'En la capa de aplicacion si orquesta casos de uso o servicios internos.'],
              ['Que evitar', 'No lo conviertas en una clase gigante: si crece demasiado, separa flujos.'],
            ].map(([title, desc], i) => (
              <motion.div
                key={title}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard className="h-full" borderLeft={i === 2 ? '#FFB800' : '#00E5A0'}>
                  <div className="flex items-center gap-3 mb-3">
                    <Code2 className="w-5 h-5 text-accent-cyan" />
                    <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
