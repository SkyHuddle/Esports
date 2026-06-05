import type { HltvStatSnapshot } from './map-ratings';
import { overlayKey } from './major-event-windows';

/**
 * Curated HLTV Rating 2.0 for specific player + team-year cards.
 * Key: `teamYearId::playerId`
 */
export const HLTV_REFERENCE_BY_CARD: Record<string, HltvStatSnapshot> = {
  [overlayKey('navi-2021', 's1mple')]: { rating2: 1.31, kdRatio: 1.42, adr: 88.4, mapsPlayed: 22, openingKillRatio: 1.12, sniperKillShare: 0.38 },
  [overlayKey('navi-2021', 'electronic')]: { rating2: 1.18, kdRatio: 1.22, adr: 82.5, mapsPlayed: 22, openingKillRatio: 1.04, sniperKillShare: 0.05 },
  [overlayKey('navi-2021', 'b1t')]: { rating2: 1.14, kdRatio: 1.16, adr: 80.2, mapsPlayed: 22, openingKillRatio: 1.02, sniperKillShare: 0.04 },
  [overlayKey('navi-2021', 'perfecto')]: { rating2: 1.05, kdRatio: 1.04, adr: 74.5, mapsPlayed: 22, openingKillRatio: 0.84, sniperKillShare: 0.02 },
  [overlayKey('navi-2021', 'boombl4')]: { rating2: 0.99, kdRatio: 0.97, adr: 71.0, mapsPlayed: 22, openingKillRatio: 0.90, sniperKillShare: 0.02 },

  [overlayKey('navi-2018', 's1mple')]: { rating2: 1.28, kdRatio: 1.38, adr: 87.0, mapsPlayed: 20, openingKillRatio: 1.10, sniperKillShare: 0.36 },
  [overlayKey('navi-2018', 'electronic')]: { rating2: 1.12, kdRatio: 1.14, adr: 79.5, mapsPlayed: 20, openingKillRatio: 1.00, sniperKillShare: 0.05 },
  [overlayKey('navi-2018', 'zeus')]: { rating2: 0.94, kdRatio: 0.90, adr: 68.0, mapsPlayed: 20, openingKillRatio: 0.85, sniperKillShare: 0.02 },

  [overlayKey('liquid-2016', 's1mple-16')]: { rating2: 1.12, kdRatio: 1.15, adr: 79.8, mapsPlayed: 18, openingKillRatio: 1.06, sniperKillShare: 0.32 },
  [overlayKey('liquid-2016', 'hiko-16')]: { rating2: 1.05, kdRatio: 1.06, adr: 75.0, mapsPlayed: 18, openingKillRatio: 0.95, sniperKillShare: 0.04 },
  [overlayKey('liquid-2016', 'naf-16')]: { rating2: 1.02, kdRatio: 1.03, adr: 73.5, mapsPlayed: 18, openingKillRatio: 0.92, sniperKillShare: 0.03 },

  [overlayKey('astralis-2018', 'device')]: { rating2: 1.27, kdRatio: 1.36, adr: 85.0, mapsPlayed: 24, openingKillRatio: 1.04, sniperKillShare: 0.41 },
  [overlayKey('astralis-2018', 'gla1ve')]: { rating2: 1.04, kdRatio: 1.01, adr: 73.8, mapsPlayed: 24, openingKillRatio: 0.88, sniperKillShare: 0.02 },
  [overlayKey('astralis-2018', 'dupreeh')]: { rating2: 1.13, kdRatio: 1.15, adr: 79.5, mapsPlayed: 24, openingKillRatio: 1.04, sniperKillShare: 0.03 },
  [overlayKey('astralis-2018', 'xyp9x')]: { rating2: 1.09, kdRatio: 1.07, adr: 76.5, mapsPlayed: 24, openingKillRatio: 0.86, sniperKillShare: 0.02 },
  [overlayKey('astralis-2019', 'device')]: { rating2: 1.25, kdRatio: 1.33, adr: 84.0, mapsPlayed: 22, openingKillRatio: 1.03, sniperKillShare: 0.40 },

  [overlayKey('spirit-2024', 'donk')]: { rating2: 1.37, kdRatio: 1.48, adr: 92.3, mapsPlayed: 20, openingKillRatio: 1.18, sniperKillShare: 0.22 },
  [overlayKey('spirit-2024', 'sh1ro')]: { rating2: 1.15, kdRatio: 1.18, adr: 79.8, mapsPlayed: 20, openingKillRatio: 0.94, sniperKillShare: 0.38 },
  [overlayKey('spirit-2024', 'chopper')]: { rating2: 0.98, kdRatio: 0.96, adr: 71.5, mapsPlayed: 20, openingKillRatio: 0.90, sniperKillShare: 0.02 },

  [overlayKey('vitality-2023', 'zywoo')]: { rating2: 1.29, kdRatio: 1.38, adr: 87.0, mapsPlayed: 18, openingKillRatio: 1.08, sniperKillShare: 0.44 },
  [overlayKey('vitality-2023', 'apex')]: { rating2: 1.01, kdRatio: 0.99, adr: 73.0, mapsPlayed: 18, openingKillRatio: 0.96, sniperKillShare: 0.05 },
  [overlayKey('vitality-2023', 'spinx')]: { rating2: 1.10, kdRatio: 1.11, adr: 78.2, mapsPlayed: 18, openingKillRatio: 1.02, sniperKillShare: 0.04 },

  [overlayKey('faze-2022', 'ropz')]: { rating2: 1.20, kdRatio: 1.26, adr: 82.0, mapsPlayed: 22, openingKillRatio: 0.98, sniperKillShare: 0.04 },
  [overlayKey('faze-2022', 'twistzz')]: { rating2: 1.17, kdRatio: 1.20, adr: 82.5, mapsPlayed: 22, openingKillRatio: 1.04, sniperKillShare: 0.05 },
  [overlayKey('faze-2022', 'karrigan')]: { rating2: 0.97, kdRatio: 0.94, adr: 69.8, mapsPlayed: 22, openingKillRatio: 0.91, sniperKillShare: 0.02 },
  [overlayKey('faze-2022', 'broky')]: { rating2: 1.09, kdRatio: 1.10, adr: 77.5, mapsPlayed: 22, openingKillRatio: 0.95, sniperKillShare: 0.39 },

  [overlayKey('cloud9-2018', 'skadoodle')]: { rating2: 1.16, kdRatio: 1.19, adr: 80.5, mapsPlayed: 22, openingKillRatio: 0.92, sniperKillShare: 0.43 },
  [overlayKey('cloud9-2018', 'tarik')]: { rating2: 1.10, kdRatio: 1.11, adr: 77.8, mapsPlayed: 22, openingKillRatio: 1.05, sniperKillShare: 0.05 },
  [overlayKey('cloud9-2018', 'stewie2k')]: { rating2: 1.08, kdRatio: 1.09, adr: 76.8, mapsPlayed: 22, openingKillRatio: 1.08, sniperKillShare: 0.04 },

  [overlayKey('luminosity-2016', 'coldzera')]: { rating2: 1.24, kdRatio: 1.32, adr: 85.5, mapsPlayed: 20, openingKillRatio: 1.02, sniperKillShare: 0.34 },
  [overlayKey('luminosity-2016', 'fallen')]: { rating2: 1.07, kdRatio: 1.04, adr: 75.5, mapsPlayed: 20, openingKillRatio: 0.91, sniperKillShare: 0.28 },
  [overlayKey('luminosity-2016', 'fer')]: { rating2: 1.13, kdRatio: 1.15, adr: 79.8, mapsPlayed: 20, openingKillRatio: 1.09, sniperKillShare: 0.04 },

  [overlayKey('g2-2024', 'niko')]: { rating2: 1.22, kdRatio: 1.28, adr: 85.5, mapsPlayed: 20, openingKillRatio: 1.12, sniperKillShare: 0.07 },
  [overlayKey('g2-2024', 'm0nesy')]: { rating2: 1.21, kdRatio: 1.26, adr: 84.8, mapsPlayed: 20, openingKillRatio: 1.05, sniperKillShare: 0.45 },
  [overlayKey('g2-2023', 'niko')]: { rating2: 1.20, kdRatio: 1.26, adr: 85.0, mapsPlayed: 18, openingKillRatio: 1.10, sniperKillShare: 0.08 },
  [overlayKey('g2-2023', 'm0nesy')]: { rating2: 1.19, kdRatio: 1.24, adr: 84.2, mapsPlayed: 18, openingKillRatio: 1.04, sniperKillShare: 0.44 },

  [overlayKey('liquid-2019', 'elige')]: { rating2: 1.16, kdRatio: 1.18, adr: 81.5, mapsPlayed: 22, openingKillRatio: 1.07, sniperKillShare: 0.04 },
  [overlayKey('liquid-2019', 'naf')]: { rating2: 1.11, kdRatio: 1.12, adr: 78.0, mapsPlayed: 22, openingKillRatio: 0.90, sniperKillShare: 0.03 },
  [overlayKey('liquid-2018', 'twistzz')]: { rating2: 1.14, kdRatio: 1.16, adr: 80.5, mapsPlayed: 22, openingKillRatio: 1.03, sniperKillShare: 0.05 },

  [overlayKey('outsiders-2022', 'jame')]: { rating2: 1.12, kdRatio: 1.10, adr: 77.5, mapsPlayed: 24, openingKillRatio: 0.88, sniperKillShare: 0.33 },
  [overlayKey('vp-2014', 'neo')]: { rating2: 1.14, kdRatio: 1.16, adr: 80.0, mapsPlayed: 20, openingKillRatio: 1.05, sniperKillShare: 0.04 },
  [overlayKey('envy-2015', 'kennyS')]: { rating2: 1.22, kdRatio: 1.26, adr: 84.0, mapsPlayed: 20, openingKillRatio: 1.00, sniperKillShare: 0.48 },
  [overlayKey('fnatic-2015', 'olofmeister')]: { rating2: 1.18, kdRatio: 1.20, adr: 81.5, mapsPlayed: 20, openingKillRatio: 1.06, sniperKillShare: 0.05 },
  [overlayKey('heroic-2022', 'cadian')]: { rating2: 1.06, kdRatio: 1.04, adr: 74.5, mapsPlayed: 22, openingKillRatio: 0.90, sniperKillShare: 0.24 },
  [overlayKey('heroic-2022', 'stavn')]: { rating2: 1.10, kdRatio: 1.11, adr: 77.8, mapsPlayed: 22, openingKillRatio: 1.01, sniperKillShare: 0.06 },
  [overlayKey('mouz-2024', 'frozen')]: { rating2: 1.13, kdRatio: 1.15, adr: 79.5, mapsPlayed: 20, openingKillRatio: 1.03, sniperKillShare: 0.05 },
  [overlayKey('mouz-2024', 'siuhy')]: { rating2: 1.02, kdRatio: 1.00, adr: 72.5, mapsPlayed: 20, openingKillRatio: 0.92, sniperKillShare: 0.02 },
};

export function lookupReferenceStats(teamYearId: string, playerId: string): HltvStatSnapshot | undefined {
  return HLTV_REFERENCE_BY_CARD[overlayKey(teamYearId, playerId)];
}
