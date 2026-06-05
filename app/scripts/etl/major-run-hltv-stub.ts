#!/usr/bin/env npx tsx
/**
 * HLTV ETL stub — writes sync meta when curated data is bundled.
 * Full HLTV scrape pipeline: resolve IDs → fetch team-year stats → write JSON.
 *
 * Run: npm run etl:hltv
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppTeams } from './load-major-run-teams';
import { loadAppPlayers } from './load-major-run-players';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dir, '../../src/major-run/data/generated');

function main() {
  const teams = loadAppTeams();
  const players = loadAppPlayers();
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, 'hltv-sync-meta.json'),
    JSON.stringify(
      {
        source: 'curated-baseline',
        generatedAt: new Date().toISOString(),
        teamCount: teams.length,
        playerCount: players.length,
        note: 'Gameplay uses curated players.ts + teams.ts. Run full HLTV ETL when network pipeline is ready.',
      },
      null,
      2
    )
  );
  console.log(`Wrote sync meta for ${teams.length} teams, ${players.length} players → ${OUT_DIR}`);
}

main();
