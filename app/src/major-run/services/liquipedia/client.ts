/** Liquipedia cross-reference client — secondary source for roster/achievement validation. */

export interface LiquipediaRosterEntry {
  playerName: string;
  role?: string;
}

export const liquipediaClient = {
  async fetchTeamRoster(_teamSlug: string, _year: number): Promise<LiquipediaRosterEntry[]> {
    throw new Error('Liquipedia fetch disabled in browser — run ETL scripts');
  },
};
