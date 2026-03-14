# Prompt 00 — Initial Theme Generation

## Prompt Given

> This is the initial theme export from Miles — the first full generation before any iterative refinements.

## What Was Generated

A complete WordPress block theme for a local music shop (Fleet Pro Sound) with:

- **theme.json** — v3 schema with color palette (10 colors), 2 font families, 10 font sizes, 6 spacing steps, 6 shadow presets, 4 gradients, custom line-height/font-weight tokens, and block-level style overrides.
- **8 templates** — front-page, home, page, single, index, archive, search, 404.
- **2 template parts** — header, footer.
- **7 patterns** — template-page, template-single, template-query-loop, template-archive, template-search, template-404, template-comments.
- **assets/css/styles.css** — Full stylesheet (~3000+ lines) covering every section of the site.
- **assets/css/editor-page.css** — Editor-specific overrides.
- **assets/js/script.js** — Interactive features (scroll effects, parallax, nav highlighting).
- **functions.php** — Theme setup, enqueue, and utility hooks.
- **Self-hosted fonts** — Big Shoulders Display (400/700/900) and Crimson Pro (400/400i/600) as WOFF2.

---

## What's Good

- **Complete template coverage.** All 8 standard templates are present. Pattern delegation keeps template files clean (one line each).
- **Consistent header/footer usage.** Every pattern-based template includes the same header and footer parts.
- **Color palette is well-structured.** Semantic slug names (`color-base`, `color-surface`, `color-accent`, etc.) with a clear hierarchy from background to text to accent.
- **Dedicated hover token.** `color-accent-hover` is a thoughtful addition most themes skip.
- **Self-hosted fonts with proper fontFace registration.** No external requests, correct WOFF2 format, multiple weights.
- **Fluid typography on display sizes.** The large sizes (`3xl`, `huge`, `display`, `display-sub`, `section`) use `clamp()` for responsive scaling.
- **Cache-busting via `filemtime()`.** Both CSS and JS use file modification time for versioning.
- **Default presets disabled.** `defaultPalette`, `defaultGradients`, `defaultDuotone`, `defaultFontSizes`, `defaultSpacingSizes`, and `defaultPresets` (shadows) are all set to `false`, giving the theme full control.
- **Pattern inserter visibility.** All template-only patterns correctly set `Inserter: false` and `Categories: hidden`.
- **Mobile navigation.** Header uses `overlayMenu: "mobile"` for the built-in WP hamburger menu.

---

## What's Missing

### Design System Gaps

- **No white color.** The closest is `color-cream` (#EDE4D6). A true `#ffffff` token is needed for any context requiring pure white.
- **No focus-ring token.** Focus outlines use `color-accent` in CSS but there is no dedicated `color-focus` in the palette, limiting independent control.
- **No active state token.** Hover is covered (`color-accent-hover`) but there is no pressed/active color.
- **Missing small spacing step.** The scale jumps from nothing to 0.5rem (slug `20`). A `10` step at 0.25rem would cover fine-grained spacing needs (e.g., the `gap: 3px` and `gap: 4px` values hardcoded throughout CSS).
- **No `content_width` global** set in functions.php.
- **No `load_theme_textdomain`.** None of the hardcoded strings in patterns are translatable.

### Accessibility

- **No skip-to-content link.** Not in the header, not anywhere in the theme. This is a WCAG failure.
- **No heading in the header.** The site title is rendered as a navigation item, not an `<h1>` or `wp:site-title` block.
- **Footer navigation is not semantic.** Links are individual `<p>` tags with anchors, not a `wp:navigation` block or `<nav>` element.

### Templates

- **front-page.html has no header/footer.** It uses only `wp:post-content`, meaning a newly assigned front page renders with no navigation or footer unless the page content itself includes them.

---

## Issues & Concerns

### theme.json

| Issue | Details |
|-------|---------|
| **Crimson Pro fallback is wrong** | Declared as `sans-serif` (theme.json line 152) but Crimson Pro is a serif font. Should be `serif`. |
| **Small font sizes are not fluid** | `small`, `base`, `lg`, `xl`, `2xl` are fixed `rem` values. WP's `fluid: true` global setting does not auto-apply to sizes this small without explicit `fluid: { min, max }` per size. |
| **Non-standard font size slugs** | `base`, `lg`, `xl`, `2xl`, `3xl` do not match WP conventions (`medium`, `large`, `x-large`, `xx-large`). They won't map to the editor's size picker presets. |
| **Spacing slug `65` is non-standard** | Named "Spacing 65" — should follow the pattern (`70` = "XX-Large" or similar). The jump from 4rem → 6rem → 8rem also breaks the doubling pattern (should be 4 → 8 or 4 → 6 with a 5rem step between). |
| **Shadow presets are unused** | Six shadows defined but none referenced in any template, pattern, or CSS. Dead configuration. |
| **Gradient slugs are meaningless** | `extracted-linear-1` through `extracted-linear-4` — no indication of purpose. The same gradient values are hardcoded in CSS instead of referencing these presets. |
| **Custom line-height tokens are unused** | Six tokens defined (`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`) but never referenced. CSS hardcodes line-height values throughout. |
| **Custom font-weight tokens are unused** | Nine tokens defined (`thin` through `black`) but never referenced. CSS hardcodes font-weight values throughout. |
| **Quote border is invisible** | `core/quote` border uses `color-base` (#13100D) — the same color as the background. CSS overrides it to `color-accent`, making the theme.json setting dead code. |
| **Separator is invisible** | `core/separator` has `border-width: 0` and `border-style: none` with no CSS re-styling. Separators will render as nothing. |
| **List padding stripped** | `core/list` with `padding-left: 0` combined with the global `* { padding: 0 }` reset clips list markers. |
| **contentSize vs wideSize too close** | 1200px vs 1400px — only 200px difference (14%). "Wide" alignment barely looks different from default. |

### Templates & Patterns

| Issue | Details |
|-------|---------|
| **Hardcoded navigation ref** | Header references `"ref": 14` — a specific nav menu post ID. Breaks on fresh installs or different environments. |
| **Hardcoded text strings** | "Blog Post" (template-single), "Latest Posts" / "From The Blog" (template-query-loop), "Archive" (template-archive), "Search Results" (template-search), "Comments" (template-comments). None are translatable. |
| **Hardcoded copyright** | Footer contains "2026 Fleet Pro Sound. All rights reserved." — year and business name are static. |
| **Hardcoded store name** | Footer uses "Fleet Pro Sound" text instead of `wp:site-title`. |
| **Post card markup duplicated 3x** | The featured-image + date + title + excerpt card structure is copy-pasted across `template-query-loop`, `template-archive`, and `template-search`. Should be a shared pattern. |
| **Single-child wrapper groups** | template-page has a wrapper around `wp:post-featured-image` that only adds a border — could be applied to the image directly. template-single has a wrapper around the "Blog Post" label paragraph only to add margin. |
| **fontFamily attributes use raw CSS vars** | Patterns set `fontFamily` as `var(--wp--preset--font-family--big-shoulders-display)` instead of the proper preset slug. WP may not resolve these through the preset system. |
| **Homepage button not multisite-safe** | 404 pattern links "Back to Homepage" to `/` — should use `wp:home-link` or a dynamic URL. |
| **`blockGap: "4px"` hardcoded** | template-comments uses a pixel value instead of a spacing preset. |

### CSS

| Issue | Details |
|-------|---------|
| **Aggressive global reset** | `*, *::before, *::after { margin: 0; padding: 0; }` strips default spacing from every core block. Theme must re-style every block individually or spacing collapses. |
| **Duplicate font variables** | `:root` declares `--font-display` and `--font-body` (used ~62 times in CSS) instead of referencing the WP preset variables `--wp--preset--font-family--*`. |
| **Gradients hardcoded in CSS** | The same gradient values defined in theme.json are hardcoded in CSS (hero overlay, gear card overlays, lessons overlay) instead of referencing the presets. |
| **Hardcoded `max-width: 1280px`** | Used ~8 times in CSS. Does not match theme.json `contentSize` (1200px) or `wideSize` (1400px). A third unlisted layout width. |
| **Massive CSS duplication** | Nearly every section's styles are written twice — once with bare selectors and once wrapped in `:root :where()` for WP block specificity. This roughly doubles the file size. |
| **Hardcoded rgba colors throughout** | `color-base`, `color-caramel`, `color-accent`, and `color-surface` values appear as raw rgba() in dozens of places instead of referencing palette tokens. |
| **Line-height and font-weight hardcoded everywhere** | Despite tokens existing in theme.json, CSS uses raw numeric values (`0.85`, `1.6`, `1.8`, `700`, `900`, etc.) throughout. |

### JavaScript

| Issue | Details |
|-------|---------|
| **Active nav highlighting selectors are wrong** | Targets `.site-header__nav a` but the WP navigation block renders `.wp-block-navigation-item__content`. The highlighting feature does nothing. |
| **Active nav uses wrong CSS variable** | Sets `link.style.color = 'var(--color-cream)'` — should be `var(--wp--preset--color--color-cream)`. |
| **Duplicate sticky header code** | Feature 1 (lines 6-24) and Feature 6 (lines 123-149) both add `is-scrolled` on scroll but target different selectors. Feature 6's `.miles-sticky-top` class is not used in any template. |
| **Deprecated API** | Uses `window.pageYOffset` (deprecated) instead of `window.scrollY`. |
| **Smooth scroll redundancy** | JS smooth scrolling duplicates CSS `scroll-behavior: smooth`. The JS adds header offset, but `scroll-padding-top` in CSS would handle that. |

### functions.php

| Issue | Details |
|-------|---------|
| **Page title support removed globally** | `remove_post_type_support('page', 'title')` removes the title field from all pages — affects admin listings, SEO, and browser tabs, not just the editor display. |
| **Inline script output** | Raw `<script>` tag via `wp_head` instead of `wp_add_inline_script`. |
| **No `wp-block-styles` support** | Intentional given the custom resets, but means every core block must be styled from scratch. |

---

## Recommendations

### High Priority

1. **Add a skip-to-content link** in the header template part.
2. **Replace hardcoded nav `ref: 14`** with a fallback navigation or page list block.
3. **Fix the Crimson Pro fallback** from `sans-serif` to `serif`.
4. **Use `wp:site-title`** in the footer instead of hardcoded "Fleet Pro Sound".
5. **Make copyright year dynamic** — use a shortcode, `wp:shortcode`, or a simple PHP-rendered pattern.
6. **Extract the post card into a shared pattern** used by query-loop, archive, and search templates.
7. **Fix font size slugs** to match WP conventions: `base` → `medium`, `lg` → `large`, `xl` → `x-large`, `2xl` → `xx-large`.
8. **Remove unused custom tokens** (line-height, font-weight) from theme.json, or start referencing them in CSS.
9. **Remove unused shadow presets** or apply them somewhere intentionally.

### Medium Priority

10. **Rename gradient slugs** to describe their purpose (e.g., `hero-overlay`, `card-darken`, `accent-glow`, `section-vignette`).
11. **Replace `:root` font variables** in CSS with `var(--wp--preset--font-family--*)` references.
12. **Eliminate the duplicate CSS** — keep only the `:root :where()` versions needed for WP block specificity.
13. **Replace hardcoded `max-width: 1280px`** with a theme.json token or CSS variable.
14. **Add `fluid: { min, max }` objects** to the smaller font sizes (`small` through `2xl`).
15. **Fix the active nav highlighting JS** — update selectors to match WP navigation block markup, or remove the feature.
16. **Remove the duplicate sticky header code** (Feature 6 / `.miles-sticky-top`).
17. **Add a heading block or `wp:site-title`** in the header for proper document hierarchy.
18. **Add front-page.html header/footer** so newly assigned static front pages have navigation.

### Low Priority

19. **Add a `10` spacing step** (0.25rem) and rename slug `65` to `70` with label "XX-Large".
20. **Add `color-white` (#ffffff)** to the palette.
21. **Replace raw `<script>` in functions.php** with `wp_add_inline_script`.
22. **Replace CSS smooth scroll** with `scroll-padding-top` on `<html>` and remove the JS smooth scroll handler.
23. **Replace `window.pageYOffset`** with `window.scrollY`.
24. **Flatten single-child wrapper groups** in patterns where the styling can be applied directly to the child block.
25. **Use `fontFamily` preset slugs** in pattern block attributes instead of raw CSS variable strings.
26. **Reference gradient presets** in CSS instead of hardcoding the same values.
27. **Use `wp:navigation`** in the footer instead of individual paragraph links.
28. **Add `load_theme_textdomain`** and wrap hardcoded strings in translation functions.
