import { useCallback, useSyncExternalStore } from "react";
import { authService, subscribeSession } from "./service";
import { canAccess, type AdminSection } from "./permissions";
import type { AdminSession } from "./types";

const getSession = () => authService.currentSession();
const getNoSession = () => null;

/** Reactive read of the open admin session (null = signed out). */
export function useAuthSession(): AdminSession | null {
  return useSyncExternalStore(subscribeSession, getSession, getNoSession);
}

/** Section-level permission check for the signed-in user. */
export function useCan(section: AdminSection): boolean {
  const session = useAuthSession();
  return session ? canAccess(session.role, section) : false;
}

export function useLogout() {
  return useCallback(() => authService.logout(), []);
}
