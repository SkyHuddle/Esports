import type {
  DraftPick,
  HistoricalValorantTeam,
  PlayerRatings,
  ValorantPlayer,
} from '../core/types';
import { resolveTeamRoster } from '../data';
import {
  ACCOMPLISHMENT_TUNING,
  accomplishmentFromPlacement,
  accomplishmentFromTagline,
  type TeamYearAccomplishment,
} from '../data/accomplishment';

function teamAccomplishment(team: HistoricalValorantTeam): TeamYearAccomplishment {
  if (team.isChampionsWinner) return 'champions_winner';
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
    utility: scale(base.utility),
    clutch: scale(base.clutch),
    lan: scale(base.lan),
    playoffs: scale(base.playoffs),
    international: scale(base.international),
    consistency: scale(base.consistency),
    communication: scale(base.communication),
    leadership: scale(base.leadership),
    firstKillPressure: scale(base.firstKillPressure),
    roleFlexibility: scale(base.roleFlexibility),
    championshipFactor: scale(base.championshipFactor, 0.7),
  };
}

function formulaOverall(player: ValorantPlayer, team: HistoricalValorantTeam): number {
  const roster = resolveTeamRoster(team);
  if (roster.length === 0) return Math.round(player.ratings.overall);

  const seedAvg = roster.reduce((sum, pl) => sum + pl.ratings.overall, 0) / roster.length;
  const delta = player.ratings.overall - seedAvg;
  const tuning = ACCOMPLISHMENT_TUNING[teamAccomplishment(team)];
  const raw = team.teamRating + delta * 0.85 + tuning.bonus;
  return Math.round(Math.min(99, Math.max(tuning.floor, raw)));
}

export function cardOverall(player: ValorantPlayer, team: HistoricalValorantTeam): number {
  return formulaOverall(player, team);
}

export function cardRatings(player: ValorantPlayer, team: HistoricalValorantTeam): PlayerRatings {
  const ovr = formulaOverall(player, team);
  return scaleRatingsFromOverall(player.ratings, ovr);
}

export function teamRosterAvgOvr(team: HistoricalValorantTeam): number {
  const roster = resolveTeamRoster(team);
  if (roster.length === 0) return 0;
  const sum = roster.reduce((acc, player) => acc + cardOverall(player, team), 0);
  return Math.round((sum / roster.length) * 10) / 10;
}

export function simulationPlayers(picks: DraftPick[]): ValorantPlayer[] {
  return picks.map((pick) => ({
    ...pick.player,
    ratings: cardRatings(pick.player, pick.team),
  }));
}

export function roleFitForSlot(player: ValorantPlayer, slot: import('../core/types').RosterSlot): number {
  return player.roleConfidence[slot];
}
