import type { CsRole, PlayerRatings } from '../../../src/major-run/core/types';

export interface HltvStatSnapshot {
  rating2: number;
  kdRatio: number;
  adr?: number;
  mapsPlayed: number;
  openingKillRatio?: number;
  openingKillRating?: number;
  sniperKillShare?: number;
  savedTeammatesPerRound?: number;
}

export interface MapRatingsInput {
  role: CsRole;
  stats: HltvStatSnapshot;
  majorWins: number;
  mvps: number;
}

function clamp(min: number, max: number, n: number): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/** HLTV Rating 2.0 (~0.75–1.35) → game overall (~68–99). Uses finer steps to reduce collisions. */
export function hltvRatingToOverall(rating2: number): number {
  return clamp(68, 99, Math.round(83 + (rating2 - 1.0) * 36));
}

export function overallToRating2(overall: number): number {
  return Math.round((1.0 + (overall - 83) / 36) * 1000) / 1000;
}

export function mapHltvStatsToRatings(input: MapRatingsInput): PlayerRatings {
  const { role, stats, majorWins, mvps } = input;
  const rating2 = stats.rating2;
  const overall = hltvRatingToOverall(rating2);
  const kdBoost = clamp(-4, 6, (stats.kdRatio - 1.05) * 12);
  const adrBoost = stats.adr ? clamp(-3, 5, (stats.adr - 78) * 0.15) : 0;
  const openBoost = stats.openingKillRatio
    ? clamp(-3, 8, (stats.openingKillRatio - 1.0) * 10)
    : 0;
  const sniperBoost = stats.sniperKillShare
    ? clamp(0, 12, stats.sniperKillShare * 18)
    : 0;
  const supportBoost = stats.savedTeammatesPerRound
    ? clamp(-2, 6, (stats.savedTeammatesPerRound - 0.08) * 40)
    : 0;

  const firepower = clamp(68, 99, overall + kdBoost * 0.6 + adrBoost * 0.4);
  const mechanical = clamp(68, 99, overall + adrBoost * 0.5 + kdBoost * 0.3);
  const clutch = clamp(68, 99, overall + (rating2 > 1.15 ? 2 : rating2 < 0.95 ? -2 : 0));
  const lan = clamp(68, 99, overall + majorWins * 1.2);
  const playoffs = clamp(68, 99, overall + majorWins * 0.8 + mvps * 1.5);
  const majorExperience = clamp(68, 99, overall - 2 + majorWins * 2.5 + mvps);
  const consistency = clamp(68, 99, overall + (stats.mapsPlayed >= 40 ? 1 : stats.mapsPlayed < 15 ? -2 : 0));
  const communication = clamp(68, 99, overall - 3 + supportBoost * 0.4);
  const leadership =
    role === 'igl'
      ? clamp(72, 99, overall + 4 + majorWins * 2)
      : clamp(68, 96, overall - 4 + majorWins);
  const entryAbility =
    role === 'entry' || role === 'awper'
      ? clamp(68, 99, overall + openBoost)
      : clamp(68, 94, overall - 2 + openBoost * 0.4);
  const awpAbility =
    role === 'awper' || sniperBoost > 4
      ? clamp(72, 99, overall + sniperBoost)
      : clamp(65, 88, overall - 8 + sniperBoost * 0.3);
  const supportValue =
    role === 'support' || role === 'igl'
      ? clamp(68, 99, overall + supportBoost + (role === 'support' ? 2 : 0))
      : clamp(68, 92, overall - 3 + supportBoost);
  const anchorAbility =
    role === 'lurker' || role === 'support'
      ? clamp(68, 99, overall + (role === 'lurker' ? 2 : 0) + supportBoost * 0.5)
      : clamp(68, 92, overall - 1);
  const championshipFactor = clamp(70, 99, overall + majorWins * 2.5 + mvps * 2);

  return {
    overall,
    firepower,
    mechanical,
    clutch,
    lan,
    playoffs,
    majorExperience,
    consistency,
    communication,
    leadership,
    entryAbility,
    awpAbility,
    supportValue,
    anchorAbility,
    championshipFactor,
  };
}

export function shiftRatingsOverall(ratings: PlayerRatings, delta: number): PlayerRatings {
  const bump = (v: number, w = 0.85) => clamp(68, 99, Math.round(v + delta * w));
  return {
    overall: clamp(68, 99, ratings.overall + delta),
    firepower: bump(ratings.firepower),
    mechanical: bump(ratings.mechanical),
    clutch: bump(ratings.clutch),
    lan: bump(ratings.lan),
    playoffs: bump(ratings.playoffs),
    majorExperience: bump(ratings.majorExperience),
    consistency: bump(ratings.consistency),
    communication: bump(ratings.communication),
    leadership: bump(ratings.leadership, 0.7),
    entryAbility: bump(ratings.entryAbility),
    awpAbility: bump(ratings.awpAbility),
    supportValue: bump(ratings.supportValue),
    anchorAbility: bump(ratings.anchorAbility),
    championshipFactor: bump(ratings.championshipFactor, 0.7),
  };
}

/** Nudge duplicate overalls within a 5-man roster so every player has a distinct OVR. */
export function ensureUniqueRosterOveralls<T extends { ratings: PlayerRatings; hltv: HltvStatSnapshot }>(
  entries: T[]
): void {
  const sorted = [...entries].sort((a, b) => b.ratings.overall - a.ratings.overall);
  const used = new Set<number>();
  for (const entry of sorted) {
    let ovr = entry.ratings.overall;
    while (used.has(ovr) && ovr > 68) ovr -= 1;
    while (used.has(ovr) && ovr < 99) ovr += 1;
    used.add(ovr);
    const delta = ovr - entry.ratings.overall;
    if (delta !== 0) {
      entry.ratings = shiftRatingsOverall(entry.ratings, delta);
      entry.hltv = { ...entry.hltv, rating2: overallToRating2(ovr) };
    }
  }
}

/** Convert hltv package stats into our snapshot shape. */
export function snapshotFromHltvPackage(stats: {
  overviewStatistics: {
    kdRatio: number;
    damagePerRound?: number;
    mapsPlayed: number;
    rating2?: number;
    rating1?: number;
    savedTeammatesPerRound?: number;
  };
  individualStatistics: {
    openingKillRatio: number;
    openingKillRating: number;
    sniperKills: number;
    rifleKills: number;
  };
}): HltvStatSnapshot {
  const totalKills =
    stats.individualStatistics.rifleKills +
    stats.individualStatistics.sniperKills +
    1;
  const sniperKillShare = stats.individualStatistics.sniperKills / totalKills;

  return {
    rating2: stats.overviewStatistics.rating2 ?? stats.overviewStatistics.rating1 ?? 1.0,
    kdRatio: stats.overviewStatistics.kdRatio,
    adr: stats.overviewStatistics.damagePerRound,
    mapsPlayed: stats.overviewStatistics.mapsPlayed,
    openingKillRatio: stats.individualStatistics.openingKillRatio,
    openingKillRating: stats.individualStatistics.openingKillRating,
    sniperKillShare,
    savedTeammatesPerRound: stats.overviewStatistics.savedTeammatesPerRound,
  };
}
