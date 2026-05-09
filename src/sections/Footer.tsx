import { motion } from 'framer-motion';
import { LuminousDivider } from '@/components/LuminousDivider';

const linkGroups = [
  {
    title: 'Aprender',
    links: ['Que es?', 'Diagrama', 'Capas', 'Simulador'],
  },
  {
    title: 'Recursos',
    links: ['Documentacion', 'Ejemplos NestJS', 'Testing', 'Patrones'],
  },
  {
    title: 'Comunidad',
    links: ['GitHub', 'Discord', 'Issues', 'Contribuir'],
  },
];

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative pt-20 pb-10 overflow-hidden">
    
    </footer>
  );
}
