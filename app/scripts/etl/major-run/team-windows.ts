import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '../../..');

export interface TeamYearRef {
  teamId: string;
  teamName: string;
  season: number;
  teamRating: number;
}

export interface PlayerTeamContext {
  playerId: string;
  primaryTeamId: string;
  season: number;
  startDate: string;
  endDate: string;
}

/** Major-era stat window for a team card season (calendar year). */
export function seasonToDateWindow(season: number): { startDate: string; endDate: string } {
  return {
    startDate: `${season}-01-01`,
    endDate: `${season}-12-31`,
  };
}

function parseTeams(): TeamYearRef[] {
  const text = readFileSync(join(ROOT, 'src/major-run/data/teams.ts'), 'utf8');
  const teams: TeamYearRef[] = [];
  const teamRe =
    /team\(\s*'([^']+)',\s*'([^']+)',\s*(\d+)[\s\S]*?teamRating:\s*(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = teamRe.exec(text))) {
    teams.push({
      teamId: m[1],
      teamName: m[2],
      season: parseInt(m[3], 10),
      teamRating: parseInt(m[4], 10),
    });
  }
  return teams;
}

function parseRosters(): Map<string, string[]> {
  const text = readFileSync(join(ROOT, 'src/major-run/data/teams.ts'), 'utf8');
  const map = new Map<string, string[]>();
  const teamBlockRe = /team\(\s*'([^']+)'[\s\S]*?R\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = teamBlockRe.exec(text))) {
    map.set(m[1], [m[2], m[3], m[4], m[5], m[6]]);
  }
  return map;
}

function parsePlayerOrgs(): Map<string, string> {
  const text = readFileSync(join(ROOT, 'src/major-run/data/players.ts'), 'utf8');
  const map = new Map<string, string>();
  const re = /p\('([^']+)',\s*'([^']+)'[\s\S]*?'([^']+)',\s*(\d+),/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    // organization is 3rd capture in p() - need better regex
  }
  const lineRe = /p\('([^']+)',\s*'([^']+)',\s*'[^']+',\s*'[^']+',\s*'([^']+)'/g;
  while ((m = lineRe.exec(text))) {
    map.set(m[1], m[3]);
  }
  return map;
}

const teams = parseTeams();
const rosters = parseRosters();
const playerOrgs = parsePlayerOrgs();
const teamById = new Map(teams.map((t) => [t.teamId, t]));

/** Pick the best team-year card for HLTV stat window per player. */
export function buildPlayerTeamContexts(): Map<string, PlayerTeamContext> {
  const contexts = new Map<string, PlayerTeamContext>();

  for (const [teamId, playerIds] of rosters) {
    const team = teamById.get(teamId);
    if (!team) continue;
    const window = seasonToDateWindow(team.season);

    for (const playerId of playerIds) {
      const org = playerOrgs.get(playerId)?.toLowerCase() ?? '';
      const teamNameNorm = team.teamName.toLowerCase();
      const orgMatch =
        org.length > 0 &&
        (teamNameNorm.includes(org) || org.includes(teamNameNorm.split(' ')[0] ?? ''));

      const existing = contexts.get(playerId);
      const newScore = teamScore(team, orgMatch);

      if (!existing) {
        contexts.set(playerId, {
          playerId,
          primaryTeamId: teamId,
          season: team.season,
          startDate: window.startDate,
          endDate: window.endDate,
        });
        continue;
      }

      const prevTeam = teamById.get(existing.primaryTeamId);
      const prevOrg = playerOrgs.get(playerId)?.toLowerCase() ?? '';
      const prevOrgMatch =
        prevTeam &&
        prevOrg.length > 0 &&
        (prevTeam.teamName.toLowerCase().includes(prevOrg) ||
          prevOrg.includes(prevTeam.teamName.toLowerCase().split(' ')[0] ?? ''));

      if (newScore > teamScore(prevTeam ?? team, prevOrgMatch)) {
        contexts.set(playerId, {
          playerId,
          primaryTeamId: teamId,
          season: team.season,
          startDate: window.startDate,
          endDate: window.endDate,
        });
      }
    }
  }

  return contexts;
}

function teamScore(team: TeamYearRef, orgMatch: boolean): number {
  return team.teamRating + (orgMatch ? 15 : 0);
}

export function getTeamById(teamId: string): TeamYearRef | undefined {
  return teamById.get(teamId);
}

export { teams, rosters, playerOrgs };
