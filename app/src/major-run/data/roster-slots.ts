import type { RosterSlot } from '../core/types';
import { SLOT_ORDER } from '../core/constants';
import { getPlayerById } from './players';

/** Map five player ids to roster slots using primary roles */
export function assignRosterSlots(playerIds: string[]): Record<RosterSlot, string> {
  const ids = playerIds.filter(Boolean).slice(0, 5);
  if (ids.length < 5) {
    throw new Error(`Roster needs 5 players, got ${ids.length}: ${ids.join(', ')}`);
  }

  const slots: Partial<Record<RosterSlot, string>> = {};
  const used = new Set<string>();

  const claim = (slot: RosterSlot, id: string) => {
    if (used.has(id)) return false;
    slots[slot] = id;
    used.add(id);
    return true;
  };

  const matches = (id: string, pred: (primary: string, secondary: string) => boolean) => {
    const pl = getPlayerById(id);
    if (!pl) return false;
    return pred(pl.primaryRole, pl.secondaryRole);
  };

  for (const id of ids) {
    if (matches(id, (r) => r === 'igl')) {
      claim('igl', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'awper')) {
      claim('awper', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'entry')) {
      claim('entry', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'lurker')) {
      claim('lurker', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r, s) => r === 'support' || s === 'support')) {
      claim('support', id);
      break;
    }
  }

  for (const slot of SLOT_ORDER) {
    if (slots[slot]) continue;
    const next = ids.find((id) => !used.has(id));
    if (next) claim(slot, next);
  }

  return slots as Record<RosterSlot, string>;
}

export function rosterPlayerIds(roster: Record<RosterSlot, string>): string[] {
  return SLOT_ORDER.map((slot) => roster[slot]);
}
