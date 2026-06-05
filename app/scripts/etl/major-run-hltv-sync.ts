#!/usr/bin/env npx tsx
/**
 * HLTV ETL — per team-year player stats with major-era date windows.
 *
 * Usage:
 *   npm run etl:hltv              # reference + calibrated estimates (offline)
 *   npm run etl:hltv:live         # live HLTV scrape where network allows
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hltv } from './major-run/hltv-client';
import { CS_PLAYERS } from '../../src/major-run/data/players';
import type { CsRole, PlayerRatings } from '../../src/major-run/core/types';
import { loadRosterEntries, type RosterEntry } from './load-major-run-rosters';
import { resolveHltvId } from './major-run/hltv-ids';
import { getTeamYearWindow, overlayKey } from './major-run/major-event-windows';
import {
  mapHltvStatsToRatings,
  snapshotFromHltvPackage,
  ensureUniqueRosterOveralls,
  type HltvStatSnapshot,
} from './major-run/map-ratings';
import { lookupReferenceStats } from './major-run/hltv-reference-stats';
import { estimateTeamYearStats } from './major-run/estimate-team-year-stats';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dir, '../../src/major-run/data/generated');
const OUT_FILE = join(OUT_DIR, 'hltv-ratings.json');
const META_FILE = join(OUT_DIR, 'hltv-sync-meta.json');

const args = new Set(process.argv.slice(2));
const LIVE_ONLY = args.has('--live');
const OFFLINE = args.has('--offline') || !args.has('--live');
const DRY_RUN = args.has('--dry-run');
const MAX_LIVE = parseInt(
  process.argv.find((a) => a.startsWith('--max-live='))?.split('=')[1] ?? '400',
  10
);
const REQUEST_DELAY_MS = 1200;
const FETCH_TIMEOUT_MS = 8000;
const LIVE_ABORT_AFTER_FAILURES = 5;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type HltvEntrySource = 'hltv-live' | 'hltv-cache' | 'hltv-reference' | 'hltv-estimated';

export interface HltvTeamYearEntry {
  key: string;
  playerId: string;
  gamertag: string;
  teamYearId: string;
  teamName: string;
  season: number;
  window: { startDate: string; endDate: string; eventLabel: string };
  hltvId?: number;
  hltv: HltvStatSnapshot;
  ratings: PlayerRatings;
  source: HltvEntrySource;
  syncedAt: string;
}

export interface HltvRatingsFile {
  meta: {
    source: string;
    generatedAt: string;
    rosterEntryCount: number;
    teamCount: number;
    liveFetched: number;
    cached: number;
    reference: number;
    estimated: number;
  };
  entries: Record<string, HltvTeamYearEntry>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function loadExisting(): HltvRatingsFile | null {
  if (!existsSync(OUT_FILE)) return null;
  try {
    const raw = JSON.parse(readFileSync(OUT_FILE, 'utf8')) as HltvRatingsFile & {
      players?: Record<string, unknown>;
    };
    if (raw.entries) return raw;
    return null;
  } catch {
    return null;
  }
}

function basePlayer(playerId: string) {
  return CS_PLAYERS.find((p) => p.id === playerId);
}

async function fetchHltvStats(
  hltvId: number,
  startDate: string,
  endDate: string
): Promise<HltvStatSnapshot | null> {
  try {
    const stats = await withTimeout(
      hltv.getPlayerStats({
        id: hltvId,
        startDate,
        endDate,
        matchType: 'LanOnly',
      }),
      FETCH_TIMEOUT_MS,
      `getPlayerStats(${hltvId})`
    );
    if (!stats.overviewStatistics.mapsPlayed) return null;
    return snapshotFromHltvPackage(stats);
  } catch (err) {
    console.warn(`  fetch failed hltvId=${hltvId}:`, (err as Error).message);
    return null;
  }
}

async function resolveId(gamertag: string): Promise<number | undefined> {
  const known = resolveHltvId(gamertag);
  if (known) return known;
  try {
    const player = await withTimeout(
      hltv.getPlayerByName({ name: gamertag }),
      FETCH_TIMEOUT_MS,
      `getPlayerByName(${gamertag})`
    );
    return player.id;
  } catch {
    return undefined;
  }
}

function groupRosters(entries: RosterEntry[]): Map<string, RosterEntry[]> {
  const map = new Map<string, RosterEntry[]>();
  for (const e of entries) {
    const list = map.get(e.teamYearId) ?? [];
    list.push(e);
    map.set(e.teamYearId, list);
  }
  return map;
}

function buildEstimatedForTeam(roster: RosterEntry[]): Map<string, HltvStatSnapshot> {
  const head = roster[0];
  const players = roster
    .map((r) => basePlayer(r.playerId))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({
      playerId: p.id,
      gamertag: p.gamertag,
      primaryRole: p.primaryRole as CsRole,
      baseOverall: p.ratings.overall,
    }));

  return estimateTeamYearStats({
    teamYearId: head.teamYearId,
    teamRating: head.teamRating,
    tier: head.tier,
    players,
  });
}

async function main() {
  const rosterEntries = loadRosterEntries();
  const existing = loadExisting();
  const existingEntries = existing?.entries ?? {};
  const byTeam = groupRosters(rosterEntries);

  const outputEntries: Record<string, HltvTeamYearEntry> = {};
  let liveFetched = 0;
  let cached = 0;
  let reference = 0;
  let estimated = 0;
  let liveAttempts = 0;
  let attemptedLive = false;
  let liveFailures = 0;
  let liveDisabled = false;
  const fetchCache = new Map<string, HltvStatSnapshot | null>();

  async function fetchCached(
    hltvId: number,
    startDate: string,
    endDate: string
  ): Promise<HltvStatSnapshot | null> {
    if (liveDisabled) return null;
    const cacheKey = `${hltvId}::${startDate}::${endDate}`;
    if (fetchCache.has(cacheKey)) return fetchCache.get(cacheKey) ?? null;
    if (liveAttempts >= MAX_LIVE) return null;
    liveAttempts++;
    const stats = await fetchHltvStats(hltvId, startDate, endDate);
    fetchCache.set(cacheKey, stats);
    if (stats) {
      liveFailures = 0;
    } else {
      liveFailures++;
      if (liveFailures >= LIVE_ABORT_AFTER_FAILURES) {
        liveDisabled = true;
        console.warn(
          `\nLive HLTV unreachable after ${LIVE_ABORT_AFTER_FAILURES} failures — using reference/estimated for remaining slots.`
        );
      }
    }
    await sleep(REQUEST_DELAY_MS);
    return stats;
  }

  console.log(`Major Run HLTV sync — ${rosterEntries.length} roster slots, ${byTeam.size} teams`);

  for (const [teamYearId, roster] of byTeam) {
    const head = roster[0];
    const window = getTeamYearWindow(teamYearId, head.season);
    const estimatedMap = buildEstimatedForTeam(roster);

    for (const slot of roster) {
      const key = overlayKey(teamYearId, slot.playerId);
      const player = basePlayer(slot.playerId);
      if (!player) {
        console.warn(`  missing player: ${slot.playerId} on ${teamYearId}`);
        continue;
      }

      const prev = existingEntries[key];
      if (prev && (prev.source === 'hltv-live' || prev.source === 'hltv-cache')) {
        outputEntries[key] = { ...prev, source: 'hltv-cache' };
        cached++;
        continue;
      }

      let hltvStats: HltvStatSnapshot | null = null;
      let source: HltvEntrySource = 'hltv-estimated';
      let hltvId = resolveHltvId(player.gamertag);

      if (!OFFLINE) {
        attemptedLive = true;
        if (!hltvId) {
          if (liveAttempts < MAX_LIVE) {
            hltvId = await resolveId(player.gamertag);
            liveAttempts++;
            await sleep(REQUEST_DELAY_MS);
          }
        }
        if (hltvId) {
          hltvStats = await fetchCached(hltvId, window.startDate, window.endDate);
        }
        if (hltvStats) {
          source = 'hltv-live';
          liveFetched++;
        }
      }

      if (!hltvStats) {
        hltvStats = lookupReferenceStats(teamYearId, slot.playerId) ?? null;
        if (hltvStats) {
          source = 'hltv-reference';
          reference++;
        }
      }

      if (!hltvStats) {
        hltvStats = estimatedMap.get(slot.playerId)!;
        source = 'hltv-estimated';
        estimated++;
      }

      const ratings = mapHltvStatsToRatings({
        role: player.primaryRole as CsRole,
        stats: hltvStats,
        majorWins: player.majorWins,
        mvps: player.mvps,
      });

      outputEntries[key] = {
        key,
        playerId: slot.playerId,
        gamertag: player.gamertag,
        teamYearId,
        teamName: head.teamName,
        season: head.season,
        window,
        hltvId,
        hltv: hltvStats,
        ratings,
        source,
        syncedAt: new Date().toISOString(),
      };
    }

    const teamEntries = roster
      .map((s) => outputEntries[overlayKey(teamYearId, s.playerId)])
      .filter((e): e is HltvTeamYearEntry => e != null);
    ensureUniqueRosterOveralls(teamEntries);
  }

  const output: HltvRatingsFile = {
    meta: {
      source:
        liveFetched > 0
          ? 'hltv-live'
          : reference > 0
            ? 'hltv-reference+estimated'
            : 'hltv-estimated',
      generatedAt: new Date().toISOString(),
      rosterEntryCount: Object.keys(outputEntries).length,
      teamCount: byTeam.size,
      liveFetched,
      cached,
      reference,
      estimated,
    },
    entries: outputEntries,
  };

  console.log('\nSummary:', output.meta);

  if (output.meta.rosterEntryCount !== rosterEntries.length) {
    console.warn(
      `Coverage gap: ${rosterEntries.length - output.meta.rosterEntryCount} roster slots missing`
    );
  }

  if (LIVE_ONLY && liveFetched === 0 && attemptedLive) {
    console.warn(
      '\nLive HLTV fetch returned no data (network may block automated requests). Wrote reference + estimated fallbacks.'
    );
  }

  if (DRY_RUN) {
    console.log('Dry run — no files written.');
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  writeFileSync(
    META_FILE,
    JSON.stringify(
      {
        ...output.meta,
        note: 'Per team-year overlays keyed as teamYearId::playerId. Run etl:hltv:live to refresh from HLTV.',
      },
      null,
      2
    )
  );
  console.log(`\nWrote ${OUT_FILE} (${output.meta.rosterEntryCount} entries)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
