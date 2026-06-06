/**
 * Validates Champions Run VALORANT seed data integrity.
 */
import { VALORANT_TEAMS } from '../../src/champions-run/data/teams';
import { VALORANT_PLAYERS, getPlayerById } from '../../src/champions-run/data/players';
import { SLOT_ORDER } from '../../src/champions-run/core/constants';
import { resolveTeamRoster } from '../../src/champions-run/data';
import { generateDraftRounds } from '../../src/champions-run/engine/draft';
import { simulateChampionsRun } from '../../src/champions-run/engine/simulation';
import type { DraftPick, RosterSlot } from '../../src/champions-run/core/types';

let errors = 0;

function fail(msg: string): void {
  console.error(`FAIL: ${msg}`);
  errors += 1;
}

function ok(msg: string): void {
  console.log(`OK: ${msg}`);
}

// Every team-year has 5 valid roster slots
for (const team of VALORANT_TEAMS) {
  for (const slot of SLOT_ORDER) {
    const pid = team.roster[slot];
    if (!pid) fail(`${team.id} missing slot ${slot}`);
    else if (!getPlayerById(pid)) fail(`${team.id} slot ${slot} references unknown player ${pid}`);
  }

  const roster = resolveTeamRoster(team);
  if (roster.length !== 5) fail(`${team.id} resolves to ${roster.length} players, expected 5`);
}

ok(`${VALORANT_TEAMS.length} team-years validated`);

// Every player has at least one role confidence >= 50
for (const player of VALORANT_PLAYERS) {
  const maxFit = Math.max(...Object.values(player.roleConfidence));
  if (maxFit < 50) fail(`${player.id} has no role confidence >= 50`);
  if (player.ratings.overall < 50 || player.ratings.overall > 99) {
    fail(`${player.id} overall rating out of range: ${player.ratings.overall}`);
  }
}

ok(`${VALORANT_PLAYERS.length} players validated`);

// Draft generation produces 5 rounds with pickable players
const rounds = generateDraftRounds('validate-seed-test');
if (rounds.length !== 5) fail(`Draft generated ${rounds.length} rounds, expected 5`);

const usedPlayers = new Set<string>();
const picks: DraftPick[] = [];

for (let i = 0; i < rounds.length; i++) {
  const round = rounds[i]!;
  const roster = resolveTeamRoster(round.team);
  const openSlot = SLOT_ORDER[i] as RosterSlot;
  const player = roster.find((p) => !usedPlayers.has(p.id));
  if (!player) fail(`Round ${i} has no available player`);
  else {
    usedPlayers.add(player.id);
    picks.push({
      roundIndex: i,
      role: openSlot,
      naturalRole: openSlot,
      player,
      team: round.team,
    });
  }
}

ok('Draft round generation produces valid picks');

// Simulation returns valid result
const sim = simulateChampionsRun(picks, { seed: 'validate-sim' });
if (!sim.runSummary.record.match(/^\d+-\d+$/)) fail(`Invalid record: ${sim.runSummary.record}`);
if (!sim.chemistry.grade) fail('Missing chemistry grade');
if (!sim.mvp) fail('Missing MVP');

ok(`Simulation: ${sim.runSummary.runTitle} · ${sim.runSummary.record} · Grade ${sim.chemistry.grade}`);

// Team pool size check
if (VALORANT_TEAMS.length < 15) fail(`Only ${VALORANT_TEAMS.length} teams — need at least 15 for variety`);

if (errors > 0) {
  console.error(`\n${errors} validation error(s)`);
  process.exit(1);
}

console.log('\nAll Champions Run data validations passed.');
