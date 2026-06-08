# DESIGN_NOTES.md — Secfi.com Study → Kova Mapping

Research target: **https://secfi.com** (a fintech where Santiago previously worked as a Product Manager, per the PPM). The user has asked to study Secfi's design fundamentals and map each finding to the equivalent file/variable in our codebase. **No code has been edited yet** — this document is a research + proposal deliverable for approval.

---

## 1. Sources studied

| URL | Status | What I extracted |
|---|---|---|
| https://secfi.com (homepage) | 200 OK | Raw HTML, inline `:root` CSS variables, all hex codes in inline styles, font family declarations, class-name conventions |
| https://secfi.com/about | 200 OK | Team section structure, trust signals (stats + press logos + investor logos), headline hierarchy |
| https://secfi.com/services | **404 Not Found** | (Secfi doesn't use a single /services route — services are split across `/liquidity-overview`, `/wealth`, etc.) |

The extraction recovered **concrete values** (hex codes, CSS variable names, font family) directly from inline styles in Secfi's deployed HTML — these aren't model summaries, they're the actual production values.

---

## 2. Color palette

### What Secfi uses (extracted from inline CSS variables + hex codes in the homepage HTML)

```
Primary surfaces:
  --color-theme-background:        #ffffff      (pure white — default)
  --color-taupe-200:               #eeece3      (warm cream — alternate sections)
  --color-taupe-300 (inferred):    #d9d4ca      (deeper taupe — used on subtle blocks)

Text:
  --color-theme-text:              #292A2D      (warm near-black, not cool black)
  --color-brown-dark:              #463f3c      (deep warm brown — for alternate-themed sections)

Accent / brand:
  Dark teal:                       #004250      (Secfi signature — used on accent-themed sections)
  Mint / light teal:               #ddf0e9      (subtle surface tint that pairs with the dark teal)

Status / utility (not part of brand):
  #1976d2 (Material link blue), #d32f2f (error red), #da532c (Microsoft tile)
```

**Key insight:** Secfi's palette is **warm**, not cool. They run a four-axis system:
1. White (primary surface, ~70% of page)
2. Taupe/cream (secondary surface, used for ~20% — quote sections, feature blocks)
3. Brown-dark (when the section IS the accent — full warm-dark theme, ~5%)
4. Dark teal + mint pair (used sparingly — buttons, CTAs, the occasional accent block)

Theme is applied via **CSS variables that get rebound per-section** — e.g., `style="--color-theme-text: var(--color-brown-dark); --color-theme-background: var(--color-taupe-200);"` is what they apply to a "warm taupe theme" section. Components inside the section automatically inherit the rebinding. Smart pattern — worth copying.

### Mapping to our [styles.css](styles.css)

Current Kova variables (lines 16–40 of `styles.css`):

| Kova variable | Current value | Secfi equivalent | Recommended change | Rationale |
|---|---|---|---|---|
| `--bg` | `#FAFAF7` (cool warm-off-white) | `#ffffff` primary, `#eeece3` secondary | **Keep `#FAFAF7`** + **add `--bg-warm: #EFECE3`** as new variable for accent-themed sections | Our cream is already warm; just need a deeper warm option for the per-section theming pattern |
| `--bg-2` | `#F2F0EA` | `#d9d4ca` (deeper taupe) | **Deepen slightly to `#EAE6DC`** | Closer to Secfi's secondary surface; reads as a deliberate alternate, not just a slightly different cream |
| `--ink` / `--text` | `#0A0E14` (cool near-black) | `#292A2D` (warm near-black) | **Shift to `#1A1A1F`** | Loses the cool blue tint, picks up Secfi's warmth without going as light as Secfi (their `#292A2D` may be too gray for our editorial register) |
| `--text-mute` | `#5C6B7A` (cool slate) | inferred warm gray | **Shift to `#6B6760`** | Warm muted gray — supports the warm palette |
| `--text-faint` | `#8B96A4` (cool light slate) | inferred warm light gray | **Shift to `#9E9A92`** | Same |
| `--copper` | `#C4855A` (Kova brand orange) | `#004250` (Secfi dark teal) | **KEEP COPPER — this is the Kova brand.** Don't swap. | Secfi's teal is *their* brand. Our brand is copper. Adopting Secfi's accent would erase Kova's identity. The fundamentals to adopt are the warm-palette *system*, not the brand color. |
| `--hairline` | `rgba(10,14,20,0.08)` (cool) | warm hairline | **Shift to `rgba(26,26,31,0.08)`** | Match the new warm ink |
| `--hairline-strong` | `rgba(10,14,20,0.16)` | — | **Shift to `rgba(26,26,31,0.16)`** | Same |

**Strategic decision the user has to make** (see §8 Open Questions): how warm to go. Three options range from minimal change to full Secfi-style warm palette.

---

## 3. Typography

### What Secfi uses

```
font-family: Matter, sans-serif;
```

**Matter** is a paid typeface from Displaay (~$150 commercial license). It's a geometric/humanist sans-serif with subtle warmth — think a less-sharp Inter, more in the neighborhood of Söhne, GT Walsheim, or Aeonik.

**Type scale classes observed** in their HTML:
- `surtitle` — small uppercase eyebrow label (their version of our `.section-label`)
- `text-m` — body / medium text
- `text-s` — small descriptive text
- Heading sizes inferred large but no specific numeric scale extracted

Headings appear **bold/semibold**, body appears regular weight. No italic usage observed on the homepage.

### Mapping to our [styles.css](styles.css)

| Kova variable | Current value | Secfi equivalent | Recommended change |
|---|---|---|---|
| `--sans-display` | `'Inter Tight', 'Inter', system-ui` | `Matter, sans-serif` | **Keep Inter Tight.** It's the closest free Matter substitute. (If you want to license Matter properly, that's a $150 brand decision — flag it.) |
| `--sans` | `'Inter', system-ui` | `Matter, sans-serif` | **Keep Inter** for body |
| `--serif` | `'Source Serif 4', Georgia, serif` | — | **Reconsider** — Secfi uses no serif at all. The Source Serif italic accent in our hero subhead (`.hero-subhead-italic`) is the only place we use it. If we adopt Secfi's minimalist sans-only register, we could drop the serif entirely. **Open question — see §8.** |

**Specific type-scale tightenings** that match Secfi's register:
- Our hero headline currently maxes at `5.25rem` (84px). Secfi's homepage hero is **roughly equivalent** — no change needed.
- Our `.section-headline` (max `3rem`) feels right.
- Add explicit utility classes like Secfi's `.text-s`, `.text-m`, `.surtitle` — useful for any future copy work. Currently we have `.section-label`, `.body-text` — these already cover the cases, but **renaming `.section-label` → `.surtitle`** would let us follow Secfi's vocabulary if you like.

---

## 4. Spacing & layout

### What Secfi uses

- Generous section padding — visually estimated **80–120px** vertical between major blocks
- Max content width: their `container-l` class suggests **~1200–1280px** desktop max
- Lots of whitespace inside cards (24–40px interior padding)
- Strong vertical rhythm — no cramped sections

### Mapping to our [styles.css](styles.css)

| Kova variable | Current value | Secfi equivalent | Recommended change |
|---|---|---|---|
| `--max-w` | `1240px` | ~1200–1280px | **Keep as-is**. Already aligned. |
| `--gutter` | `clamp(1.5rem, 5vw, 4rem)` | similar | **Keep as-is** |
| `--section-pad` | `clamp(6rem, 11vw, 11rem)` | similar to slightly more generous | **Keep as-is**. We're already at the generous end. |

**Layout system is already aligned with Secfi.** No changes needed here. This is good — we got the bones right in the redesign.

---

## 5. Component patterns

### What Secfi uses

**Nav** (extracted from inline class names):
- Sticky nav (`menu_wrapper`, no transparency over hero observed)
- **Multi-column hover dropdowns** with section titles + short descriptions per link (e.g. "Liquidity Solutions For Employees" + a one-line description below)
- Logo + primary nav items + Login + Get Started CTA on the right
- Dropdowns are **rich** — not just text links, each has a small body of explanatory copy

**Buttons** (extracted from inline class names):
- `btn_btn` base + `btn_outline` (secondary) and `btn_medium` (size) variants
- A button **system** with composable modifiers — not one-off styles per CTA
- Inferred shape: rounded rectangle, modest radius (no class name signals a pill or square)

**Cards / sections**:
- Each section has a `style="--color-theme-text: ...; --color-theme-background: ...;"` inline rebinding
- Components inside inherit the section theme — this is how they paint a section warm-taupe and the buttons + text automatically adapt
- "Icon + heading + short description" pattern repeated (e.g. "We've been in your shoes before")

**Trust signals**:
- Stats block — Big numbers: "55K employees, $90B equity registered, $790M provided"
- Press logo strip: TechCrunch, Forbes, WSJ, Fortune, CNBC
- Investor logo strip on /about

### Mapping to our [index.html](index.html) + [styles.css](styles.css)

| Pattern | Have it? | Action |
|---|---|---|
| Sticky nav | ✅ Yes — `.site-header` + `.scrolled` class | No change |
| Transparent nav over hero | ✅ Yes — already implemented | No change |
| **Multi-column dropdown nav** with descriptions | ❌ No | Optional — our nav is simple (5 sections). Not needed unless we add real sub-pages. **Don't build until we have content.** |
| **Per-section theme rebinding** via inline CSS variables | ⚠️ Partially — we use distinct section classes (`.section-sectors`, `.section-contact`) with hardcoded dark backgrounds | **Worth adopting** — refactor to set `--color-bg` + `--color-text` per section, let components inherit. More flexible. |
| Button system with `outline` + size variants | ⚠️ Partially — we have `.btn .btn-primary`, `.btn .btn-secondary`, `.btn-full` | Already close to Secfi's pattern. Could rename for parity (`.btn-outline` instead of `.btn-secondary`) but functional today. |
| **Stats / numbers trust block** | ❌ No | **Worth adding** — Kova could surface "$10M–$20M target revenue, 24-month search, two operators, 10-year horizon" as a stat block. Echoes Secfi's "55K employees, $90B equity" pattern. |
| **Press / investor logo strip** | ❌ Placeholders only (4 dashed boxes) | Already planned — wire in real logos when available |
| Icon + heading + short description cards | ⚠️ Partially — our sector cards have label+title+desc but no icons | Could add small monoline icons (e.g. 24px line icons) above each sector title. Cleaner with than without. |

---

## 6. Overall tone — Secfi vs Kova

**Secfi register:**
- Warm minimalism (taupe + brown + dark teal)
- Editorial fintech-advisor
- Trustworthy through *restraint*, not through chrome
- Content-rich but breathing
- Implicit message: "we're considered, premium, here for the long haul"

**Kova current register (post-redesign on `kovacapital.io`):**
- Cool minimalism (near-black + cream + copper)
- Modern advisory firm leaning slick
- Implicit message: "we bring 2025 sophistication"

**The shift Secfi-ward would mean:**
- Slightly **warmer** color temperature throughout (warm text, warm hairlines, warm surfaces)
- Adopting the per-section theme-variable pattern (smart engineering)
- Possibly **simpler typography** (drop serif entirely, sans-only register)
- Adding **stats/trust blocks** as a section pattern

**What Kova KEEPS regardless of the shift:**
- Copper as the brand accent (don't swap to teal)
- Inter Tight for display, Inter for body (close enough to Matter for free)
- Asymmetric section grids (rail + body) — not a Secfi pattern but it's editorial, fits our advisory voice
- Bilingual ES/EN structure
- The hero duotone treatment (Secfi has no hero image like ours, but the duotone works for us)

---

## 7. Concrete mapping table — file & variable changes

Below is the **complete change set** I'd execute if you approve. Nothing here is applied yet.

### `styles.css`

```css
:root {
  /* Surfaces — shift to warmer cream system */
- --bg:         #FAFAF7;
- --bg-2:       #F2F0EA;
+ --bg:         #FAFAF7;             /* unchanged — primary off-white */
+ --bg-warm:    #EFECE3;             /* NEW — for warm-themed sections (Secfi taupe-equivalent) */
+ --bg-2:       #EAE6DC;             /* deepened — alternate surface */

  /* Ink — warm near-black instead of cool */
- --ink:        #0A0E14;
- --ink-2:      #161B23;
- --ink-3:      #232A33;
- --text:       #0A0E14;
+ --ink:        #1A1A1F;             /* warmer dark */
+ --ink-2:      #2A2A2F;             /* warmer dark-2 */
+ --ink-3:      #3A3A3F;             /* warmer dark-3 */
+ --text:       #1A1A1F;             /* matches new ink */

  /* Text muted — warm gray instead of cool slate */
- --text-mute:  #5C6B7A;
- --text-faint: #8B96A4;
+ --text-mute:  #6B6760;             /* warm muted gray */
+ --text-faint: #9E9A92;             /* warm light gray */

  /* Accent — UNCHANGED (this is Kova's brand) */
  --copper:     #C4855A;
  --copper-dark:#A86B42;

  /* Lines — warmer to match new ink */
- --hairline:        rgba(10,14,20,0.08);
- --hairline-strong: rgba(10,14,20,0.16);
+ --hairline:        rgba(26,26,31,0.08);
+ --hairline-strong: rgba(26,26,31,0.16);
  --hairline-dark:   rgba(250,250,247,0.10);  /* unchanged — used on dark sections */

  /* Type — UNCHANGED */
  --sans-display: 'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif;
  --sans:         'Inter', system-ui, -apple-system, sans-serif;
  --serif:        'Source Serif 4', Georgia, serif;     /* see §8 — possibly drop */

  /* Layout — UNCHANGED */
  --max-w:      1240px;
  --gutter:     clamp(1.5rem, 5vw, 4rem);
  --section-pad:clamp(6rem, 11vw, 11rem);
}
```

### Section theming refactor (new pattern)

Currently `.section-sectors` and `.section-contact` hardcode `background: var(--ink); color: var(--bg);` — workable but inflexible. Secfi's approach is per-section variable rebinding:

```css
/* CURRENT — hardcoded */
.section-sectors {
  background: var(--ink);
  color: var(--bg);
  ...
}
.section-sectors .section-headline { color: var(--bg); }
.section-sectors .section-intro    { color: rgba(250,250,247,0.65); }

/* PROPOSED — Secfi-style theme rebinding */
.theme-dark {
  --bg-current:        var(--ink);
  --text-current:      var(--bg);
  --text-mute-current: rgba(250,250,247,0.65);
  --hairline-current:  var(--hairline-dark);
  background: var(--bg-current);
  color: var(--text-current);
}
.theme-warm {
  --bg-current:        var(--bg-warm);
  --text-current:      var(--ink);
  --text-mute-current: var(--text-mute);
  --hairline-current:  var(--hairline);
  background: var(--bg-current);
  color: var(--text-current);
}
/* Components inside inherit automatically */
.section-headline { color: var(--text-current, var(--text)); }
.section-intro    { color: var(--text-mute-current, var(--text-mute)); }
```

Then in `index.html`:
```html
<section class="section-sectors theme-dark" id="sectors">…</section>
<section class="section-contact theme-dark" id="contact">…</section>
<section class="section-team theme-warm" id="team">…</section>   <!-- NEW — warm taupe for team section -->
```

This makes adding "warm taupe" sections trivial without writing new section-specific overrides.

### `index.html`

Two structural additions worth considering (not required):

1. **Stats / numbers trust block** — to mirror Secfi's "55K employees, $90B equity" pattern. Position: above the Contact section, or at the end of the Sectors section. Content:
   ```
   $10–20M USD     /     2 operadores     /     1 empresa     /     10 años
   Ingresos objetivo  ·   En el día del cierre  ·  El portafolio entero  ·  Horizonte de inversión
   ```

2. **Sector card icons** — small 24px monoline icons above each sector title (currently icon-less). Optional polish.

### `script.js`

No changes required. (Theming via CSS variables doesn't need JS.)

---

## 8. Open questions for you to decide before I write code

These are strategic — your call, not mine.

1. **How warm do you want to go?**
   - **(a)** Light shift — apply only the warm-ink change (`#0A0E14` → `#1A1A1F`) and the warm hairlines. Everything else stays. Subtle.
   - **(b)** Medium shift — light shift PLUS add the `--bg-warm` taupe surface variable for the team section. Visible but not jarring.
   - **(c)** Full shift — all warm changes above, including the section-theme refactor and warm muted gray text. Closest to Secfi.

2. **Drop Source Serif 4 italic entirely?**
   - Currently the hero subhead's italic tail ("Una empresa, dos operadores, diez años." — though now replaced by the "Your legacy" tagline) uses Source Serif 4 italic.
   - Secfi uses **no serif at all** — sans-only register.
   - Recommend dropping it for sans-only consistency. The hero tagline "Kova Capital. Your legacy, our commitment." doesn't need the italic moment anymore.

3. **License Matter (the Secfi typeface)?**
   - ~$150 one-time license from Displaay. Visible quality bump over Inter Tight.
   - Alternative: stay on Inter Tight (free, very close visually).
   - My recommendation: **stay on Inter Tight** for now; license Matter only if Kova grows enough to justify brand-level typography spend.

4. **Add a stats / numbers trust block?**
   - Could surface Kova's quantified pitch ($10–20M target revenue, 2 operators, 10 years) as a structured block.
   - Risk: feels too "marketing" / "deck" for an advisory firm.
   - Reward: aligns with the trust-signal pattern Secfi (and Sakai, and most modern advisory sites) use.

5. **Add small monoline icons to the sector cards?**
   - Tiny visual cue per sector. Industrial wrench / SaaS code-bracket / "Additional" plus-sign.
   - Could feel a bit "templated" — or it could be the polish that makes the cards land.
   - Open call.

---

## 9. Recommendation

If you want the **Secfi feel without losing Kova's identity**, my recommendation is:

1. **Apply option (b)** from §8.1 — medium warm shift (warm ink + warm hairlines + new `--bg-warm` taupe variable used on the team section).
2. **Refactor section theming** to the variable-rebinding pattern. Mostly an internal cleanup that pays dividends as we add sections.
3. **Drop Source Serif 4** for sans-only consistency.
4. **Keep copper** — it's Kova's brand.
5. **Add a stats trust block** above the Contact section. Concrete differentiator.
6. **Skip sector icons** — keep the editorial restraint we already have.
7. **Skip Matter license** — Inter Tight is close enough.

Total scope: ~10 lines changed in `styles.css` for the palette shift, ~30 lines refactored for the section-theme pattern, one new section in `index.html`, a few small copy additions to `copy.json` for the stats block.

I can execute this once you approve, or you can pick a different set of options from §8 and I'll adjust.

---

*Notes generated from study of the live secfi.com homepage and /about page, with raw HTML / CSS variable extraction. No screenshots were available — visual interpretation is based on extracted code values + content structure.*
