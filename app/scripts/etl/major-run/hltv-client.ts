/**
 * HLTV client wrapper for ETL — handles CJS/ESM default export interop.
 */
import pkg from 'hltv';
import type { FullPlayerStats } from 'hltv';

type HltvClient = {
  getPlayerStats: (options: {
    id: number;
    startDate?: string;
    endDate?: string;
    matchType?: string;
  }) => Promise<FullPlayerStats>;
  getPlayerByName: (options: { name: string }) => Promise<{ id: number }>;
};

function resolveClient(): HltvClient {
  const mod = pkg as HltvClient & { default?: HltvClient };
  const client = mod.default ?? mod;
  if (typeof client.getPlayerStats === 'function') return client;
  throw new Error('Could not resolve HLTV client — check hltv package install');
}

export const hltv = resolveClient();
