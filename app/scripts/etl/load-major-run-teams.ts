import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '../..');

export interface AppTeamRef {
  id: string;
  name: string;
  year: number;
}

export function loadAppTeams(): AppTeamRef[] {
  const text = readFileSync(join(ROOT, 'src/major-run/data/teams.ts'), 'utf8');
  const teams: AppTeamRef[] = [];
  const re = /team\(\s*'([^']+)',\s*'([^']+)',\s*(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    teams.push({ id: m[1], name: m[2], year: parseInt(m[3], 10) });
  }
  return teams;
}
