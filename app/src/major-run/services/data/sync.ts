/**
 * Data sync orchestration — HLTV primary, Liquipedia secondary, manual overrides last.
 * Run via CLI: npm run etl:hltv
 */

import type { DbTeamYearRating } from './schema';

export interface SyncMeta {
  source: string;
  syncedAt: string;
  entryCount: number;
}

export const playerSyncService = {
  async syncCareerRatings(): Promise<SyncMeta> {
    throw new Error('Run npm run etl:hltv from app/ directory');
  },
};

export const teamSyncService = {
  async syncHistoricalRosters(): Promise<SyncMeta> {
    throw new Error('Run npm run etl:hltv from app/ directory');
  },
};

export const ratingService = {
  recomputeFromStats(entries: DbTeamYearRating[]): DbTeamYearRating[] {
    return entries;
  },
};

export const majorHistoryService = {
  validateMajorPlacement(teamId: string, placement: string): boolean {
    return Boolean(teamId && placement);
  },
};

export const historicalRosterService = {
  resolveRoster(_teamId: string): string[] {
    return [];
  },
};

export const eventSyncService = {
  async syncMajorEvents(_year: number): Promise<SyncMeta> {
    throw new Error('Run npm run etl:hltv from app/ directory');
  },
};

export const dailyChallengeService = {
  buildChallenge(dateKey: string) {
    return { dateKey, constraintId: 'standard', teamIds: [], seed: dateKey };
  },
};

export const simulationService = {
  note: 'Runtime sim lives in major-run/engine/simulation.ts',
};

export const shareCardService = {
  note: 'Share cards rendered client-side in components/ShareCard.tsx',
};
