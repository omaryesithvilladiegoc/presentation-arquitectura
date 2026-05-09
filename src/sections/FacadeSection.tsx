import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Code2,
  Eye,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wand2,
  Workflow,
  XCircle,
} from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { CodeCard } from '@/components/CodeCard';

const subsystems = [
  { label: 'Pacientes', icon: ClipboardCheck, color: '#00D4FF', x: '20%', y: '24%' },
  { label: 'Agenda Medica', icon: CalendarDays, color: '#7B61FF', x: '80%', y: '24%' },
  { label: 'Especialistas', icon: Stethoscope, color: '#00E5A0', x: '20%', y: '76%' },
  { label: 'Notificaciones', icon: Bell, color: '#FFB800', x: '80%', y: '76%' },
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
export class AppointmentRequestFacade {
  constructor(
    private readonly patients: PatientService,
    private readonly doctors: DoctorDirectoryService,
    private readonly schedule: MedicalScheduleService,
    private readonly notifications: NotificationService,
  ) {}

  async requestAppointment(command: RequestAppointmentCommand) {
    const patient = await this.patients.verifyActivePatient(
      command.patientId
    );
    const doctor = await this.doctors.findAvailableDoctor({
      specialtyId: command.specialtyId,
      preferredDate: command.preferredDate,
    });
    const appointment = await this.schedule.reserveSlot({
      patientId: patient.id,
      doctorId: doctor.id,
      reason: command.reason,
      preferredDate: command.preferredDate,
    });

    await this.notifications.sendAppointmentRequested({
      patientEmail: patient.email,
      doctorName: doctor.fullName,
      appointmentDate: appointment.date,
    });

    return AppointmentRequestResult.pendingConfirmation({
      appointmentId: appointment.id,
      doctorId: doctor.id,
      status: appointment.status,
    });
  }
}`;

const controllerCode = `@Controller('appointments')
export class AppointmentRequestController {
  constructor(
    private readonly facade: AppointmentRequestFacade
  ) {}

  @Post()
  request(@Body() dto: RequestAppointmentDto) {
    return this.facade.requestAppointment(dto);
  }
}`;

const withoutFacade = [
  'Controller conoce pacientes, agenda, doctores y notificaciones.',
  'La solicitud de cita queda repartida entre demasiadas clases externas.',
  'Cambiar la regla de disponibilidad rompe tests y endpoints.',
  'La API aprende detalles clinicos y operativos que no deberia saber.',
];

const withFacade = [
  'Controller solo expresa la intencion: solicitar una cita medica.',
  'El flujo vive en una clase nombrada por negocio.',
  'Agenda, pacientes y notificaciones cambian detras de una puerta estable.',
  'Los tests verifican la solicitud completa con mocks pequenos.',
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
             
              <SectionHeading text="Patrón Facade" className="mb-6" />
              <p className="text-text-secondary leading-relaxed mb-8">
                Facade crea una interfaz clara delante de varios servicios. En una solicitud de cita medica,
                organiza la validacion del paciente, la busqueda de especialista, la reserva de horario y
                la notificacion sin cargar esa complejidad en el controller.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
  [
    'Separacion de responsabilidades',
    'Cada parte del sistema tiene una responsabilidad bien definida dentro de la aplicacion.',
  ],
  [
    'Flexibilidad',
    'Puedes cambiar tecnologias externas sin afectar las reglas de negocio.',
  ],
  [
    'Testeabilidad',
    'La logica de negocio puede probarse de forma aislada usando mocks y stubs.',
  ],
  [
    'Aplicacion central',
    'Toda la arquitectura gira alrededor de una aplicacion que contiene las reglas de negocio.',
  ],
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
                  <span className="text-sm text-text-secondary">Una solicitud publica, varios subsistemas protegidos</span>
              </motion.div>
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
            <SectionHeading text="Ejemplo" className="mb-4" />
            <p className="text-text-secondary max-w-2xl mx-auto">
              En NestJS, un Facade suele ser un provider inyectable. El controller llama una accion
              expresiva y el Facade coordina los servicios de agenda medica.
            </p>
          </div>

          <div className="grid lg:grid-cols-[38%_62%] gap-6 items-start">
            <motion.div
              initial={{ x: -32, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
            >
              <CodeCard filename="appointment-request.controller.ts" badge="Entrada" badgeColor="#FFB800" code={controllerCode} />
            </motion.div>

            <motion.div
              initial={{ x: 32, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.12 }}
            >
              <CodeCard filename="appointment-request.facade.ts" badge="Facade" badgeColor="#00D4FF" code={facadeCode} />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {[
              ['Cuando usarlo', 'Cuando solicitar una cita llama varios servicios y quieres una API de negocio clara.'],
              ['Donde ponerlo', 'En la capa de aplicacion si orquesta agenda, pacientes y notificaciones.'],
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

        {/* Ventajas y Desventajas */}
<section
  id="facade-pros-cons"
  className="section-padding relative overflow-hidden"
>
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        'radial-gradient(circle at 20% 20%, rgba(0,212,255,0.08) 0%, transparent 30%), radial-gradient(circle at 80% 80%, rgba(255,184,0,0.08) 0%, transparent 30%)',
    }}
  />

  <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
    <div className="text-center mb-14">
      <SectionLabel text="Analisis" />

      <SectionHeading
        text="Ventajas y Desventajas"
        className="mb-4"
      />

      <p className="text-text-secondary max-w-2xl mx-auto">
        El patron Facade simplifica la comunicacion con multiples servicios,
        pero tambien requiere una buena organizacion para evitar convertirlo
        en una clase demasiado grande.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">

      {/* Ventajas */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          className="h-full"
          borderLeft="#00E5A0"
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-accent-emerald" />

            <h3 className="text-xl font-semibold text-text-primary">
              Ventajas
            </h3>
          </div>

          <div className="space-y-4">
            {[
              'Simplifica la comunicacion entre controllers y subsistemas.',
              'Centraliza el flujo de negocio en una sola clase.',
              'Facilita las pruebas usando mocks pequenos.',
              'Permite cambiar implementaciones internas sin afectar el exterior.',
              'Mantiene el controller limpio y enfocado en recibir peticiones.',
            ].map((item, i) => (
              <motion.div
                key={item}
                className="flex gap-3 text-sm text-text-secondary"
                initial={{ y: 12, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="mt-1 w-2 h-2 rounded-full bg-accent-emerald shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Desventajas */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          className="h-full"
          borderLeft="#FFB800"
        >
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-6 h-6 text-accent-amber" />

            <h3 className="text-xl font-semibold text-text-primary">
              Desventajas
            </h3>
          </div>

          <div className="space-y-4">
            {[
              'Puede crecer demasiado si concentra demasiadas responsabilidades.',
              'Agregar demasiada logica rompe la claridad del flujo.',
              'Un mal diseño puede convertir el Facade en una clase dificil de mantener.',
              'Requiere una buena separacion de servicios internos.',
              'En proyectos pequenos puede agregar complejidad innecesaria.',
            ].map((item, i) => (
              <motion.div
                key={item}
                className="flex gap-3 text-sm text-text-secondary"
                initial={{ y: 12, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="mt-1 w-2 h-2 rounded-full bg-accent-amber shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  </div>
</section>
      </section>
    </>
  );
}
