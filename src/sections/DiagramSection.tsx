import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { X } from 'lucide-react';
import { SyntaxHighlighter } from '@/components/SyntaxHighlighter';

interface HotspotInfo {
  title: string;
  description: string;
  code: string;
  dependencies: string[];
}

const hotspotData: Record<string, HotspotInfo> = {
  domain: {
    title: 'Dominio (Domain)',
    description: 'El corazón de tu aplicación. Contiene la lógica de negocio pura, entidades, value objects y reglas. NO depende de NINGUNA capa externa.',
    code: `export class AppointmentRequest {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly specialtyId: string,
    private readonly preferredDate: Date
  ) {}

  canBeScheduled(now: Date): boolean {
    return this.preferredDate > now;
  }
}`,
    dependencies: ['Ninguna — es el centro'],
  },
  usecases: {
    title: 'Caso de Uso (Application)',
    description: 'Orquesta la lógica de negocio. Coordina el flujo de datos entre el dominio y los puertos. No conoce implementaciones concretas — solo interfaces.',
    code: `@Injectable()
export class RequestAppointmentUseCase {
  constructor(
    private appointmentRepo: AppointmentRepositoryPort,
    private schedule: DoctorSchedulePort,
    private events: EventPublisherPort
  ) {}

  async execute(cmd: RequestAppointmentCmd) {
    const request = AppointmentRequest.create(cmd);
    const slot = await this.schedule.findAvailableSlot(
      cmd.specialtyId,
      cmd.preferredDate
    );
    request.markAsScheduled(slot);
    await this.appointmentRepo.save(request);
    this.events.publish(new AppointmentRequestedEvent(request));
    return request;
  }
}`,
    dependencies: ['Domain (entidades)', 'Ports (interfaces)'],
  },
  ports: {
    title: 'Puerto (Port)',
    description: 'Define un contrato. Es una interfaz TypeScript que declara qué necesita el dominio, sin especificar cómo se implementa.',
    code: `export interface AppointmentRepositoryPort {
  save(request: AppointmentRequest): Promise<void>;
  findById(id: string): Promise<AppointmentRequest | null>;
  findByPatient(patientId: string): Promise<AppointmentRequest[]>;
}

export interface DoctorSchedulePort {
  findAvailableSlot(
    specialtyId: string,
    preferredDate: Date
  ): Promise<DoctorSlot>;
}

export interface EventPublisherPort {
  publish(event: DomainEvent): void;
}`,
    dependencies: ['Domain (tipos)'],
  },
  controller: {
    title: 'Controller (Interface)',
    description: 'Punto de entrada HTTP. Recibe requests, valida DTOs y delega al caso de uso. No contiene lógica de negocio.',
    code: `@Controller('appointments')
export class AppointmentController {
  constructor(
    private requestAppointment: RequestAppointmentUseCase
  ) {}

  @Post()
  async request(
    @Body() dto: RequestAppointmentDto
  ): Promise<AppointmentResponse> {
    const appointment = await this.requestAppointment.execute(dto);
    return AppointmentResponse.from(appointment);
  }
}`,
    dependencies: ['Application (Use Cases)', 'Domain (tipos)'],
  },
  dbadapter: {
    title: 'Adaptador DB (Infrastructure)',
    description: 'Implementa un Puerto con tecnología concreta. Puede cambiar sin afectar al dominio. El dominio ni se entera.',
    code: `@Injectable()
export class PostgresAppointmentRepository
  implements AppointmentRepositoryPort {
  
  constructor(
    @InjectRepository(AppointmentEntity)
    private repo: Repository<AppointmentEntity>
  ) {}

  async save(request: AppointmentRequest): Promise<void> {
    const entity = this.toEntity(request);
    await this.repo.save(entity);
  }

  // Cambiar a MongoDB = nuevo adaptador
}`,
    dependencies: ['Ports (interfaces)', 'Domain (entidades)'],
  },
  smtp: {
    title: 'Adaptador Email (Infrastructure)',
    description: 'Implementa el servicio de notificación usando SMTP. El dominio solo sabe que hay un "EventPublisherPort".',
    code: `@Injectable()
export class SmtpEventPublisher
  implements EventPublisherPort {
  
  constructor(private mailer: MailerService) {}

  publish(event: DomainEvent): void {
    if (event instanceof AppointmentRequestedEvent) {
      this.mailer.send({
        to: event.patientEmail,
        subject: 'Solicitud de cita recibida',
        body: this.buildTemplate(event)
      });
    }
  }
}`,
    dependencies: ['Ports (interfaces)'],
  },
  api: {
    title: 'Adaptador API Externa',
    description: 'Conecta con servicios externos como una agenda hospitalaria o HIS por HTTP. Aisla al dominio de cambios en APIs de terceros.',
    code: `@Injectable()
export class HospitalScheduleAdapter
  implements DoctorSchedulePort {
  
  constructor(private http: HttpService) {}

  async findAvailableSlot(
    specialtyId: string,
    preferredDate: Date
  ): Promise<DoctorSlot> {
    const response = await this.http.post(
      '/hospital/schedule/available-slots',
      { specialtyId, preferredDate }
    );
    return DoctorSlot.fromExternal(response.data);
  }
}`,
    dependencies: ['Ports (interfaces)', 'Domain (DoctorSlot)'],
  },
};

export function DiagramSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Animated data particles
  useEffect(() => {
    const interval = setInterval(() => {
      if (!particlesRef.current) return;
      const particle = document.createElement('div');
      particle.className = 'absolute w-1.5 h-1.5 rounded-full bg-accent-cyan pointer-events-none';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.boxShadow = '0 0 8px rgba(0, 212, 255, 0.6)';
      particlesRef.current.appendChild(particle);

      const paths = [
        { x: [50, 65, 35, 50], y: [50, 35, 35, 50], duration: 3000 },
        { x: [50, 75, 65, 50], y: [50, 60, 35, 50], duration: 3500 },
        { x: [50, 25, 35, 50], y: [50, 60, 35, 50], duration: 3200 },
      ];
      const path = paths[Math.floor(Math.random() * paths.length)];
      
      let startTime: number;
      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / path.duration;
        if (progress >= 1) {
          particle.remove();
          return;
        }
        const idx = Math.min(Math.floor(progress * (path.x.length - 1)), path.x.length - 2);
        const t = (progress * (path.x.length - 1)) - idx;
        const x = path.x[idx] + (path.x[idx + 1] - path.x[idx]) * t;
        const y = path.y[idx] + (path.y[idx + 1] - path.y[idx]) * t;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.opacity = `${1 - Math.abs(progress - 0.5) * 2}`;
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleHotspotClick = useCallback((key: string) => {
    setActiveHotspot(prev => prev === key ? null : key);
    setActiveLayer(null);
  }, []);

  const handleLayerClick = useCallback((layer: string) => {
    setActiveLayer(prev => prev === layer ? null : layer);
    setActiveHotspot(null);
  }, []);

  const closeInfo = useCallback(() => {
    setActiveHotspot(null);
    setActiveLayer(null);
  }, []);

  const isActive = (key: string) => {
    if (activeHotspot === key) return true;
    if (activeLayer === 'domain' && key === 'domain') return true;
    if (activeLayer === 'application' && ['usecases', 'ports'].includes(key)) return true;
    if (activeLayer === 'infrastructure' && ['controller', 'dbadapter', 'smtp', 'api'].includes(key)) return false; // dim others
    return false;
  };

  const shouldDim = (key: string) => {
    if (!activeHotspot && !activeLayer) return false;
    if (activeHotspot) return activeHotspot !== key;
    if (activeLayer === 'domain') return key !== 'domain';
    if (activeLayer === 'application') return !['usecases', 'ports'].includes(key);
    if (activeLayer === 'infrastructure') return !['controller', 'dbadapter', 'smtp', 'api'].includes(key);
    return false;
  };

  return (
    <section id="diagram" className="section-padding relative overflow-hidden min-h-[100dvh]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <SectionLabel text="Diagrama Interactivo" />
          <SectionHeading text="Explora la Arquitectura" className="mb-4" />
          <p className="text-text-secondary max-w-xl mx-auto">
            Haz clic en cualquier elemento para descubrir su rol. Los datos fluyen desde los adaptadores hacia el dominio.
          </p>
        </div>

        {/* Diagram Container */}
        <div className="relative max-w-[800px] mx-auto aspect-square" ref={particlesRef}>
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 600 520"
          >
            <defs>
              <radialGradient id="violetGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="cyanGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection Lines */}
            <g opacity={activeHotspot || activeLayer ? "0.15" : "0.2"}>
              {[
                'M300,260 L300,140',
                'M300,260 L404,320',
                'M300,260 L196,320',
                'M300,140 L300,60',
                'M300,140 L430,100',
                'M300,140 L170,100',
                'M300,140 L460,200',
                'M300,140 L140,200',
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="#00D4FF"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                  className="animate-flow-dash"
                />
              ))}
            </g>

            {/* Center Hexagon - Domain */}
            <g
              className="cursor-pointer transition-all duration-400"
              style={{ opacity: shouldDim('domain') ? 0.2 : 1, filter: isActive('domain') ? 'url(#glow)' : 'none' }}
              onClick={() => handleHotspotClick('domain')}
            >
              <polygon
                points="300,200 352,230 352,290 300,320 248,290 248,230"
                fill="url(#violetGrad)"
                stroke="#7B61FF"
                strokeWidth={isActive('domain') ? 2.5 : 1.5}
              />
              <text x="300" y="255" textAnchor="middle" fill="#F0EDE8" fontSize="14" fontWeight="700" fontFamily="Inter" letterSpacing="0.08em">DOMINIO</text>
              <text x="300" y="275" textAnchor="middle" fill="#7A7A8D" fontSize="8" fontFamily="JetBrains Mono">Entities · Value Objects</text>
            </g>

            {/* Application Ring */}
            {[
              { x: 300, y: 140, label: 'Use Cases', key: 'usecases' },
              { x: 404, y: 320, label: 'Ports', key: 'ports' },
              { x: 196, y: 320, label: 'App Services', key: 'appservices' },
            ].map((pos) => (
              <g
                key={pos.key}
                className="cursor-pointer transition-all duration-400"
                style={{ opacity: shouldDim(pos.key) ? 0.2 : 1, filter: isActive(pos.key) ? 'url(#glow)' : 'none' }}
                onClick={() => handleHotspotClick(pos.key)}
              >
                <polygon
                  points={`${pos.x},${pos.y - 35} ${pos.x + 30},${pos.y - 17} ${pos.x + 30},${pos.y + 17} ${pos.x},${pos.y + 35} ${pos.x - 30},${pos.y + 17} ${pos.x - 30},${pos.y - 17}`}
                  fill="url(#cyanGrad)"
                  stroke="#00D4FF"
                  strokeWidth={isActive(pos.key) ? 2 : 1.2}
                />
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#F0EDE8" fontSize="10" fontWeight="600" fontFamily="Inter">{pos.label}</text>
              </g>
            ))}

            {/* Infrastructure - Adapters */}
            {[
              { x: 300, y: 60, label: 'HTTP API', key: 'controller' },
              { x: 430, y: 100, label: 'Agenda DB', key: 'dbadapter' },
              { x: 170, y: 100, label: 'Email/SMS', key: 'smtp' },
              { x: 460, y: 200, label: 'HIS API', key: 'api' },
              { x: 140, y: 200, label: 'Queue', key: 'queue' },
              { x: 300, y: 420, label: 'WebSocket', key: 'websocket' },
            ].map((pos) => (
              <g
                key={pos.key}
                className="cursor-pointer transition-all duration-400"
                style={{ opacity: shouldDim(pos.key) ? 0.2 : 1, filter: isActive(pos.key) ? 'url(#glow)' : 'none' }}
                onClick={() => handleHotspotClick(pos.key)}
              >
                <rect
                  x={pos.x - 45}
                  y={pos.y - 20}
                  width="90"
                  height="40"
                  rx="8"
                  fill="rgba(255,255,255,0.04)"
                  stroke={isActive(pos.key) ? '#00D4FF' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={isActive(pos.key) ? 1.5 : 1}
                />
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#7A7A8D" fontSize="9" fontFamily="Inter">{pos.label}</text>
              </g>
            ))}
          </svg>

          {/* Info Card */}
          <AnimatePresence>
            {activeHotspot && hotspotData[activeHotspot] && (
              <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 80, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] lg:w-[320px] glass-card p-5 z-20 max-h-[80%] overflow-y-auto"
              >
                <button
                  onClick={closeInfo}
                  className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-text-primary mb-2 pr-6">{hotspotData[activeHotspot].title}</h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">{hotspotData[activeHotspot].description}</p>
                <div className="rounded-lg p-3 mb-4 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <SyntaxHighlighter code={hotspotData[activeHotspot].code} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Dependencias</p>
                  <ul className="text-xs text-text-secondary space-y-0.5">
                    {hotspotData[activeHotspot].dependencies.map((dep, i) => (
                      <li key={i}>→ {dep}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
