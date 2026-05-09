import { SyntaxHighlighter } from './SyntaxHighlighter';

interface CodeCardProps {
  code: string;
  filename: string;
  badge?: string;
  badgeColor?: string;
}

export function CodeCard({ code, filename, badge, badgeColor = '#00D4FF' }: CodeCardProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <span className="font-mono text-[0.7rem] text-text-muted">{filename}</span>
      </div>
      {badge && (
        <div className="px-4 pt-3">
          <span
            className="inline-block text-[0.65rem] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30` }}
          >
            {badge}
          </span>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <SyntaxHighlighter code={code} />
      </div>
    </div>
  );
}
