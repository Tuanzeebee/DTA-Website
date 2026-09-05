import type {
  AdminSession,
  AdminUser,
  BackendAuthResponse,
} from "./types";
import { mapBackendRole } from "./types";

/**
 * Auth service backed by the real NestJS backend.
 * - Login: POST /api/auth/login → JWT access + refresh tokens
 * - Session stored in sessionStorage with tokens
 * - All admin API calls use the access token
 */

/* ---------------- session store ---------------- */

const SESSION_KEY = "dta-admin-session";
const SESSION_EVENT = "dta-admin-session-changed";

/** Single mutable source of truth, hydrated once from sessionStorage. */
let current: AdminSession | null = (() => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
})();

const persist = () => {
  try {
    if (current) sessionStorage.setItem(SESSION_KEY, JSON.stringify(current));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
};

const notify = () => window.dispatchEvent(new Event(SESSION_EVENT));

export function subscribeSession(cb: () => void) {
  window.addEventListener(SESSION_EVENT, cb);
  return () => window.removeEventListener(SESSION_EVENT, cb);
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
  },

  currentSession(): AdminSession | null {
    return current;
  },

  /** Get the current access token for API calls. */
  getAccessToken(): string | null {
    return current?.accessToken ?? null;
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


