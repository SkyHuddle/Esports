import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '../..');

export interface AppPlayerRef {
  id: string;
  name: string;
  role: string;
}

export function loadAppPlayers(): AppPlayerRef[] {
  const text = readFileSync(join(ROOT, 'src/major-run/data/players.ts'), 'utf8');
  const players: AppPlayerRef[] = [];
  const re = /p\('([^']+)',\s*'([^']+)',\s*'([^']+)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    players.push({ id: m[1], name: m[2], role: m[3] });
  }
  return players;
}
