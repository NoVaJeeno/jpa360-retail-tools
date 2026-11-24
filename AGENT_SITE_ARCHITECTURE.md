# JPA 360° RECHNER — MANDATORY AGENT & AI ARCHITECTURE GUIDE
**Domain:** `https://rechner.jp-aring-advisory.de/`
**Repository:** `NoVaJeeno/jpa360-retail-tools` (Branch: `main`, deployed via GitHub Pages)
**Target Audience:** Gemini iOS App (ab Flash-Lite), Antigravity, und jeder Entwickler/Agent, der diese Website bearbeitet.

> **STOP & READ FIRST (PFLICHTREGEL FÜR JEDE KI AB GEMINI LITE):**
> **NIEMALS `index.html` komplett neu schreiben oder blind überschreiben!**
> Arbeite immer mit gezielten, minimalen Edits und prüfe vor jedem Commit die **6 unantastbaren Säulen** unten. Wenn auch nur eine Säule fehlt, darf NICHT gepusht werden.

---

## 1. Die 6 unantastbaren Säulen (NIEMALS löschen oder beschädigen!)

### Säule 1 — Originales JPA 360° Architektur-Logo (`.jpa-logo`)
Im `<header class="topbar">` von `index.html` muss **exakt** dieses Logo erhalten bleiben (niemals durch `<span class="brand-mark">J</span>` o. ä. ersetzen!):
```html
<a class="jpa-logo" href="#top" aria-label="JPA 360° Retail Advisory">
  <span class="jpa-box"><span>JPA</span></span>
  <span class="jpa-word">
    <span class="jpa-360">360°</span>
    <span class="jpa-sub">RETAIL ADVISORY</span>
  </span>
</a>
```
Das zugehörige CSS (`.jpa-logo`, `.jpa-box`, `.jpa-word`, `.jpa-360`, `.jpa-sub`) muss im `<style>`-Block von `index.html` erhalten bleiben.

### Säule 2 — Interaktiver 3D Astro-Bot (`astro-bot.js`)
- **Script-Einbindung (PFLICHT vor `</body>`):**
  ```html
  <script defer src="./astro-bot.js"></script>
  ```
  Muss aktiv bleiben auf: `index.html`, `saas-abloesung-entwickler.html`, `jeeno-paulo-aring.html`, `crm-saas-abo-ersetzen-eigenes-crm.html`, `bi-dashboard-saas-ersetzen-eigenes-reporting.html`.
- **Was `astro-bot.js` macht:** Echter 3D-Three.js-Roboter mit Freiflug über den gesamten Viewport, leuchtenden Cyan-Augen + rosa Bäckchen, 3D-Mini-Laptop beim Rechnen, 3D-Zahnarztstuhl bei Verlust/Minus (`≥ 15 %` Rabatt, `> 12 %` Mietquote oder `≥ 42.000 €` SaaS-Miete), 3D-Golden-Retriever (Reiten, Streicheln, Weglaufen), 3D-Outfits, 3D-Buch, 3D-Tee, Domain-Lock & Frame-Busting.
- **Geschützte DOM-IDs (NIEMALS umbenennen!):**
  - **Retail-Rechner (`index.html`):** `rUmsatz`, `rRabatt`, `rMarge`, `rFlaeche`, `rMiete`, `rUmsatz2`, `rBons`, `rPreis`, `rUpt` (sowie die Zahlenfelder `nUmsatz`, `nRabatt`, `nMarge`, `nFlaeche`, `nMiete`, `nUmsatz2`, `nBons`, `nPreis`, `nUpt` und Outputs `oDbVerlust`, `oMietquote`, `oExtraJahr`).
  - **SaaS-Rechner (`saas-abloesung-entwickler.html`):** `seats`, `perSeat`, `fixedSaas`, `buildBudget`, `outSaas36`, `outSave36`, `buchen`, `stickySaasWa`.
- **CSP-Pflicht:** Im `<meta http-equiv="Content-Security-Policy">` MUSS `https://cdn.jsdelivr.net` in `script-src` und `connect-src` erlaubt bleiben (wird für Three.js & GSAP benötigt!).

### Säule 3 — Mobile-Optimierung & seitliches Scrollen
Folgende CSS-Regeln müssen auf `index.html`, `saas-abloesung-entwickler.html` und `jeeno-paulo-aring.html` immer erhalten bleiben:
- `html, body { max-width: 100%; overflow-x: clip; }` (verhindert horizontales Verrutschen der Gesamtseite).
- Unter `@media (max-width: 768px)`: `nav`, `.preset-bar`, `.trust-strip`, `.social-bar`, `table` und breite Karten bekommen `overflow-x: auto; -webkit-overflow-scrolling: touch;` mit `flex-wrap: nowrap` auf Leisten.
- `input[type="number"], input[type="text"] { font-size: 16px; }` (verhindert ungewollten Auto-Zoom auf iOS Safari!).

### Säule 4 — WhatsApp & Social Media Vorschaubild (`og-astro-bot.jpg`)
- Die Open-Graph- & Twitter-Meta-Tags MÜSSEN in den **ersten 25 Zeilen von `<head>` (VOR `<style>`)** stehen, damit WhatsApp das Vorschaubild sofort lädt:
  - `og:image` & `og:image:secure_url` → `https://rechner.jp-aring-advisory.de/og-astro-bot.jpg`
  - `og:image:type="image/jpeg"`, `og:image:width="1200"`, `og:image:height="630"`
  - `twitter:card="summary_large_image"`, `twitter:image="https://rechner.jp-aring-advisory.de/og-astro-bot.jpg"`
- Datei `og-astro-bot.jpg` (`1200×630`, `132 KB` JPEG) niemals löschen oder > 300 KB aufblähen.

### Säule 5 — SEO, GEO, International (`/en/`) & 24/7 IndexNow
- `hreflang`-Tags (`de`, `de-DE`, `de-AT`, `de-CH`, `en`, `x-default`) und `<link rel="alternate" type="application/rss+xml" href="https://rechner.jp-aring-advisory.de/feed.xml" />` im `<head>` beibehalten.
- Neue HTML-Seiten immer in `sitemap.xml`, `feed.xml` und `llms.txt` ergänzen.
- `.github/workflows/indexnow-autopush.yml` und `6b7ad6d6e7d380221d7309a374b54765.txt` NIEMALS löschen (sorgen für 24/7 Auto-Indexierung bei jedem Push + jeden Montag).

### Säule 6 — Rechtliche, Marken- & Datenschutz-Grenzen (STRIKT!)
1. **KEINE GitHub-Links:** Niemals `github.com` oder `NoVaJeeno` im Footer, HTML, JSON-LD oder in `llms.txt` / `llms-full.txt` einbauen.
2. **KEINE Fremd-Arbeitgebernamen:** Niemals frühere Arbeitgeber-Marken nennen.
3. **Positionierung:** Jeeno Paulo Aring ist **kein theoretischer Unternehmensberater**, sondern ein **operativer Store- & Flächen-Praktiker** (Teambuilding auf der Fläche, tägliches Arbeiten mit Kennzahlen wie UPT, ATV, Conversion, DB I, Mietquote, frequenzorientierte Personaleinsatzplanung, 10-to-10 Morgenbriefing, Inventursicherheit, Führungskräfte-Coaching im Store) **+ Entwickler eigener Software-/KI-Systeme statt teurer SaaS-Abos (§ 611 BGB)**.
4. **Rechtssicherheit (UWG § 5 / RDG / StBerG / DSGVO):**
   - 0 Cookies, kein verstecktes Tracking.
   - Kennzahlen wie `+0,30 UPT` oder `88 % EBITDA-Durchfluss` immer klar als **Modellrechnung / Rechenhebel** kennzeichnen — niemals als Erfolgsgarantie!
   - Keine Rechts- oder Steuerberatung.
   - Direktkontakt: WhatsApp `https://wa.me/491708957669`, Instagram `@jpa360retail` / `@jpa.360.retail_advisory`, Hauptdomain `https://www.jp-aring-advisory.de`.

---

## 2. Seiten- & Dateikarte des Projekts
| Datei | Funktion |
|---|---|
| `index.html` | Haupt-Retail-Rechner (Rabatt vs. DB I, Mietquote, Kabinen-UPT `+0,30`, Fläche & Team, 3D Astro-Bot) |
| `saas-abloesung-entwickler.html` | 3-Jahres-SaaS-TCO-Rechner + Entwickler-Buchungsmodule (`490 €` / `1.450 €` / `2.900 €`, § 611 BGB) |
| `jeeno-paulo-aring.html` | Personal-Branding- & Experten-Hub |
| `en/index.html` | Internationaler English Hub (Retail Margin + SaaS Replacement Calculator) |
| `crm-saas-abo-ersetzen-eigenes-crm.html` | High-Intent Vergleichsseite: CRM-Abo vs. eigenes B2B-CRM |
| `bi-dashboard-saas-ersetzen-eigenes-reporting.html` | High-Intent Vergleichsseite: BI-/Reporting-Abo vs. eigenes Dashboard |
| `embed.html` | Kostenloses 1-Zeilen-Embed-Widget (organischer Backlink-Magnet) |
| `ratgeber-*.html` (7 Dateien) | Tiefe Praxis-Ratgeber (UPT, Rabatt-Falle, 10-to-10, Personaleinsatz, Inventur, SaaS-Ablösung) |
| `<stadt>.html` (35 Dateien) | Lokale DACH-Standortseiten (DE, AT, CH) |
| `astro-bot.js` | Minifizierter, domain-gesperrter 3D Three.js Astro-Bot (42 KB) |
| `og-astro-bot.jpg` | `1200×630` WhatsApp/Social-Vorschaubild (132 KB JPEG) |
| `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt`, `llms-full.txt` | SEO-, RSS- & KI-Crawler-Steuerung |
| `.github/workflows/indexnow-autopush.yml` | 24/7 automatischer IndexNow-Push bei Push + wöchentlichem Cron |

---

## 3. Pflicht-Check vor jedem `git push` (1-Zeilen-Test)
Jede KI muss vor dem Push prüfen, dass alle 6 Punkte in `index.html` vorhanden sind:
```bash
grep -c 'astro-bot.js' index.html && grep -c 'class="jpa-logo"' index.html && grep -c 'overflow-x:clip' index.html && grep -c 'og-astro-bot.jpg' index.html && grep -c 'rRabatt' index.html && test "$(grep -ci 'github.com' index.html)" -eq 0 && echo "ALL_6_PILLARS_OK"
```
Nur wenn **`ALL_6_PILLARS_OK`** erscheint, darf gepusht werden!
