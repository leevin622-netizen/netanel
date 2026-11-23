# GymTrack design system

All tokens live in the `:root` block at the top of the `<style>` in `index.html`.
Rule: **never write a raw color, font size or radius in CSS** — use a token. If you need a new value, add a token first.

## Colors
| Token | Use |
|---|---|
| `--bg` / `--card` / `--card2` | page background / card / inputs, chips, secondary buttons |
| `--tx` / `--mu` | main text / muted text |
| `--ac` (`--ac2`) | primary action, success, "done" |
| `--wr` | warnings, PRs, deload, rest |
| `--dg` | destructive, errors |
| `--bl` | info, links |
| `--on-ac`, `--on-wr` | text on a filled `--ac` / `--wr` background |
| `--ac-soft`, `--dg-soft`, `--bl-soft`, `--wr-soft`, `--wr-strong`, `--wr-line` | tinted backgrounds/borders (derived with `color-mix`, so they follow light/dark) |
| `--scrim` | modal backdrop |

Light mode overrides the base tokens in the `prefers-color-scheme:light` block; derived tokens update automatically.

## Radius
`--r-sm` 10px (buttons, inputs, tips) · `--r` 14px (cards, banners) · `--r-lg` 18px (bottom sheet) · `--r-pill` 99px (chips, toast, bars)

## Type scale
`--fs-2xs` 10 · `--fs-xs` 12 · `--fs-sm` 13 (secondary text) · `--fs-md` 14 · `--fs-md2` 15 · `--fs-base` 16 (body) · `--fs-lg` 17 (h2) · `--fs-xl` 20 · `--fs-2xl` 22 (h1) · `--fs-3xl` 24 (stat numbers)

## Spacing
`--s1` 4 · `--s2` 6 · `--s3` 8 · `--s4` 12 · `--s5` 16 · `--s6` 20 (px). Use for new CSS.

## Components (existing classes)
`.card` (`.warm`, `.main`) · `button` (`.pri`, `.dg`, `.sm`) · `.chip` (`.on`) · `.tip` · `.fb` (`.good`/`.bad`/`.neu`) · `.banner` · `.bar>i` · `.stat` · `.day` · `.set` · `#modal .sheet` · `#toast` · `#rest`. Reuse these before creating new ones.
