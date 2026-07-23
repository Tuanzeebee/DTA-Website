import { useSyncExternalStore } from "react";
import {
  allMembers,
  membersData,
  ADMIN_MEMBERS_KEY,
  ADMIN_MEMBERS_HIDDEN_KEY,
  type DtaMember,
} from "@/data";

/**
 * Admin-side mutations over the member overlay in localStorage (merge
 * semantics live next to membersData in data.ts). Same shape as the
 * article adminStore — swapping in a real API later only touches this
 * file and the data.ts store block.
 */

const CHANGE_EVENT = "dta-admin-members-changed";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full/blocked — the change simply doesn't persist */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const isBaseId = (id: string) => membersData.some((m) => m.id === id);

/** Create or update. Same id = override (base rows included). */
export function saveMember(member: DtaMember) {
  const overrides = readJson<DtaMember[]>(ADMIN_MEMBERS_KEY, []);
  const next = overrides.filter((o) => o.id !== member.id);
  next.push(member);
  writeJson(ADMIN_MEMBERS_KEY, next);
}

/** Delete: admin-created rows are removed outright; base rows go on the
 *  hidden list (they can't be removed from the bundle). */
export function deleteMember(id: string) {
  const overrides = readJson<DtaMember[]>(ADMIN_MEMBERS_KEY, []);
  writeJson(
    ADMIN_MEMBERS_KEY,
    overrides.filter((o) => o.id !== id),
  );
  if (isBaseId(id)) {
    const hidden = readJson<string[]>(ADMIN_MEMBERS_HIDDEN_KEY, []);
    if (!hidden.includes(id))
      writeJson(ADMIN_MEMBERS_HIDDEN_KEY, [...hidden, id]);
  }
}

/** Drop every local member change and return to the bundled data. */
export function resetMembersToMockData() {
  try {
    localStorage.removeItem(ADMIN_MEMBERS_KEY);
    localStorage.removeItem(ADMIN_MEMBERS_HIDDEN_KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const newMemberId = () =>
  `mem-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const memberOrigin = (id: string): "mock" | "admin" =>
  isBaseId(id) ? "mock" : "admin";

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === ADMIN_MEMBERS_KEY || e.key === ADMIN_MEMBERS_HIDDEN_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
};

/** Reactive merged list for admin views. allMembers() is raw-string
 *  memoised, so the snapshot is referentially stable. */
export function useAdminMembers() {
  return useSyncExternalStore(subscribe, allMembers, allMembers);
}
