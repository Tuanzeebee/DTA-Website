import {
  createCollectionStore,
  genId,
} from "@/compenents/admin/collectionStore";
import type { AdminSession, AdminUser, LoginResult } from "./types";

/**
 * Auth contract for the admin directory. Today the only implementation is
 * the mock below (localStorage directory + sessionStorage session); when
 * the backend exists, implement this interface against the API and swap
 * the exported instance — no UI or route-guard code changes.
 *
 * Verification and session-opening are separate steps on purpose: "member"
 * accounts verify fine but must never receive an admin session — the sign-in
 * card routes them to the portal workspace instead.
 */
export interface AuthService {
  /** Check credentials without side effects. Fails on unknown email,
   *  wrong password or a locked account (reason: "disabled"). */
  verify(email: string, password: string): LoginResult;
  /** Open a session for an already-verified user. */
  openSessionFor(user: AdminUser): void;
  /** Close the current session (no-op when signed out). */
  logout(): void;
  /** The open session, or null. Sessions whose account was deleted or
   *  locked read as signed out immediately. */
  currentSession(): AdminSession | null;
}

/* ---------------- mock user directory ---------------- */

export const USER_STORE_KEY = "dta-admin-users";

/**
 * Seed accounts — kept in sync with the hint on the sign-in card:
 *   admin@gmail.com / admin          → Quản trị viên (full access)
 *   bt.vien@dta.org.vn / bien-tap    → Biên tập viên (content)
 *   hoi.vien@dta.org.vn / hoi-vien   → Hội viên (portal workspace only)
 */
export const SEED_USERS: AdminUser[] = [];

/** Directory storage. Like the other admin stores: seed shows until the
 *  first edit, then the whole list persists in localStorage. */
export const userStore = createCollectionStore<AdminUser>(
  USER_STORE_KEY,
  SEED_USERS,
);

export const newUserId = () => genId("usr");

/** Case-insensitive lookup for the sign-in card — lets it tell "this is an
 *  admin account with a wrong password" apart from "not an admin at all". */
export function findUserByEmail(email: string): AdminUser | undefined {
  const needle = email.trim().toLowerCase();
  return userStore.read().find((u) => u.email.toLowerCase() === needle);
}

/* ---------------- session store ---------------- */

const SESSION_KEY = "dta-admin-session";
const SESSION_EVENT = "dta-admin-session-changed";

/** Single mutable source of truth, hydrated once from sessionStorage so the
 *  hook snapshot stays referentially stable between changes. */
let current: AdminSession | null = (() => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    /* blocked storage / corrupt JSON → signed out */
    return null;
  }
})();

const persist = () => {
  try {
    if (current) sessionStorage.setItem(SESSION_KEY, JSON.stringify(current));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable — the in-memory copy still covers this tab */
  }
};

const notify = () => window.dispatchEvent(new Event(SESSION_EVENT));

export function subscribeSession(cb: () => void) {
  window.addEventListener(SESSION_EVENT, cb);
  return () => window.removeEventListener(SESSION_EVENT, cb);
}

/* ---------------- the mock implementation ---------------- */

export const authService: AuthService = {
  verify(email, password) {
    const user = findUserByEmail(email);
    if (!user || user.password !== password) return { ok: false };
    if (user.disabled) return { ok: false, reason: "disabled" };
    return { ok: true, user };
  },

  openSessionFor(user) {
    current = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    persist();
    notify();
  },

  logout() {
    if (!current) return;
    current = null;
    persist();
    notify();
  },

  currentSession() {
    if (!current) return null;
    // A deleted or locked account invalidates the open session at once.
    const user = userStore.read().find((u) => u.id === current?.userId);
    if (!user || user.disabled) return null;
    return current;
  },
};

/** Keep an already-open session in sync after the signed-in user's own
 *  record changes (rename, role change). No-op when it's someone else. */
export function syncSessionWith(user: AdminUser) {
  if (!current || current.userId !== user.id || user.disabled) return;
  current = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  persist();
  notify();
}
