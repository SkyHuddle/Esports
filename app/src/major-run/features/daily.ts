import type { CsPlayer, DailyConstraint, DraftPick, HistoricalCsTeam } from '../core/types';
import { cardOverall, cardRatings } from '../engine/card-context';

/** Local calendar date — daily challenges roll at midnight in the user's timezone. */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isIglPlayer(player: CsPlayer): boolean {
  return player.primaryRole === 'igl' || player.secondaryRole === 'igl';
}

function isSupportPlayer(player: CsPlayer): boolean {
  return player.primaryRole === 'support' || player.secondaryRole === 'support';
}

function cardStat(
  player: CsPlayer,
  team: HistoricalCsTeam | undefined,
  key: keyof CsPlayer['ratings']
): number {
  if (team) return cardRatings(player, team)[key];
  return player.ratings[key];
}
const DAILY_CONSTRAINTS: DailyConstraint[] = [
  {
    id: 'standard',
    title: 'Daily Major Run',
    description: 'Same five iconic rosters for everyone. One attempt — no respins.',
  },
  {
    id: 'one-major-winner',
    title: 'One Major Winner',
    description: 'Maximum one player with a Major championship.',
    pickFilter: (player, picks) => {
      const winners = picks.filter((p) => p.player.majorWins >= 1).length;
      if (player.majorWins >= 1 && winners >= 1) return false;
      return true;
    },
  },
  {
    id: 'one-per-country',
    title: 'One Per Country',
    description: 'No two players from the same nationality.',
    pickFilter: (player, picks) => !picks.some((p) => p.player.country === player.country),
  },
  {
    id: 'no-top10',
    title: 'No HLTV Top 10',
    description: 'Cannot draft players rated 95+ overall.',
    pickFilter: (player, _picks, team) =>
      (team ? cardOverall(player, team) : player.ratings.overall) < 95,
  },
  {
    id: 'cs2-only',
    title: 'CS2 Era Only',
    description: 'Only rosters from 2023 onward.',
    filter: (ctx) => ctx.team.season >= 2023,
  },
  {
    id: 'pre-cs2',
    title: 'Pre-CS2 Legends',
    description: 'Classic CS:GO rosters before the CS2 transition.',
    filter: (ctx) => ctx.team.season <= 2022,
  },
  {
    id: 'no-mvp',
    title: 'No MVP Winners',
    description: 'Major MVP winners are off limits.',
    pickFilter: (player) => player.mvps === 0,
  },
  {
    id: 'one-per-org',
    title: 'One Per Organization',
    description: 'No two players from the same org history.',
    pickFilter: (player, picks) => !picks.some((p) => p.player.organization === player.organization),
  },
  {
    id: 'major-winners-only',
    title: 'Major Winners Only',
    description: 'Every pick must have won a Major.',
    pickFilter: (player) => player.majorWins >= 1,
  },
  {
    id: 'ringless',
    title: 'Majorless Grinders',
    description: 'Only players without a Major win.',
    pickFilter: (player) => player.majorWins === 0,
  },
  {
    id: 'one-legend',
    title: 'One Legend, Four Stars',
    description: 'Max one player rated 94+ overall.',
    pickFilter: (player, picks, team) => {
      const ovr = team ? cardOverall(player, team) : player.ratings.overall;
      const legends = picks.filter((p) => cardOverall(p.player, p.team) >= 94).length;
      if (ovr >= 94 && legends >= 1) return false;
      return true;
    },
  },
  {
    id: 'igl-required',
    title: 'IGL Required',
    description: 'Must draft at least one IGL-primary player.',
    pickFilter: (player, picks) => {
      const hasIgl = picks.some((p) => isIglPlayer(p.player));
      const isFinalPick = picks.length === 4;
      if (isFinalPick && !hasIgl) return isIglPlayer(player);
      return true;
    },
  },
  {
    id: 'awp-meta',
    title: 'AWP Meta',
    description: 'Teams with an elite AWPer on the card.',
    filter: (ctx) => ctx.roster.some((p) => cardRatings(p, ctx.team).awpAbility >= 90),
  },
  {
    id: 'na-only',
    title: 'NA Rosters',
    description: 'North American teams only.',
    filter: (ctx) => ctx.team.region === 'NA',
  },
  {
    id: 'eu-only',
    title: 'EU Rosters',
    description: 'European teams only.',
    filter: (ctx) => ctx.team.region === 'EU',
  },
  {
    id: 'cis-only',
    title: 'CIS Power',
    description: 'CIS region teams only.',
    filter: (ctx) => ctx.team.region === 'CIS',
  },
  {
    id: 'iconic-only',
    title: 'Iconic Rosters',
    description: 'Legendary and elite team cards only.',
    filter: (ctx) => ctx.team.tier === 'legendary' || ctx.team.tier === 'elite',
  },
  {
    id: 'underdogs',
    title: 'Underdog Cards',
    description: 'Solid and underdog tier teams only.',
    filter: (ctx) => ctx.team.tier === 'solid' || ctx.team.tier === 'underdog',
  },
  {
    id: 'no-s1mple',
    title: 'No s1mple',
    description: 's1mple cannot be drafted today.',
    pickFilter: (player) => player.gamertag !== 's1mple',
  },
  {
    id: 'no-zywoo',
    title: 'No ZywOo',
    description: 'ZywOo is off limits.',
    pickFilter: (player) => player.gamertag !== 'ZywOo',
  },
  {
    id: 'no-donk',
    title: 'No donk',
    description: 'donk cannot be drafted today.',
    pickFilter: (player) => player.gamertag !== 'donk',
  },
  {
    id: 'lan-demons',
    title: 'LAN Demons',
    description: 'Only players with 88+ LAN rating.',
    pickFilter: (player, _picks, team) => cardStat(player, team, 'lan') >= 88,
  },
  {
    id: 'leaders-only',
    title: 'Leaders Only',
    description: 'Only players with 88+ leadership.',
    pickFilter: (player, _picks, team) => cardStat(player, team, 'leadership') >= 88,
  },
  {
    id: 'one-era',
    title: 'One Per Era',
    description: 'No two picks from the same team-year card.',
    pickFilter: (_player, picks, team) => {
      if (!team) return true;
      return !picks.some((p) => p.team.id === team.id);
    },
  },
  {
    id: 'support-required',
    title: 'Support Structure',
    description: 'Must draft at least one support-primary player.',
    pickFilter: (player, picks) => {
      const hasSupport = picks.some((p) => isSupportPlayer(p.player));
      const isFinalPick = picks.length === 4;
      if (isFinalPick && !hasSupport) return isSupportPlayer(player);
      return true;
    },
  },
  {
    id: 'wildcard',
    title: 'Wildcard Wednesday',
    description: 'Non-legendary teams get boosted odds today.',
    filter: (ctx) => ctx.team.tier !== 'legendary',
  },
];

export function getDailyConstraint(): DailyConstraint {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_CONSTRAINTS[dayOfYear % DAILY_CONSTRAINTS.length];
}

export function getDailyChallengeNumber(): number {
  const start = new Date('2026-01-01').getTime();
  return Math.floor((Date.now() - start) / 86400000) + 1;
}

export function teamPassesFilter(
  team: HistoricalCsTeam,
  roster: CsPlayer[],
  constraint: DailyConstraint
): boolean {
  if (!constraint.filter) return true;
  return constraint.filter({ team, roster });
}

export function playerPassesFilter(
  player: CsPlayer,
  picks: DraftPick[],
  constraint: DailyConstraint,
  team?: HistoricalCsTeam
): boolean {
  if (!constraint.pickFilter) return true;
  return constraint.pickFilter(player, picks, team);
}

export function teamHasPickablePlayer(
  team: HistoricalCsTeam,
  roster: CsPlayer[],
  constraint: DailyConstraint
): boolean {
  return roster.some((player) => playerPassesFilter(player, [], constraint, team));
}

export function estimatePercentile(score: number, majorWon: boolean, perfectRun: boolean): number {
  let base = Math.min(97, Math.max(8, (score - 72) * 2.8));
  if (majorWon) base = Math.min(99, base + 18);
  if (perfectRun) base = 99;
  return Math.round(base);
}
