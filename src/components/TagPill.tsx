interface TagPillProps {
  text: string;
}

export function TagPill({ text }: TagPillProps) {
  return (
    <span className="inline-block text-[0.75rem] font-medium tracking-wider text-accent-cyan px-4 py-1.5 rounded-full border border-accent-cyan/15 bg-accent-cyan/[0.06]">
      {text}
    </span>
  );
}
