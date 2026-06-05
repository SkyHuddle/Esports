/** HLTV data client — gameplay reads cached JSON, never live scrapes. */

export interface HltvPlayerProfile {
  hltvId: number;
  name: string;
  rating?: number;
  headshotUrl?: string;
}

export interface HltvTeamYearStats {
  teamId: string;
  playerId: string;
  rating: number;
  maps: number;
  kd: number;
  impact?: number;
}

const UA = 'MajorRun-ETL/1.0';

export const hltvClient = {
  async fetchPlayerPage(_hltvId: number): Promise<string> {
    throw new Error('HLTV fetch disabled in browser — run npm run etl:hltv');
  },

  async fetchTeamStatsPage(_teamSlug: string, _year: number): Promise<string> {
    throw new Error('HLTV fetch disabled in browser — run npm run etl:hltv');
  },

  userAgent: UA,
};
