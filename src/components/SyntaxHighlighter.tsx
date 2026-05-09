const tokenRules = [
  { regex: /\b(export|import|from|class|const|let|var|function|return|async|await|if|else|for|while|new|this|throw|try|catch|switch|case|break|continue|default|extends|implements|interface|type|enum|of|in|as|void|readonly|private|public|protected|static|get|set|yield|typeof|instanceof|declare|namespace|module)\b/g, className: 'syntax-keyword' },
  { regex: /(['"`][^'"`]*['"`])/g, className: 'syntax-string' },
  { regex: /(\/\/.*$)/gm, className: 'syntax-comment' },
  { regex: /\b(true|false|null|undefined)\b/g, className: 'syntax-keyword' },
  { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, className: 'syntax-type' },
  { regex: /(@\w+)/g, className: 'syntax-decorator' },
  { regex: /\b(\d+(?:\.\d+)?)\b/g, className: 'syntax-number' },
  { regex: /\b([a-z][a-zA-Z0-9_]*)\s*(?=\()/g, className: 'syntax-function' },
];

export function SyntaxHighlighter({ code }: { code: string }) {
  const lines = code.split('\n');
  
  return (
    <pre className="font-mono text-[0.75rem] leading-relaxed overflow-x-auto">
      <code>
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.4em]">
            <LineHighlighter line={line} />
          </div>
        ))}
      </code>
    </pre>
  );
}

function LineHighlighter({ line }: { line: string }) {
  const tokens = tokenize(line);
  
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={token.className || 'syntax-punctuation'}>
          {token.text}
        </span>
      ))}
    </>
  );
}

function tokenize(line: string): Array<{ text: string; className?: string }> {
  if (!line.trim()) return [{ text: ' ' }];
  
  const tokens: Array<{ text: string; className?: string; start: number; end: number }> = [];
  
  // Extract all matches
  tokenRules.forEach(rule => {
    const regex = new RegExp(rule.regex.source, rule.regex.flags.includes('g') ? rule.regex.flags : rule.regex.flags + 'g');
    let match;
    while ((match = regex.exec(line)) !== null) {
      tokens.push({
        text: match[0],
        className: rule.className,
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  });
  
  // Sort by start position, longer matches first for same start
  tokens.sort((a, b) => a.start - b.start || b.end - a.end);
  
  // Remove overlapping matches
  const filtered: typeof tokens = [];
  tokens.forEach(t => {
    if (!filtered.some(f => t.start < f.end && t.end > f.start)) {
      filtered.push(t);
    }
  });
  filtered.sort((a, b) => a.start - b.start);
  
  // Build result
  const result: Array<{ text: string; className?: string }> = [];
  let lastIndex = 0;
  
  filtered.forEach(token => {
    if (token.start > lastIndex) {
      result.push({ text: line.slice(lastIndex, token.start) });
    }
    result.push({ text: token.text, className: token.className });
    lastIndex = token.end;
  });
  
  if (lastIndex < line.length) {
    result.push({ text: line.slice(lastIndex) });
  }
  
  if (result.length === 0) {
    return [{ text: line }];
  }
  
  return result;
}
