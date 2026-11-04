const KEY = "project-return-y";

/** Remembers where the home page was, just before a project card opens its detail page. */
export function saveProjectReturn() {
  try {
    sessionStorage.setItem(KEY, String(window.scrollY));
  } catch {}
}

/**
 * Reads the remembered position, which then only applies to this return. It is forgotten a moment
 * later rather than at once, because the home page's effects can run twice as it mounts.
 */
export function takeProjectReturn() {
  try {
    const y = sessionStorage.getItem(KEY);
    if (y === null) return null;
    window.setTimeout(clearProjectReturn, 1000);
    return Number(y);
  } catch {
    return null;
  }
}

export function clearProjectReturn() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
