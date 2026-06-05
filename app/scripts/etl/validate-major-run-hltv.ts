#!/usr/bin/env npx tsx
/** Validates team-year HLTV overlay coverage and card-context wiring. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CS_TEAMS } from '../../src/major-run/data/teams';
import { getPlayerById } from '../../src/major-run/data/players';
import { rosterPlayerIds } from '../../src/major-run/data/roster-slots';
import { cardOverall } from '../../src/major-run/engine/card-context';
import { getTeamYearRatings, teamYearOverlayKey } from '../../src/major-run/data/rating-overlays';
import { overlayKey } from './major-run/major-event-windows';

const __dir = dirname(fileURLToPath(import.meta.url));
const RATINGS_FILE = join(__dir, '../../src/major-run/data/generated/hltv-ratings.json');

interface HltvFile {
  meta: { rosterEntryCount: number; liveFetched: number; reference: number; estimated: number };
  entries: Record<string, { source: string; ratings: { overall: number } }>;
}

function main() {
  const bundle = JSON.parse(readFileSync(RATINGS_FILE, 'utf8')) as HltvFile;
  let missing = 0;
  let cardMissing = 0;
  const teams = CS_TEAMS.filter((t) => Object.keys(t.roster).length >= 5);

  for (const team of teams) {
    for (const playerId of rosterPlayerIds(team.roster)) {
      const key = overlayKey(team.id, playerId);
      if (!bundle.entries[key]) {
        missing++;
        console.error(`MISSING entry: ${key}`);
      }
      const player = getPlayerById(playerId);
      if (!player) {
        console.error(`MISSING player: ${playerId}`);
        continue;
      }
      if (!getTeamYearRatings(player, team)) {
        cardMissing++;
        console.error(`MISSING overlay lookup: ${key}`);
      }
    }
  }

  const s1mple21 = bundle.entries[overlayKey('navi-2021', 's1mple')]?.ratings.overall;
  const s1mple16 = bundle.entries[overlayKey('liquid-2016', 's1mple-16')]?.ratings.overall;
  if (s1mple21 != null && s1mple16 != null && s1mple21 <= s1mple16) {
    console.error(`ERA CHECK FAILED: Stockholm s1mple (${s1mple21}) should beat 2016 Liquid (${s1mple16})`);
    process.exit(1);
  }

  const p = getPlayerById('s1mple');
  const t21 = CS_TEAMS.find((x) => x.id === 'navi-2021')!;
  const t16 = CS_TEAMS.find((x) => x.id === 'liquid-2016')!;
  if (p && cardOverall(p, t21) <= cardOverall(getPlayerById('s1mple-16')!, t16)) {
    console.error('cardOverall era check failed');
    process.exit(1);
  }

  console.log('HLTV validation OK');
  console.log('  entries:', Object.keys(bundle.entries).length, 'expected:', teams.length * 5);
  console.log('  meta:', bundle.meta);
  console.log('  s1mple Stockholm OVR:', s1mple21, '| 2016 Liquid OVR:', s1mple16);
  console.log('  overlay key sample:', teamYearOverlayKey('navi-2021', 's1mple'));

  if (missing > 0 || cardMissing > 0) {
    process.exit(1);
  }

  let dupRosters = 0;
  for (const team of teams) {
    const ovrs = rosterPlayerIds(team.roster).map((id) => {
      const p = getPlayerById(id);
      return p ? cardOverall(p, team) : -1;
    });
    if (new Set(ovrs).size < ovrs.length) {
      dupRosters++;
      console.error(`DUPLICATE OVR on ${team.id}:`, ovrs);
    }
  }
  if (dupRosters > 0) {
    console.error(`Found ${dupRosters} teams with duplicate player OVRs`);
    process.exit(1);
  }
}

main();
