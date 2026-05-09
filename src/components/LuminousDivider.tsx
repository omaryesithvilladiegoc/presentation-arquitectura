export function LuminousDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`h-px w-full ${className}`} style={{
      background: 'linear-gradient(90deg, transparent, #00D4FF 50%, transparent)',
      opacity: 0.15,
    }} />
  );
}
