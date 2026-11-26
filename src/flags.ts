import { readFileSync } from 'node:fs';

export interface FlagSet {
  names(): string[];
  has(name: string): boolean;
  isEnabled(name: string, context?: object): boolean;
}

// One branch per rule kind; a new kind adds its branch above the error.
function evaluate(name: string, rule: unknown, _context?: object): boolean {
  if (typeof rule === 'boolean') {
    return rule;
  }
  throw new Error(`flag ${JSON.stringify(name)}: found ${JSON.stringify(rule)}; expected a boolean`);
}

export function loadFlags(path: string): FlagSet {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    const reason = code === 'ENOENT' ? 'file not found' : 'file cannot be read';
    throw new Error(`${JSON.stringify(path)}: ${reason}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch (error) {
    const position = (error as Error).message.match(/line \d+ column \d+/)?.[0];
    throw new Error(`${JSON.stringify(path)}: invalid JSON${position ? ` at ${position}` : ''}`);
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${JSON.stringify(path)}: expected a JSON object`);
  }
  const rules = new Map(Object.entries(parsed).filter(([name]) => !name.startsWith('$')));

  return {
    names() {
      return [...rules.keys()];
    },
    has(name) {
      return rules.has(name);
    },
    isEnabled(name, context) {
      if (!rules.has(name)) {
        return false;
      }
      try {
        return evaluate(name, rules.get(name), context);
      } catch (error) {
        throw new Error(`${JSON.stringify(path)}: ${(error as Error).message}`);
      }
    }
  };
}
