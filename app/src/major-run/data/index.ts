import { resolveRoster } from './players';
import { rosterPlayerIds } from './roster-slots';
import type { CsPlayer, HistoricalCsTeam, RosterSlot } from '../core/types';

export { CS_PLAYERS, getPlayerById, getAllPlayers, resolveRoster } from './players';
export { CS_TEAMS, getAllTeams, getTeamById, getValidTeams, getTeamPool } from './teams';
export { assignRosterSlots, rosterPlayerIds } from './roster-slots';
export { getTeamYearRatings, applyTeamYearOverlay, getHltvOverlayMeta, hasHltvOverlays, teamYearOverlayKey } from './rating-overlays';
export {
  ACCOMPLISHMENT_TUNING,
  ACCOMPLISHMENT_LABEL,
  accomplishmentFromTagline,
  accomplishmentFromPlacement,
  accomplishmentFromTeam,
  getAccomplishmentTuning,
} from './accomplishment';
export type { TeamYearAccomplishment, AccomplishmentTuning } from './accomplishment';

export function resolveTeamRoster(team: HistoricalCsTeam): CsPlayer[] {
  return resolveRoster(rosterPlayerIds(team.roster));
}

export function getTeamRosterPlayer(
  team: HistoricalCsTeam,
  slot: RosterSlot
): CsPlayer | undefined {
  const id = team.roster[slot];
  return resolveRoster([id])[0];
}
