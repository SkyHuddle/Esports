/** LAN stat windows aligned to each team card's major / event era (± buffer days). */
export interface StatWindow {
  startDate: string;
  endDate: string;
  eventLabel: string;
}

/** teamYearId → HLTV query window around the actual event dates */
export const TEAM_YEAR_WINDOWS: Record<string, StatWindow> = {
  'astralis-2018': { startDate: '2018-08-01', endDate: '2018-09-30', eventLabel: 'FACEIT London Major' },
  'astralis-2019': { startDate: '2019-02-01', endDate: '2019-03-15', eventLabel: 'IEM Katowice Major' },
  'navi-2021': { startDate: '2021-10-01', endDate: '2021-11-30', eventLabel: 'PGL Stockholm Major' },
  'faze-2022': { startDate: '2022-05-01', endDate: '2022-06-15', eventLabel: 'PGL Antwerp Major' },
  'vitality-2023': { startDate: '2023-05-01', endDate: '2023-05-31', eventLabel: 'BLAST Paris Major' },
  'spirit-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'fnatic-2015': { startDate: '2015-08-01', endDate: '2015-08-31', eventLabel: 'ESL One Cologne' },
  'sk-2017': { startDate: '2017-07-01', endDate: '2017-07-31', eventLabel: 'PGL Kraków Major' },
  'luminosity-2016': { startDate: '2016-03-15', endDate: '2016-04-15', eventLabel: 'MLG Columbus Major' },
  'cloud9-2018': { startDate: '2018-01-01', endDate: '2018-02-15', eventLabel: 'ELEAGUE Boston Major' },
  'nip-2014': { startDate: '2014-08-01', endDate: '2014-08-31', eventLabel: 'ESL One Cologne' },
  'envy-2015': { startDate: '2015-11-01', endDate: '2015-11-30', eventLabel: 'DreamHack Cluj-Napoca' },
  'gambit-2017': { startDate: '2017-07-01', endDate: '2017-07-31', eventLabel: 'PGL Kraków Major' },
  'vp-2014': { startDate: '2014-03-01', endDate: '2014-03-31', eventLabel: 'ESL Katowice Major' },
  'liquid-2019': { startDate: '2019-02-01', endDate: '2019-03-15', eventLabel: 'IEM Katowice Major' },
  'g2-2023': { startDate: '2023-05-01', endDate: '2023-05-31', eventLabel: 'BLAST Paris Major' },
  'faze-2017': { startDate: '2017-05-01', endDate: '2017-06-30', eventLabel: 'ECS Season 3 Finals' },
  'mouz-2018': { startDate: '2018-03-01', endDate: '2018-03-31', eventLabel: 'WESG World Finals' },
  'big-2017': { startDate: '2017-07-01', endDate: '2017-07-31', eventLabel: 'PGL Kraków Major' },
  'heroic-2022': { startDate: '2022-05-01', endDate: '2022-06-15', eventLabel: 'PGL Antwerp Major' },
  'outsiders-2022': { startDate: '2022-10-01', endDate: '2022-11-30', eventLabel: 'IEM Rio Major' },
  'imperial-2022': { startDate: '2022-05-01', endDate: '2022-06-15', eventLabel: 'PGL Antwerp Major' },
  'c9-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'mongolz-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'navi-2010': { startDate: '2010-09-01', endDate: '2010-10-31', eventLabel: 'ESWC Grand Final' },
  'ence-2019': { startDate: '2019-02-01', endDate: '2019-03-15', eventLabel: 'IEM Katowice Major' },
  'vp-2015': { startDate: '2015-08-01', endDate: '2015-08-31', eventLabel: 'ESL One Cologne' },
  'liquid-2016': { startDate: '2016-03-15', endDate: '2016-04-15', eventLabel: 'MLG Columbus Major' },
  'renegades-2018': { startDate: '2018-01-01', endDate: '2018-02-15', eventLabel: 'IEM Boston Qualifier' },
  'complexity-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'fnatic-2018': { startDate: '2018-02-01', endDate: '2018-03-15', eventLabel: 'IEM Katowice Major' },
  'nip-2013': { startDate: '2013-11-01', endDate: '2013-12-15', eventLabel: 'DreamHack Winter' },
  'liquid-2018': { startDate: '2018-08-01', endDate: '2018-09-30', eventLabel: 'FACEIT London Major' },
  'g2-2016': { startDate: '2016-05-01', endDate: '2016-06-30', eventLabel: 'ESL Pro League S3 Finals' },
  'mibr-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  '100t-2021': { startDate: '2021-10-01', endDate: '2021-11-30', eventLabel: 'PGL Stockholm Major' },
  'nrg-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  'tyloo-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  'clg-2016': { startDate: '2016-03-15', endDate: '2016-04-15', eventLabel: 'MLG Columbus Major' },
  'vp-2018': { startDate: '2018-08-01', endDate: '2018-09-30', eventLabel: 'FACEIT London Major' },
  'navi-2018': { startDate: '2018-08-01', endDate: '2018-09-30', eventLabel: 'FACEIT London Major' },
  'ldlc-2014': { startDate: '2014-11-01', endDate: '2014-12-15', eventLabel: 'DreamHack Winter' },
  'eg-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  'mouz-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'g2-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'furia-2024': { startDate: '2024-03-01', endDate: '2024-04-15', eventLabel: 'PGL Copenhagen Major' },
  'spacesoldiers-2018': { startDate: '2018-01-01', endDate: '2018-02-15', eventLabel: 'ELEAGUE Boston Major' },
  'north-2018': { startDate: '2018-08-01', endDate: '2018-09-30', eventLabel: 'FACEIT London Major' },
  'grayhound-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  'avangar-2018': { startDate: '2018-01-01', endDate: '2018-02-15', eventLabel: 'ELEAGUE Boston Major' },
  'sprout-2017': { startDate: '2017-07-01', endDate: '2017-07-31', eventLabel: 'PGL Kraków Major' },
  'optic-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  'pain-2022': { startDate: '2022-05-01', endDate: '2022-06-15', eventLabel: 'PGL Antwerp Major' },
  'gamerlegion-2023': { startDate: '2023-05-01', endDate: '2023-05-31', eventLabel: 'BLAST Paris Major' },
  'forze-2019': { startDate: '2019-08-01', endDate: '2019-09-15', eventLabel: 'Berlin Major' },
  'echofox-2018': { startDate: '2018-01-01', endDate: '2018-02-15', eventLabel: 'ELEAGUE Boston Major' },
};

export function overlayKey(teamYearId: string, playerId: string): string {
  return `${teamYearId}::${playerId}`;
}

export function getTeamYearWindow(teamYearId: string, season: number): StatWindow {
  const known = TEAM_YEAR_WINDOWS[teamYearId];
  if (known) return known;
  return {
    startDate: `${season}-06-01`,
    endDate: `${season}-09-30`,
    eventLabel: 'Season LAN window',
  };
}
