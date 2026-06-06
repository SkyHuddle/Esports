import type { DailyConstraint, DraftPick, HistoricalValorantTeam, ValorantPlayer } from '../core/types';
import { cardOverall, cardRatings } from '../engine/card-context';

export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isFlexIgl(player: ValorantPlayer): boolean {
  return player.primaryRole === 'flex' || player.secondaryRole === 'flex' || player.ratings.leadership >= 88;
}

function cardStat(
  player: ValorantPlayer,
  team: HistoricalValorantTeam | undefined,
  key: keyof ValorantPlayer['ratings']
): number {
  if (team) return cardRatings(player, team)[key];
  return player.ratings[key];
}

const DAILY_CONSTRAINTS: DailyConstraint[] = [
  {
    id: 'standard',
    title: 'Daily Champions Run',
    description: 'Same five iconic rosters for everyone. One attempt — no respins.',
  },
  {
    id: 'no-champions-winners',
    title: 'No Champions Winners',
    description: 'Players with a Champions title are off limits.',
    pickFilter: (player) => player.championsWins === 0,
  },
  {
    id: 'one-champions-winner',
    title: 'One Champions Winner',
    description: 'Maximum one player with a Champions title.',
    pickFilter: (player, picks) => {
      const winners = picks.filter((p) => p.player.championsWins >= 1).length;
      if (player.championsWins >= 1 && winners >= 1) return false;
      return true;
    },
  },
  {
    id: 'one-per-region',
    title: 'One Per Region',
    description: 'No two players from the same VCT region.',
    pickFilter: (player, picks) => !picks.some((p) => p.player.region === player.region),
  },
  {
    id: 'americas-only',
    title: 'Americas Only',
    description: 'Only Americas region players.',
    pickFilter: (player) => player.region === 'Americas',
    filter: (ctx) => ctx.team.region === 'Americas',
  },
  {
    id: 'emea-only',
    title: 'EMEA Only',
    description: 'Only EMEA region players.',
    pickFilter: (player) => player.region === 'EMEA',
    filter: (ctx) => ctx.team.region === 'EMEA',
  },
  {
    id: 'pacific-only',
    title: 'Pacific Only',
    description: 'Only Pacific region players.',
    pickFilter: (player) => player.region === 'Pacific',
    filter: (ctx) => ctx.team.region === 'Pacific',
  },
  {
    id: 'china-only',
    title: 'China Only',
    description: 'Only China region players.',
    pickFilter: (player) => player.region === 'China',
    filter: (ctx) => ctx.team.region === 'China',
  },
  {
    id: 'no-duelist',
    title: 'No Duelist Mains',
    description: 'Cannot draft primary duelists.',
    pickFilter: (player) => player.primaryRole !== 'duelist',
  },
  {
    id: 'no-sentinel',
    title: 'No Sentinels',
    description: 'Cannot draft primary sentinels.',
    pickFilter: (player) => player.primaryRole !== 'sentinel',
  },
  {
    id: 'one-per-org',
    title: 'One Per Organization',
    description: 'No two players from the same org history.',
    pickFilter: (player, picks) => !picks.some((p) => p.player.organization === player.organization),
  },
  {
    id: 'one-per-team',
    title: 'One Player Per Team',
    description: 'No two picks from the same team-year card.',
    pickFilter: (_player, picks, team) => {
      if (!team) return true;
      return !picks.some((p) => p.team.id === team.id);
    },
  },
  {
    id: 'masters-winners-only',
    title: 'Masters Winners Only',
    description: 'Every pick must have won a Masters.',
    pickFilter: (player) => player.mastersWins >= 1,
  },
  {
    id: 'underdog-run',
    title: 'Underdog Run',
    description: 'Solid and underdog tier teams only.',
    filter: (ctx) => ctx.team.tier === 'solid' || ctx.team.tier === 'underdog',
  },
  {
    id: 'iconic-only',
    title: 'Iconic Rosters',
    description: 'Legendary and elite team cards only.',
    filter: (ctx) => ctx.team.tier === 'legendary' || ctx.team.tier === 'elite',
  },
  {
    id: '2021-2022-only',
    title: '2021-2022 Only',
    description: 'Only rosters from 2021-2022.',
    filter: (ctx) => ctx.team.season >= 2021 && ctx.team.season <= 2022,
  },
  {
    id: '2023-2024-only',
    title: '2023-2024 Only',
    description: 'Only rosters from 2023-2024.',
    filter: (ctx) => ctx.team.season >= 2023 && ctx.team.season <= 2024,
  },
  {
    id: 'igl-required',
    title: 'IGL Required',
    description: 'Must draft at least one flex/IGL player.',
    pickFilter: (player, picks) => {
      const hasIgl = picks.some((p) => isFlexIgl(p.player));
      const isFinalPick = picks.length === 4;
      if (isFinalPick && !hasIgl) return isFlexIgl(player);
      return true;
    },
  },
  {
    id: 'no-aspas',
    title: 'No aspas',
    description: 'aspas cannot be drafted today.',
    pickFilter: (player) => player.gamertag !== 'aspas',
  },
  {
    id: 'no-tenz',
    title: 'No TenZ',
    description: 'TenZ is off limits.',
    pickFilter: (player) => player.gamertag !== 'TenZ',
  },
  {
    id: 'no-yay',
    title: 'No yay',
    description: 'yay cannot be drafted today.',
    pickFilter: (player) => player.gamertag !== 'yay',
  },
  {
    id: 'lan-demons',
    title: 'LAN Demons',
    description: 'Only players with 88+ LAN rating.',
    pickFilter: (player, _picks, team) => cardStat(player, team, 'lan') >= 88,
  },
  {
    id: 'one-rookie',
    title: 'One Rookie Required',
    description: 'Must include at least one player rated under 87.',
    pickFilter: (player, picks, team) => {
      const hasRookie = picks.some((p) => cardOverall(p.player, p.team) < 87);
      const isFinalPick = picks.length === 4;
      const ovr = team ? cardOverall(player, team) : player.ratings.overall;
      if (isFinalPick && !hasRookie) return ovr < 87;
      return true;
    },
  },
  {
    id: 'no-superteams',
    title: 'No Superteams',
    description: 'Legendary tier team cards are off the board.',
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
  team: HistoricalValorantTeam,
  roster: ValorantPlayer[],
  constraint: DailyConstraint
): boolean {
  if (!constraint.filter) return true;
  return constraint.filter({ team, roster });
}

export function playerPassesFilter(
  player: ValorantPlayer,
  picks: DraftPick[],
  constraint: DailyConstraint,
  team?: HistoricalValorantTeam
): boolean {
  if (!constraint.pickFilter) return true;
  return constraint.pickFilter(player, picks, team);
}

export function teamHasPickablePlayer(
  team: HistoricalValorantTeam,
  roster: ValorantPlayer[],
  constraint: DailyConstraint
): boolean {
  return roster.some((player) => playerPassesFilter(player, [], constraint, team));
}

export function estimatePercentile(score: number, championsWon: boolean, perfectRun: boolean): number {
  let base = Math.min(97, Math.max(8, (score - 72) * 2.8));
  if (championsWon) base = Math.min(99, base + 18);
  if (perfectRun) base = 99;
  return Math.round(base);
}
