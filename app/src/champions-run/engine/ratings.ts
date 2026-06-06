import type { ChemistryGrade, StageId, ValorantPlayer } from '../core/types';
import { roleFitForSlot } from './card-context';
import type { DraftPick } from '../core/types';

function avg(players: ValorantPlayer[], key: keyof ValorantPlayer['ratings']): number {
  if (players.length === 0) return 0;
  return players.reduce((s, p) => s + p.ratings[key], 0) / players.length;
}

export function computeRosterScore(players: ValorantPlayer[]): number {
  if (players.length === 0) return 0;

  const raw =
    avg(players, 'overall') * 0.28 +
    avg(players, 'firepower') * 0.14 +
    avg(players, 'utility') * 0.12 +
    avg(players, 'clutch') * 0.1 +
    avg(players, 'lan') * 0.08 +
    avg(players, 'playoffs') * 0.08 +
    avg(players, 'international') * 0.06 +
    avg(players, 'consistency') * 0.06 +
    avg(players, 'leadership') * 0.05 +
    avg(players, 'communication') * 0.03;

  return Math.round(Math.min(99.9, raw) * 10) / 10;
}

export function stageTeamPower(
  players: ValorantPlayer[],
  stage: StageId,
  chemistryBonus: number
): number {
  const base = avg(players, 'overall');
  const firepower = avg(players, 'firepower');
  const utility = avg(players, 'utility');
  const clutch = avg(players, 'clutch');
  const lan = avg(players, 'lan');
  const playoffs = avg(players, 'playoffs');
  const international = avg(players, 'international');
  const consistency = avg(players, 'consistency');
  const leadership = avg(players, 'leadership');
  const communication = avg(players, 'communication');
  const firstKill = avg(players, 'firstKillPressure');
  const champ = avg(players, 'championshipFactor');

  let raw: number;
  switch (stage) {
    case 'swiss':
      raw =
        base * 0.3 +
        consistency * 0.2 +
        utility * 0.18 +
        firepower * 0.15 +
        communication * 0.1 +
        leadership * 0.07;
      break;
    case 'playoffs':
      raw =
        base * 0.28 +
        firepower * 0.22 +
        firstKill * 0.18 +
        utility * 0.14 +
        clutch * 0.1 +
        leadership * 0.08;
      break;
    case 'semifinal':
      raw =
        base * 0.26 +
        playoffs * 0.2 +
        lan * 0.18 +
        international * 0.14 +
        clutch * 0.12 +
        utility * 0.1;
      break;
    case 'grand_final':
      raw =
        base * 0.24 +
        clutch * 0.2 +
        lan * 0.18 +
        firepower * 0.16 +
        leadership * 0.12 +
        champ * 0.1;
      break;
    case 'champions':
    default:
      raw =
        base * 0.22 +
        champ * 0.2 +
        clutch * 0.18 +
        firepower * 0.16 +
        international * 0.14 +
        leadership * 0.1;
      break;
  }

  return raw + chemistryBonus;
}

export function chemistryGrade(score: number): ChemistryGrade {
  if (score >= 8) return 'S+';
  if (score >= 6) return 'S';
  if (score >= 4.5) return 'A+';
  if (score >= 3) return 'A';
  if (score >= 1.5) return 'A-';
  if (score >= 0) return 'B+';
  if (score >= -1.5) return 'B';
  if (score >= -3) return 'B-';
  if (score >= -4.5) return 'C+';
  if (score >= -6) return 'C';
  if (score >= -8) return 'D';
  return 'F';
}

export function statGrade(value: number): ChemistryGrade {
  if (value >= 92) return 'S';
  if (value >= 88) return 'A+';
  if (value >= 84) return 'A';
  if (value >= 80) return 'B+';
  if (value >= 76) return 'B';
  if (value >= 72) return 'C+';
  if (value >= 68) return 'C';
  return 'D';
}

export function computeRoleFitGrade(picks: DraftPick[]): ChemistryGrade {
  if (picks.length === 0) return 'C';
  const fits = picks.map((p) => roleFitForSlot(p.player, p.role));
  const avgFit = fits.reduce((a, b) => a + b, 0) / fits.length;
  return statGrade(avgFit);
}

export function findMvp(players: ValorantPlayer[]): ValorantPlayer {
  return [...players].sort(
    (a, b) =>
      b.ratings.overall * 0.5 +
      b.ratings.firepower * 0.3 +
      b.ratings.clutch * 0.2 -
      (a.ratings.overall * 0.5 + a.ratings.firepower * 0.3 + a.ratings.clutch * 0.2)
  )[0];
}

export function findWeakLink(players: ValorantPlayer[]): ValorantPlayer | null {
  if (players.length < 5) return null;
  return [...players].sort((a, b) => a.ratings.overall - b.ratings.overall)[0];
}

export function inferMapScores(players: ValorantPlayer[]): { best: string; worst: string } {
  const maps = ['Haven', 'Ascent', 'Lotus', 'Bind', 'Icebox', 'Sunset', 'Pearl'];
  const rng = players.reduce((s, p) => s + p.ratings.overall, 0) % maps.length;
  const best = maps[rng]!;
  const worst = maps[(rng + 3) % maps.length]!;
  return { best, worst };
}
