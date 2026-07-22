/**
 * Resolve a nav target for the current route.
 *
 * In-page anchors like `#about` only work on the home route; from `/news` or
 * `/portal` they must be rewritten to `/#about` so the router lands on home
 * first and the browser then scrolls to the fragment.
 */
export function resolveHref(href: string) {
  if (!href.startsWith("#")) return href;
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  return pathname === "/" ? href : `/${href}`;
}
