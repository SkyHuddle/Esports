import { resolveRoster } from './players';
import { rosterPlayerIds } from './roster-slots';
import type { HistoricalValorantTeam, RosterSlot, ValorantPlayer } from '../core/types';

export {
  VALORANT_PLAYERS,
  getPlayerById,
  getAllPlayers,
  resolveRoster,
  roleFitScore,
} from './players';
export {
  VALORANT_TEAMS,
  getAllTeams,
  getTeamById,
  getValidTeams,
  getTeamPool,
} from './teams';
export { assignRosterSlots, rosterPlayerIds } from './roster-slots';
export {
  ACCOMPLISHMENT_TUNING,
  ACCOMPLISHMENT_LABEL,
  accomplishmentFromTagline,
  accomplishmentFromPlacement,
  accomplishmentFromTeam,
  getAccomplishmentTuning,
} from './accomplishment';
export type { TeamYearAccomplishment, AccomplishmentTuning } from './accomplishment';

export function resolveTeamRoster(team: HistoricalValorantTeam): ValorantPlayer[] {
  return resolveRoster(rosterPlayerIds(team.roster));
}

export function getTeamRosterPlayer(
  team: HistoricalValorantTeam,
  slot: RosterSlot
): ValorantPlayer | undefined {
  const id = team.roster[slot];
  return resolveRoster([id])[0];
}
