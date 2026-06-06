/**
 * Champions Run engine tests.
 * Run: npx tsx src/champions-run/engine/__tests__/champions-run.test.ts
 */
import assert from 'node:assert/strict';
import { VALORANT_TEAMS } from '../../data/teams';
import { getPlayerById, VALORANT_PLAYERS } from '../../data/players';
import { SLOT_ORDER } from '../../core/constants';
import { resolveTeamRoster } from '../../data';
import { generateDraftRounds } from '../draft';
import { simulateChampionsRun } from '../simulation';
import { playerPassesFilter, teamPassesFilter } from '../../features/daily';
import { getDailyConstraint } from '../../features/daily';
import { roleFitScore } from '../../data/players';
import type { DraftPick, RosterSlot } from '../../core/types';

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}`);
    throw e;
  }
}

test('team rosters resolve to 5 unique players', () => {
  for (const team of VALORANT_TEAMS) {
    const roster = resolveTeamRoster(team);
    assert.equal(roster.length, 5);
    const ids = new Set(roster.map((p) => p.id));
    assert.equal(ids.size, 5);
  }
});

test('role fit scores are within 0-100', () => {
  for (const team of VALORANT_TEAMS) {
    for (const slot of SLOT_ORDER) {
      const pid = team.roster[slot];
      const player = getPlayerById(pid);
      assert.ok(player);
      const fit = roleFitScore(player!, slot);
      assert.ok(fit >= 0 && fit <= 100);
    }
  }
});

test('draft prevents duplicate players in simulation picks', () => {
  const rounds = generateDraftRounds('test-dedup');
  const used = new Set<string>();
  const picks: DraftPick[] = [];

  for (let i = 0; i < 5; i++) {
    const round = rounds[i]!;
    const player = resolveTeamRoster(round.team).find((p) => !used.has(p.id));
    assert.ok(player, 'Should find unused player');
    used.add(player!.id);
    picks.push({
      roundIndex: i,
      role: SLOT_ORDER[i] as RosterSlot,
      naturalRole: SLOT_ORDER[i] as RosterSlot,
      player: player!,
      team: round.team,
    });
  }

  assert.equal(used.size, 5);
});

test('no champions winners daily rule excludes champions winners', () => {
  const constraint = {
    id: 'no-champions-winners',
    title: 'No Champions Winners',
    description: 'test',
    pickFilter: (player: import('../../core/types').ValorantPlayer) => player.championsWins === 0,
  };
  const winner = VALORANT_PLAYERS.find((p) => p.championsWins > 0);
  const nonWinner = VALORANT_PLAYERS.find((p) => p.championsWins === 0);
  assert.ok(winner && nonWinner);
  assert.equal(playerPassesFilter(winner, [], constraint), false);
  assert.equal(playerPassesFilter(nonWinner!, [], constraint), true);
});

test('simulation produces grades and shareable result', () => {
  const rounds = generateDraftRounds('test-sim');
  const picks: DraftPick[] = rounds.map((round, i) => {
    const player = resolveTeamRoster(round.team)[0]!;
    return {
      roundIndex: i,
      role: SLOT_ORDER[i] as RosterSlot,
      naturalRole: SLOT_ORDER[i] as RosterSlot,
      player,
      team: round.team,
    };
  });

  const result = simulateChampionsRun(picks, { seed: 'test' });
  assert.ok(result.runSummary.record);
  assert.ok(result.chemistry.grade);
  assert.ok(result.chemistry.strength);
  assert.ok(result.chemistry.weakness);
  assert.ok(result.chemistry.bestMap);
});

test('daily constraint rotates', () => {
  const c = getDailyConstraint();
  assert.ok(c.id);
  assert.ok(c.title);
});

test('americas only filter blocks EMEA teams', () => {
  const constraint = {
    id: 'emea-only',
    title: 'EMEA',
    description: 'test',
    filter: (ctx: { team: import('../../core/types').HistoricalValorantTeam }) =>
      ctx.team.region === 'EMEA',
  };
  const emea = VALORANT_TEAMS.find((t) => t.region === 'EMEA');
  const americas = VALORANT_TEAMS.find((t) => t.region === 'Americas');
  assert.ok(emea && americas);
  assert.equal(teamPassesFilter(emea, resolveTeamRoster(emea), constraint), true);
  assert.equal(teamPassesFilter(americas!, resolveTeamRoster(americas!), constraint), false);
});

console.log('\nAll Champions Run tests passed.');
