import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionHeading } from '@/components/SectionHeading';
import { GlassCard } from '@/components/GlassCard';
import { CodeCard } from '@/components/CodeCard';
import { Repeat, Zap, Database, HardDrive } from 'lucide-react';

const integrationTestCode = `// Test de integracion con PostgreSQL
describe('CreateOrder (Integration)', () => {
  let repo: PostgresOrderRepository;
  
  beforeAll(async () => {
    // Necesitas Docker, migrations, datos...
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(postgresConfig)],
    }).compile();
    repo = module.get(PostgresOrderRepository);
  });
  
  it('should save order', async () => {
    const order = Order.create([
      { product: 'T-Shirt', qty: 2 }
    ]);
    await repo.save(order);  // Lento. Requiere DB.
    expect(await repo.findById(order.id)).toBeDefined();
  });
});`;

const unitTestCode = `// Test unitario puro — 100ms vs 3000ms
describe('CreateOrder (Unit)', () => {
  let useCase: CreateOrderUseCase;
  let mockRepo: MockOrderRepository;
  
  beforeEach(() => {
    mockRepo = new MockOrderRepository();
    useCase = new CreateOrderUseCase(mockRepo);
  });
  
  it('should create order', async () => {
    const order = await useCase.execute({
      items: [{ product: 'T-Shirt', qty: 2 }]
    });
    expect(order.status).toBe('CONFIRMED');
    expect(mockRepo.orders).toHaveLength(1);
  });
  
  // 30 tests puros en < 1 segundo. Sin Docker.
});`;

export function TestingSection() {
  return (
    <section id="testing" className="section-padding relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(0, 229, 160, 0.06) 0%, transparent 50%)',
        }}
      />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="text-center mb-16">
          <SectionLabel text="Testing" />
          <SectionHeading text="Testea sin Base de Datos" className="mb-4" />
          <p className="text-text-secondary max-w-xl mx-auto">
            Descubre como los mocks de puertos hacen los tests 30x mas rapidos y 100% independientes.
          </p>
        </div>

        {/* Before/After Diagrams */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16 items-center">
          {/* Before */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <GlassCard>
              <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">Con PostgreSQL</h4>
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 py-2 rounded-lg text-center text-xs font-medium border bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan">
                  App
                </div>
                <div className="w-px h-6 bg-accent-cyan/30" />
                <div className="w-32 py-2 rounded-lg text-center text-xs font-medium border bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald">
                  Postgres Adapter
                </div>
                <div className="w-px h-6 bg-accent-emerald/30" />
                <div className="w-32 py-3 rounded-lg text-center text-xs font-medium border bg-blue-500/10 border-blue-500/20 flex flex-col items-center gap-1">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400">PostgreSQL</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Swap Animation */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Repeat className="w-12 h-12 text-accent-violet" />
            </motion.div>
            <p className="text-[0.7rem] text-text-muted uppercase tracking-wider mt-4">Swap de Adaptador</p>
            <p className="text-sm text-text-secondary italic mt-1 text-center">
              Mismo dominio.<br />Diferente infraestructura.
            </p>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <GlassCard>
              <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">Con Mock en Memoria</h4>
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 py-2 rounded-lg text-center text-xs font-medium border bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan">
                  App
                </div>
                <div className="w-px h-6 bg-accent-cyan/30" />
                <div className="w-32 py-2 rounded-lg text-center text-xs font-medium border bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald">
                  Mock Adapter
                </div>
                <div className="w-px h-6 bg-accent-emerald/30" />
                <div className="w-32 py-3 rounded-lg text-center text-xs font-medium border bg-purple-500/10 border-purple-500/20 flex flex-col items-center gap-1">
                  <HardDrive className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400">En Memoria (RAM)</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Code Comparison */}
        <div className="grid lg:grid-cols-2 gap-6 relative">
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Test de Integracion</h4>
            <CodeCard filename="order.integration.spec.ts" code={integrationTestCode} />
          </div>

          {/* Performance Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-card px-6 py-4 flex flex-col items-center"
            >
              <Zap className="w-6 h-6 text-accent-emerald mb-1" />
              <span className="text-2xl font-bold text-accent-emerald">30x</span>
              <span className="text-xs text-text-muted">mas rapido</span>
            </motion.div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Test Unitario Puro</h4>
            <CodeCard filename="order.unit.spec.ts" code={unitTestCode} />
          </div>
        </div>

        {/* Mobile performance badge */}
        <div className="flex justify-center mt-6 lg:hidden">
          <GlassCard className="flex items-center gap-3 px-6 py-3">
            <Zap className="w-5 h-5 text-accent-emerald" />
            <span className="text-lg font-bold text-accent-emerald">30x mas rapido</span>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
