"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Runs before the page paints (inlined in <head>), so a saved dark choice never flashes light.
 * Light is the default: the site as originally designed.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="dark"){document.documentElement.dataset.theme="dark";}}catch(e){}})();`;

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Pick up what the head script already applied.
  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";
    // Colours change in one smooth fade instead of snapping.
    root.classList.add("theme-transition");
    if (next === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setTheme(next);
    // Canvas effects and the header re-read the theme.
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
