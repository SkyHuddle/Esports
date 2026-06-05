import type { CsPlayer, HistoricalCsTeam, PlayerRatings } from '../core/types';
import hltvRatingsJson from './generated/hltv-ratings.json';

interface HltvTeamYearEntry {
  key: string;
  playerId: string;
  teamYearId: string;
  ratings: PlayerRatings;
  source: string;
}

interface HltvRatingsFile {
  meta: {
    source: string;
    generatedAt: string;
    rosterEntryCount: number;
    teamCount: number;
  };
  entries: Record<string, HltvTeamYearEntry>;
}

const bundle = hltvRatingsJson as HltvRatingsFile;

const overlayMap = new Map<string, PlayerRatings>(
  Object.values(bundle.entries ?? {}).map((e) => [e.key, e.ratings])
);

export function teamYearOverlayKey(teamYearId: string, playerId: string): string {
  return `${teamYearId}::${playerId}`;
}

export function hasHltvOverlays(): boolean {
  return overlayMap.size > 0;
}

export function getHltvOverlayMeta() {
  return bundle.meta;
}

/** Team-year HLTV ratings for a player on a specific historical card. */
export function getTeamYearRatings(
  player: CsPlayer,
  team: HistoricalCsTeam
): PlayerRatings | undefined {
  const key = teamYearOverlayKey(team.id, player.id);
  return overlayMap.get(key);
}

/** Apply team-year overlay when team context is known. */
export function applyTeamYearOverlay(player: CsPlayer, team: HistoricalCsTeam): CsPlayer {
  const ratings = getTeamYearRatings(player, team);
  if (!ratings) return player;
  return { ...player, ratings: { ...ratings } };
}

/** @deprecated Use getTeamYearRatings(player, team) at draft/sim time. */
export function applyRatingOverlay(player: CsPlayer): CsPlayer {
  return player;
}

export function applyRatingOverlays(players: CsPlayer[]): CsPlayer[] {
  return players;
}
