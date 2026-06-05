import type { ChemistryGrade, CsPlayer, StageId } from '../core/types';

function avg(players: CsPlayer[], key: keyof CsPlayer['ratings']): number {
  if (players.length === 0) return 0;
  return players.reduce((s, p) => s + p.ratings[key], 0) / players.length;
}

function compress(raw: number): number {
  const knee = 78;
  if (raw <= knee) return raw;
  return knee + (raw - knee) * 0.6;
}

export function computeRosterScore(players: CsPlayer[]): number {
  if (players.length === 0) return 0;

  const raw =
    avg(players, 'overall') * 0.28 +
    avg(players, 'firepower') * 0.14 +
    avg(players, 'mechanical') * 0.12 +
    avg(players, 'clutch') * 0.1 +
    avg(players, 'lan') * 0.08 +
    avg(players, 'playoffs') * 0.08 +
    avg(players, 'majorExperience') * 0.06 +
    avg(players, 'consistency') * 0.06 +
    avg(players, 'leadership') * 0.05 +
    avg(players, 'communication') * 0.03;

  return Math.round(Math.min(99.9, raw) * 10) / 10;
}

export function stageTeamPower(
  players: CsPlayer[],
  stage: StageId,
  chemistryBonus: number
): number {
  const base = avg(players, 'overall');
  const firepower = avg(players, 'firepower');
  const mechanical = avg(players, 'mechanical');
  const clutch = avg(players, 'clutch');
  const lan = avg(players, 'lan');
  const playoffs = avg(players, 'playoffs');
  const majorExp = avg(players, 'majorExperience');
  const consistency = avg(players, 'consistency');
  const leadership = avg(players, 'leadership');
  const communication = avg(players, 'communication');
  const entry = avg(players, 'entryAbility');
  const awp = avg(players, 'awpAbility');
  const support = avg(players, 'supportValue');
  const champ = avg(players, 'championshipFactor');

  let raw: number;
  switch (stage) {
    case 'opening':
      raw =
        base * 0.3 +
        consistency * 0.2 +
        mechanical * 0.18 +
        firepower * 0.15 +
        communication * 0.1 +
        leadership * 0.07;
      break;
    case 'elimination':
      raw =
        base * 0.28 +
        firepower * 0.22 +
        entry * 0.18 +
        mechanical * 0.14 +
        clutch * 0.1 +
        leadership * 0.08;
      break;
    case 'quarterfinal':
      raw =
        base * 0.26 +
        playoffs * 0.2 +
        lan * 0.18 +
        awp * 0.14 +
        clutch * 0.12 +
        majorExp * 0.1;
      break;
    case 'semifinal':
      raw =
        base * 0.24 +
        clutch * 0.2 +
        leadership * 0.16 +
        playoffs * 0.14 +
        lan * 0.12 +
        majorExp * 0.1 +
        champ * 0.04;
      break;
    case 'grand_final':
      raw =
        base * 0.22 +
        clutch * 0.18 +
        lan * 0.16 +
        playoffs * 0.14 +
        majorExp * 0.12 +
        leadership * 0.1 +
        champ * 0.1;
      break;
  }

  const weakest = Math.min(...players.map((p) => p.ratings.overall));
  const weakDrag =
    weakest < 80 ? (80 - weakest) * 0.7 : weakest < 84 ? (84 - weakest) * 0.35 : 0;

  const roleBalance =
    stage === 'elimination'
      ? entry * 0.04 + support * 0.02
      : stage === 'quarterfinal'
        ? awp * 0.04
        : 0;

  return compress(raw + chemistryBonus + roleBalance - weakDrag);
}

export function findMvp(players: CsPlayer[]): CsPlayer {
  return players.reduce((best, p) => (p.ratings.overall > best.ratings.overall ? p : best));
}

export function findWeakLink(players: CsPlayer[]): CsPlayer | null {
  if (players.length < 2) return null;
  const sorted = [...players].sort((a, b) => a.ratings.overall - b.ratings.overall);
  const weakest = sorted[0];
  if (weakest.ratings.overall >= 88) return null;
  return weakest;
}

/** Letter grade from chemistry score (-10 to +12 typical range) */
export function chemistryGrade(score: number): ChemistryGrade {
  if (score >= 8) return 'A+';
  if (score >= 6) return 'A';
  if (score >= 4.5) return 'A-';
  if (score >= 3) return 'B+';
  if (score >= 1.5) return 'B';
  if (score >= 0) return 'B-';
  if (score >= -1.5) return 'C+';
  if (score >= -3) return 'C';
  if (score >= -4.5) return 'C-';
  if (score >= -6) return 'D';
  return 'F';
}
