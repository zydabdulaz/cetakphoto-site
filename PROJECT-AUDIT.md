# Project Audit Summary - CetakPhoto

## 1. Product Model & Navigation
- **Showcase Mode (`/`)**: Viewport-locked hero carousel with 6s auto-switch, plus responsive Outlet & Galeri sections.
- **Catalog Mode (`/catalog`)**: Scrollable, filterable, and searchable product and service matrix with anchor navigation.
- **Header**: Navigation updated to `Outlet | Catalog | Galeri` with direct `Hubungi kami` WhatsApp CTA.

## 2. Aesthetics & Architecture
- **Font Pairing**: `Bricolage Grotesque` + `Instrument Serif` (Google Fonts via Next Font).
- **Color Token System**: OKLCH calibrated palette (`--p`, `--d`, `--i`, `--m`, `--l`, `--a`).
- **Layout Patterns**: Bento-grid for Galeri, Double-Bezel cards for Outlet, split 50/50 hero showcase.
- **Type Safety**: TypeScript 5.x with 0 type errors (`npx tsc --noEmit` pass).

## 3. Performance & Accessibility
- Respects `prefers-reduced-motion`.
- Viewport stability using `100svh` and `min-h-[100dvh]`.
- Semantic HTML tags (`header`, `nav`, `main`, `section`, `article`).

## 4. Release Checklist
- [ ] Replace placeholder visuals in `public/images/` with final `.webp` photos.
- [ ] Add `app/sitemap.ts` and `app/robots.ts`.
- [ ] Configure OpenGraph thumbnail image (`og-image.png`).

