"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  isThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "@/lib/theme/themes";

const THEME_EVENT = "smartguard-theme-change";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function getThemeSnapshot(): ThemeId {
  if (!canUseStorage()) return DEFAULT_THEME;

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeId(storedTheme) ? storedTheme : DEFAULT_THEME;
}

function subscribeTheme(listener: () => void) {
  if (!canUseStorage()) return () => undefined;

  window.addEventListener("storage", listener);
  window.addEventListener(THEME_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(THEME_EVENT, listener);
  };
}

function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.theme =
    theme === DEFAULT_THEME ? "" : theme;
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: ThemeId) => {
    if (!canUseStorage()) return;

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return { theme, setTheme };
}
