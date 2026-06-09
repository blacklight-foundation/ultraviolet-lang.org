export type HighlightToken = {
  type: 'text' | 'comment' | 'string' | 'keyword' | 'type';
  text: string;
};

export function highlightPart(text: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const regex = /(\/\/.*)|("[^"]*")|\b(public|procedure|let|loop|if|else|return|state|modal|record|shared|const|unique|move|copy)\b|\b(usize|string|bool|u32|i32|u64|i64|f32|f64|char|Cache|Index|TextOut)\b/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      tokens.push({ type: 'comment', text: match[1] });
    } else if (match[2]) {
      tokens.push({ type: 'string', text: match[2] });
    } else if (match[3]) {
      tokens.push({ type: 'keyword', text: match[3] });
    } else if (match[4]) {
      tokens.push({ type: 'type', text: match[4] });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', text: text.slice(lastIndex) });
  }

  return tokens;
}
