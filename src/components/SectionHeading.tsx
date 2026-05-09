interface SectionHeadingProps {
  text: string;
  className?: string;
}

export function SectionHeading({ text, className = '' }: SectionHeadingProps) {
  return (
    <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight ${className}`}>
      <span className="bg-gradient-to-r from-text-primary to-accent-cyan bg-clip-text text-transparent">
        {text}
      </span>
    </h2>
  );
}
