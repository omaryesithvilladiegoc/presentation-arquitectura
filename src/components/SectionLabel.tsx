interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  return (
    <p className="text-[0.75rem] font-semibold text-accent-cyan uppercase tracking-[0.1em] mb-4">
      {text}
    </p>
  );
}
