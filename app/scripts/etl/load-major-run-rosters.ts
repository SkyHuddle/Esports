import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '../..');

export interface RosterEntry {
  teamYearId: string;
  teamName: string;
  season: number;
  teamRating: number;
  tier: string;
  playerId: string;
}

export function loadRosterEntries(): RosterEntry[] {
  const text = readFileSync(join(ROOT, 'src/major-run/data/teams.ts'), 'utf8');
  const entries: RosterEntry[] = [];
  const teamRe =
    /team\(\s*'([^']+)',\s*'([^']+)',\s*(\d+),[\s\S]*?R\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\s*\),[\s\S]*?teamRating:\s*(\d+)[\s\S]*?tier:\s*'([^']+)'/g;

  let m: RegExpExecArray | null;
  while ((m = teamRe.exec(text))) {
    const [, teamYearId, teamName, seasonStr, ...rest] = m;
    const season = parseInt(seasonStr, 10);
    const playerIds = rest.slice(0, 5);
    const teamRating = parseInt(rest[5], 10);
    const tier = rest[6];
    for (const playerId of playerIds) {
      entries.push({ teamYearId, teamName, season, teamRating, tier, playerId });
    }
  }
  return entries;
}
