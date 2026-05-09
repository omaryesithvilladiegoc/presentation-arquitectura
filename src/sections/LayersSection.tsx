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
    filename: 'order.entity.ts',
    code: `// Capa de Dominio — El corazon de tu app
// NO depende de NADA externo

export class Order {
  constructor(
    private readonly id: string,
    private readonly items: OrderItem[],
    private status: OrderStatus = OrderStatus.PENDING
  ) {}

  // Logica de negocio pura
  calculateTotal(): Money {
    return this.items.reduce(
      (sum, item) => sum.add(
        item.price.multiply(item.quantity)
      ),
      Money.zero()
    );
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new InvalidOrderStateError();
    }
    this.status = OrderStatus.CONFIRMED;
  }
}`,
  },
  {
    badge: 'Application',
    badgeColor: '#00D4FF',
    filename: 'create-order.use-case.ts',
    code: `// Caso de Uso — Orquesta el flujo
// Depende solo de puertos (interfaces)

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepo: OrderRepositoryPort,     // Puerto
    private paymentGateway: PaymentServicePort, // Puerto
    private eventBus: EventPublisherPort        // Puerto
  ) {}

  async execute(command: CreateOrderCommand) {
    const order = Order.create(command.items);
    
    // El dominio decide, el caso de uso coordina
    await this.paymentGateway.process(
      order.calculateTotal()
    );
    order.confirm();
    
    await this.orderRepo.save(order);
    this.eventBus.publish(
      new OrderCreatedEvent(order)
    );
    
    return order;
  }
}`,
  },
  {
    badge: 'Infrastructure',
    badgeColor: '#00E5A0',
    filename: 'order.repository.adapter.ts',
    code: `// Adaptador — Implementa un Puerto
// Puede cambiar sin afectar al dominio

@Injectable()
export class PostgresOrderRepository 
  implements OrderRepositoryPort {
  
  constructor(
    @InjectRepository(OrderEntity)
    private repo: Repository<OrderEntity>
  ) {}

  async save(order: Order): Promise<void> {
    const entity = this.toEntity(order);
    await this.repo.save(entity);
  }

  async findById(id: string): Promise<Order | null> {
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
    filename: 'order.controller.ts',
    code: `// Controlador HTTP — Punto de entrada
// Solo convierte HTTP -> llamadas al caso de uso

@Controller('orders')
export class OrderController {
  constructor(
    private createOrder: CreateOrderUseCase
  ) {}

  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto
  ): Promise<OrderResponse> {
    // Solo valida y delega
    const order = await this.createOrder.execute(dto);
    return OrderResponse.from(order);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string
  ): Promise<OrderResponse | null> {
    // El controller no sabe NADA de logica
    return this.findOrderQuery.execute({ id });
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
          <SectionLabel text="Estructura de Codigo" />
          <SectionHeading text="Las 4 Capas en Accion" className="mb-4" />
          <p className="text-text-secondary max-w-xl mx-auto">
            Desplaza para ver como se organiza el codigo en cada capa de la arquitectura hexagonal.
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

        {/* Dependency arrows */}
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
