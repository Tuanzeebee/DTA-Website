import type { AdminRole } from "./types";

/**
 * The permission model: roles map to the admin sections they may open.
 * This file is the single source of truth — route gates, sidebar filtering
 * and action buttons all derive from it. When the backend lands, this same
 * matrix moves server-side; the client keeps it for UI shaping only.
 */

export type AdminSection =
  | "overview"
  | "articles"
  | "ads"
  | "gallery"
  | "resources"
  | "forum"
  | "members"
  | "applications"
  | "fees"
  | "users";

export const ROLE_LABEL: Record<AdminRole, string> = {
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  member: "Hội viên",
};

/** Role → sections it may open. Hội viên owns no admin sections: their
 *  workspace lives in /portal, so directory accounts with this role are
 *  routed there at sign-in and never receive an admin session. */
export const ROLE_SECTIONS: Record<AdminRole, readonly AdminSection[]> = {
  admin: [
    "overview",
    "articles",
    "ads",
    "gallery",
    "resources",
    "forum",
    "members",
    "applications",
    "fees",
    "users",
  ],
  editor: ["overview", "articles", "ads", "gallery", "resources", "forum"],
  member: [],
};

export const sectionsForRole = (role: AdminRole): readonly AdminSection[] =>
  ROLE_SECTIONS[role];

export const canAccess = (role: AdminRole, section: AdminSection): boolean =>
  ROLE_SECTIONS[role].includes(section);
