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

/** What an open session carries — identity + role + JWT tokens. */
export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: AdminRole;
  accessToken: string;
  refreshToken: string;
}

export type LoginResult =
  | { ok: true; user: AdminUser }
  | { ok: false; reason?: "disabled" }
  | { ok: false; reason?: "not_found" }
  | { ok: false; reason?: "wrong_password" };

/** Backend login response shape. */
export interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
  };
}

/** Map backend RoleName[] to frontend AdminRole. */
export function mapBackendRole(roles: string[]): AdminRole {
  if (roles.some((r) => r === "SUPER_ADMIN" || r === "ADMIN")) return "admin";
  if (roles.some((r) => r === "EDITOR" || r === "AUTHOR")) return "editor";
  return "member";
}
