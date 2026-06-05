import type { CsPlayer, DraftPick, HistoricalCsTeam, PlayerRatings } from '../core/types';
import { resolveTeamRoster } from '../data';
import { getTeamYearRatings } from '../data/rating-overlays';
import {
  ACCOMPLISHMENT_TUNING,
  accomplishmentFromPlacement,
  accomplishmentFromTagline,
  type TeamYearAccomplishment,
} from '../data/accomplishment';

function teamAccomplishment(team: HistoricalCsTeam): TeamYearAccomplishment {
  if (team.isMajorWinner) return 'major_champion';
  const fromPlacement = accomplishmentFromPlacement(team.placement);
  if (fromPlacement !== 'standard') return fromPlacement;
  return accomplishmentFromTagline(team.tagline);
}

function scaleRatingsFromOverall(base: PlayerRatings, targetOverall: number): PlayerRatings {
  const delta = targetOverall - base.overall;
  const scale = (value: number, weight = 0.85) =>
    Math.round(Math.min(99, Math.max(50, value + delta * weight)));

  return {
    overall: targetOverall,
    firepower: scale(base.firepower),
    mechanical: scale(base.mechanical),
    clutch: scale(base.clutch),
    lan: scale(base.lan),
    playoffs: scale(base.playoffs),
    majorExperience: scale(base.majorExperience),
    consistency: scale(base.consistency),
    communication: scale(base.communication),
    leadership: scale(base.leadership),
    entryAbility: scale(base.entryAbility),
    awpAbility: scale(base.awpAbility),
    supportValue: scale(base.supportValue),
    anchorAbility: scale(base.anchorAbility),
    championshipFactor: scale(base.championshipFactor, 0.7),
  };
}

function formulaOverall(player: CsPlayer, team: HistoricalCsTeam): number {
  const roster = resolveTeamRoster(team);
  if (roster.length === 0) return Math.round(player.ratings.overall);

  const seedAvg = roster.reduce((sum, p) => sum + p.ratings.overall, 0) / roster.length;
  const delta = player.ratings.overall - seedAvg;
  const tuning = ACCOMPLISHMENT_TUNING[teamAccomplishment(team)];
  const raw = team.teamRating + delta * 0.85 + tuning.bonus;
  return Math.round(Math.min(99, Math.max(tuning.floor, raw)));
}

function baseRatingsForCard(player: CsPlayer, team: HistoricalCsTeam): PlayerRatings {
  return getTeamYearRatings(player, team) ?? player.ratings;
}

/** OVR for this player on this specific team-year card */
export function cardOverall(player: CsPlayer, team: HistoricalCsTeam): number {
  const teamYear = getTeamYearRatings(player, team);
  if (teamYear) return teamYear.overall;
  return formulaOverall(player, team);
}

export function cardRatings(player: CsPlayer, team: HistoricalCsTeam): PlayerRatings {
  const teamYear = getTeamYearRatings(player, team);
  if (teamYear) return { ...teamYear };
  const ovr = formulaOverall(player, team);
  return scaleRatingsFromOverall(baseRatingsForCard(player, team), ovr);
}

export function teamRosterAvgOvr(team: HistoricalCsTeam): number {
  const roster = resolveTeamRoster(team);
  if (roster.length === 0) return 0;
  const sum = roster.reduce((acc, player) => acc + cardOverall(player, team), 0);
  return Math.round((sum / roster.length) * 10) / 10;
}

/** Players with team-year ratings applied — used for sim + odds */
export function simulationPlayers(picks: DraftPick[]): CsPlayer[] {
  return picks.map((pick) => ({
    ...pick.player,
    ratings: cardRatings(pick.player, pick.team),
  }));
}
