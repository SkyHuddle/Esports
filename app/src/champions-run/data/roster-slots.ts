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
    if (matches(id, (r, s) => r === 'flex' || s === 'flex')) {
      claim('flex', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'duelist')) {
      claim('duelist', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'initiator')) {
      claim('initiator', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'controller')) {
      claim('controller', id);
      break;
    }
  }

  for (const id of ids) {
    if (used.has(id)) continue;
    if (matches(id, (r) => r === 'sentinel')) {
      claim('sentinel', id);
      break;
    }
  }

  for (const slot of SLOT_ORDER) {
    if (slots[slot]) continue;
    const next = ids.find((pid) => !used.has(pid));
    if (next) claim(slot, next);
  }

  return slots as Record<RosterSlot, string>;
}

export function rosterPlayerIds(roster: Record<RosterSlot, string>): string[] {
  return SLOT_ORDER.map((slot) => roster[slot]);
}
