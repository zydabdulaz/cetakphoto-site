# Audit summary

## Product model

Showcase and catalog are separate modes. Showcase is viewport-locked and cycles through three stories. Catalog is intentionally scrollable, searchable, filterable, and anchorable.

## Hierarchy

One primary headline, one body block, one primary action, and one secondary action per showcase state. Catalog uses section heading, intro, product name, detail, price, and inquiry link.

## Motion

Only transform and opacity are used for motion. Showcase cycles every 6 seconds, has manual controls, and respects reduced motion. No bounce, no layout animation, no motion-only information.

## Responsive

Desktop uses split composition. Tablet collapses into stacked copy and visual. Mobile preserves the single-screen showcase with reduced visual scale and full-width actions. Catalog becomes a one-column reading flow.

## Accessibility

Semantic links and buttons, visible focus, aria labels for slide controls and search, keyboard-usable controls, reduced-motion fallback. Add real image alt text when assets arrive.

## Performance and SEO

Static-rendered content, minimal client state only for showcase and catalog filtering, no heavy animation library, metadata included. Before launch: add next/image, OG image, canonical, sitemap, robots, schema, Playwright, and Lighthouse CI.

## Release blockers

Replace demo pricing, WhatsApp number, address, hours, delivery policy, legal copy, and all placeholder visual blocks. Confirm photo usage rights.
