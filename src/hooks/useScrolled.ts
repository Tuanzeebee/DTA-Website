import { useState, useEffect } from "react";

/**
 * True once the page has scrolled past `threshold`.
 *
 * The listener is passive and only ever writes a boolean, so React bails out
 * of re-rendering on every frame where the value is unchanged — the state is
 * discrete, not a continuous scroll position.
 *
 * Was duplicated in the home Nav and the portal header.
 */
export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll(); // sync on mount — a reload mid-page must not start untinted
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
