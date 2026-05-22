import { STORAGE_KEYS } from '@/constants'

export type Theme = 'light' | 'dark'

export function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return null
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Apply theme class on `<html>` and native `color-scheme` (forms, scrollbars). */
export function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.style.colorScheme = theme
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch {
    /* ignore */
  }
}

export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}
