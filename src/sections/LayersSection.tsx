import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { CodeCard } from '@/components/CodeCard';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    badge: 'Domain',
    badgeColor: '#7B61FF',
    filename: 'appointment-request.entity.ts',
    code: `// Capa de Dominio
// NO depende de NADA externo

export class AppointmentRequest {
  constructor(
    private readonly id: string,
    private readonly patientId: string,
    private readonly specialtyId: string,
    private readonly preferredDate: Date,
    private status: AppointmentStatus = AppointmentStatus.REQUESTED
  ) {}

  canBeScheduled(now: Date): boolean {
    return this.preferredDate > now &&
      this.status === AppointmentStatus.REQUESTED;
  }

  markAsScheduled(slot: DoctorSlot): void {
    if (!this.canBeScheduled(new Date())) {
      throw new InvalidAppointmentRequestError();
    }
    if (slot.specialtyId !== this.specialtyId) {
      throw new DoctorSpecialtyMismatchError();
    }
    this.status = AppointmentStatus.SCHEDULED;
  }
}`,
  },
  {
    badge: 'Application',
    badgeColor: '#00D4FF',
    filename: 'request-appointment.use-case.ts',
    code: `// Caso de Uso - Orquesta el flujo
// Depende solo de puertos (interfaces)

@Injectable()
export class RequestAppointmentUseCase {
  constructor(
    private appointmentRepo: AppointmentRepositoryPort,
    private schedule: DoctorSchedulePort,
    private eventBus: EventPublisherPort
  ) {}

  async execute(command: RequestAppointmentCommand) {
    const request = AppointmentRequest.create({
      patientId: command.patientId,
      specialtyId: command.specialtyId,
      preferredDate: command.preferredDate,
    });
    
    const slot = await this.schedule.findAvailableSlot(
      request.specialtyId,
      request.preferredDate
    );
    request.markAsScheduled(slot);
    
    await this.appointmentRepo.save(request);
    this.eventBus.publish(
      new AppointmentRequestedEvent(request)
    );
    
    return request;
  }
}`,
  },
  {
    badge: 'Infrastructure',
    badgeColor: '#00E5A0',
    filename: 'appointment.repository.adapter.ts',
    code: `// Adaptador - Implementa un Puerto
// Puede cambiar sin afectar al dominio

@Injectable()
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

  async findById(id: string): Promise<AppointmentRequest | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  // Cambiar a MongoDB = nuevo adaptador
  // El dominio ni se entera
}`,
  },
  {
    badge: 'Interface',
    badgeColor: '#FFB800',
    filename: 'appointment.controller.ts',
    code: `// Controlador HTTP - Punto de entrada
// Solo convierte HTTP -> llamadas al caso de uso

@Controller('appointments')
export class AppointmentController {
  constructor(
    private requestAppointment: RequestAppointmentUseCase
  ) {}

  @Post()
  async request(
    @Body() dto: RequestAppointmentDto
  ): Promise<AppointmentResponse> {
    // Solo valida y delega
    const appointment = await this.requestAppointment.execute(dto);
    return AppointmentResponse.from(appointment);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string
  ): Promise<AppointmentResponse | null> {
    // El controller no sabe NADA de logica
    return this.findAppointmentQuery.execute({ id });
  }
}`,
  },
];

export function LayersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll('.layer-card');

      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top bottom-=10%',
          end: 'bottom top+=25%',
          scrub: 1,
        },
        x: '100vw',
        rotateZ: 5,
        opacity: 0,
        stagger: 0.25,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="layers"
      className="section-padding relative overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          
          <SectionHeading text="Ejemplo" className="mb-4" />
          <p className="text-text-secondary max-w-xl mx-auto">
             Solicitud de cita medica en cada capa de la arquitectura hexagonal.
          </p>
        </div>

        <div ref={cardsRef} className="space-y-6 max-w-[720px] mx-auto">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              className="layer-card"
              style={{
                transform: `translateY(${-i * 8}px) scale(${1 - i * 0.015})`,
                zIndex: layers.length - i,
                position: 'relative',
              }}
            >
              <CodeCard
                badge={layer.badge}
                badgeColor={layer.badgeColor}
                filename={layer.filename}
                code={layer.code}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12 gap-8 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-violet/40" />
            <span>Domain</span>
          </div>
          <span className="text-accent-cyan">{'<'}</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-cyan/40" />
            <span>Application</span>
          </div>
          <span className="text-accent-cyan">{'<'}</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-emerald/40" />
            <span>Infrastructure</span>
          </div>
        </div>
      </div>
    </section>
  );
}
