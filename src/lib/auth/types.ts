/**
 * RBAC domain types for the admin area. Kept free of React and storage
 * details so the future backend implementation can share them verbatim.
 */

/**
 * Directory roles. "admin"/"editor" are admin-area roles (see
 * permissions.ts for what each may open); "member" is a portal-only
 * account — it never opens an admin session and lands in /portal.
 */
export type AdminRole = "admin" | "editor" | "member";

/** A directory account. Demo-only: plaintext password lives in the mock
 *  store; a real backend replaces this with salted hashes server-side. */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password: string;
  /** Locked accounts fail sign-in but stay in the directory. */
  disabled?: boolean;
}

/** What an open session carries — identity + role, never the password. */
export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: AdminRole;
}

export type LoginResult =
  { ok: true; user: AdminUser } | { ok: false; reason?: "disabled" };
