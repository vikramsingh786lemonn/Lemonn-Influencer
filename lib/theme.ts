export type Theme = 'light' | 'dark';

export const THEME_KEY = 'pk-theme';

/* The dark canvas colour, which has to exist in two places that cannot import
   from each other's world:

   1. `--bg` in `app/pock.css`  — the stylesheet
   2. this constant             — used by the pre-paint script in `app/layout.tsx`
                                  and by `ThemeToggle`

   The pre-paint script has to set the background *before* the stylesheet
   applies, or the page flashes light on load in dark mode — so it cannot read a
   CSS custom property. Two copies is the floor; it used to be three. If you
   change this, change `--bg` in pock.css to match. */
export const DARK_CANVAS = '#171a1c';

/** Applies a theme to the document. Shared by the toggle and the boot script. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.background = theme === 'dark' ? DARK_CANVAS : '';
}
