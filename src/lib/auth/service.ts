import type {
  AdminSession,
  AdminUser,
  BackendAuthResponse,
} from "./types";
import { mapBackendRole } from "./types";

/**
 * Auth service backed by the real NestJS backend.
 * - Login: POST /api/auth/login → JWT access + refresh tokens
 * - Session stored in localStorage (persists across tabs and browser restarts)
 * - Auto-refreshes access token every 12 min (token TTL = 15 min)
 * - All admin API calls use the access token
 */

/* ---------------- session store ---------------- */

const SESSION_KEY = "dta-admin-session";
const SESSION_EVENT = "dta-admin-session-changed";

/** Single mutable source of truth, hydrated once from localStorage. */
let current: AdminSession | null = (() => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
})();

const persist = () => {
  try {
    if (current) localStorage.setItem(SESSION_KEY, JSON.stringify(current));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
};

const notify = () => window.dispatchEvent(new Event(SESSION_EVENT));

export function subscribeSession(cb: () => void) {
  window.addEventListener(SESSION_EVENT, cb);
  return () => window.removeEventListener(SESSION_EVENT, cb);
}

/* ---------------- auto token refresh ---------------- */

const REFRESH_INTERVAL_MS = 12 * 60 * 1000; // 12 minutes (access token TTL = 15 min)
let refreshTimer: ReturnType<typeof setInterval> | null = null;

function startAutoRefresh() {
  stopAutoRefresh();
  refreshTimer = setInterval(async () => {
    if (!current?.refreshToken) return;
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      if (!res.ok) return; // will be caught on next API call → 401 → logout
      const data = (await res.json()) as BackendAuthResponse;
      current = {
        ...current,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      persist();
    } catch {
      // network error — don't logout, retry next interval
    }
  }, REFRESH_INTERVAL_MS);
}

function stopAutoRefresh() {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// Start auto-refresh if we already have a session on module load
if (current?.refreshToken) {
  startAutoRefresh();
}

/* ---------------- the real implementation ---------------- */

export const authService = {
  /**
   * Call backend POST /api/auth/login and open a session on success.
   * Returns the mapped AdminUser for UI display.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ ok: true; user: AdminUser } | { ok: false; reason?: string }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        if (res.status === 401) {
          if (body.includes("Email hoặc mật khẩu không đúng")) {
            return { ok: false, reason: "wrong_password" };
          }
          if (body.includes("khóa hoặc vô hiệu hóa")) {
            return { ok: false, reason: "disabled" };
          }
          return { ok: false, reason: "wrong_password" };
        }
        return { ok: false, reason: `Server error (${res.status})` };
      }
      const data = (await res.json()) as BackendAuthResponse;
      const role = mapBackendRole(data.user.roles);
      const user: AdminUser = {
        id: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        role,
        password: "",
      };
      current = {
        userId: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        role,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      persist();
      notify();
      startAutoRefresh();
      return { ok: true, user };
    } catch {
      return { ok: false, reason: "network" };
    }
  },

  /**
   * Attempt to refresh the access token using the stored refresh token.
   * Returns true on success (session updated), false on failure (session cleared).
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!current?.refreshToken) return false;
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      if (!res.ok) {
        this.logout();
        return false;
      }
      const data = (await res.json()) as BackendAuthResponse;
      const role = mapBackendRole(data.user.roles);
      current = {
        ...current,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role,
      };
      persist();
      notify();
      return true;
    } catch {
      this.logout();
      return false;
    }
  },

  logout() {
    if (!current) return;
    current = null;
    persist();
    notify();
    stopAutoRefresh();
  },

  currentSession(): AdminSession | null {
    return current;
  },

  /** Get the current access token for API calls. */
  getAccessToken(): string | null {
    return current?.accessToken ?? null;
  },

  /** Check if the user is logged in (has a valid session). */
  isLoggedIn(): boolean {
    return current !== null;
  },

  /** Get the current user's mapped role. */
  getRole(): string | null {
    return current?.role ?? null;
  },
};

/** Keep an already-open session in sync after the signed-in user's own
 *  record changes (rename, role change). No-op when it's someone else. */
export function syncSessionWith(user: AdminUser) {
  if (!current || current.userId !== user.id) return;
  current = {
    ...current,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  persist();
  notify();
}
