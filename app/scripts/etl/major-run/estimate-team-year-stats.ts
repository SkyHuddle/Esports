import type { CsRole } from '../../../src/major-run/core/types';
import type { HltvStatSnapshot } from './map-ratings';

export interface EstimatePlayerInput {
  playerId: string;
  gamertag: string;
  primaryRole: CsRole;
  baseOverall: number;
}

export interface EstimateTeamInput {
  teamYearId: string;
  teamRating: number;
  tier: string;
  players: EstimatePlayerInput[];
}

const ROLE_SNIPER_SHARE: Record<CsRole, number> = {
  awper: 0.42,
  igl: 0.08,
  entry: 0.05,
  lurker: 0.06,
  support: 0.04,
};

const ROLE_OPENING: Record<CsRole, number> = {
  entry: 1.08,
  awper: 1.02,
  igl: 0.94,
  lurker: 0.96,
  support: 0.88,
};

const ROLE_OVR_BIAS: Record<CsRole, number> = {
  awper: 2,
  entry: 1,
  lurker: 0,
  support: -1,
  igl: -2,
};

function clamp(min: number, max: number, n: number): number {
  return Math.max(min, Math.min(max, n));
}

function overallToRating2(overall: number): number {
  return Math.round((1.0 + (overall - 83) / 36) * 1000) / 1000;
}

/** Calibrate per-player overalls for a roster — always unique, spread scales with team strength. */
export function estimateTeamYearStats(team: EstimateTeamInput): Map<string, HltvStatSnapshot> {
  const n = team.players.length;
  const floor = team.tier === 'underdog' ? 68 : team.tier === 'solid' ? 72 : 74;
  const ceiling = team.tier === 'legendary' ? 97 : team.tier === 'elite' ? 95 : 92;

  const ranked = team.players
    .map((p) => ({
      ...p,
      weight:
        Math.pow(Math.max(65, p.baseOverall) / 82, 1.25) + (ROLE_OVR_BIAS[p.primaryRole] ?? 0) * 0.08,
    }))
    .sort((a, b) => b.weight - a.weight);

  const targetAvg = team.teamRating * 0.94;
  const spread = clamp(n - 1, 14, Math.round(team.teamRating * 0.14));

  let high = clamp(Math.round(targetAvg + spread * 0.35), floor + n - 1, ceiling);
  let low = high - (n - 1);
  if (low < floor) {
    low = floor;
    high = Math.min(ceiling, low + (n - 1));
  }

  const ladder = ranked.map((player, rank) =>
    clamp(floor, ceiling, high - rank + Math.round((ROLE_OVR_BIAS[player.primaryRole] ?? 0) * 0.4))
  );
  ladder.sort((a, b) => b - a);

  const used = new Set<number>();
  const finalOvrs: number[] = [];
  for (const ovr of ladder) {
    let v = ovr;
    while (used.has(v) && v > floor) v -= 1;
    while (used.has(v) && v < ceiling) v += 1;
    v = clamp(floor, ceiling, v);
    finalOvrs.push(v);
    used.add(v);
  }

  const out = new Map<string, HltvStatSnapshot>();
  ranked.forEach((player, i) => {
    const overall = finalOvrs[i];
    const rating2 = overallToRating2(overall);
    const kdRatio = Math.round((0.82 + (overall - 70) * 0.018) * 100) / 100;
    const adr = Math.round((68 + (overall - 70) * 0.55) * 10) / 10;
    const mapsPlayed = team.tier === 'underdog' ? 18 : team.tier === 'legendary' ? 42 : 28;

    out.set(player.playerId, {
      rating2,
      kdRatio,
      adr,
      mapsPlayed,
      openingKillRatio: ROLE_OPENING[player.primaryRole],
      sniperKillShare: ROLE_SNIPER_SHARE[player.primaryRole],
      savedTeammatesPerRound: player.primaryRole === 'support' ? 0.1 : 0.07,
    });
  });

  return out;
}
