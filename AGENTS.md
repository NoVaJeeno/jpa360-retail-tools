# AGENTS.md — Mandatory Pre-Edit Rule for `rechner.jp-aring-advisory.de`

**STOP! Before editing ANY file in this repository (especially `index.html` or `astro-bot.js`), you MUST read `AGENT_SITE_ARCHITECTURE.md` completely.**

Critical quick-rules:
1. NEVER rewrite `index.html` from scratch — use surgical patches only.
2. NEVER remove `<script defer src="./astro-bot.js"></script>`, the `.jpa-logo` architectural header logo, the `@media (max-width:768px)` horizontal-scroll mobile CSS, or the top-of-`<head>` `og-astro-bot.jpg` WhatsApp preview tags.
3. NEVER rename calculator slider/input IDs (`rUmsatz`, `rRabatt`, `rMarge`, `rMiete`, `rUmsatz2`, `rBons`, `rPreis`, `rUpt`, `seats`, `perSeat`, `fixedSaas`, `buildBudget`) without updating `astro-bot.js`.
4. NEVER add `github.com` links or third-party employer names anywhere on the site.
5. Run the 6-pillar check from `AGENT_SITE_ARCHITECTURE.md` before every `git push`.
