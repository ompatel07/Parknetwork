# Park Live Network — website

Marketing website for **Park Live Network**, a global live-streaming and audio-chat platform management network serving every country. Seven separate roles: Super Admin, Admin, Manager, BD, Agency, Coin Seller and Live Host.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Motion · three.js · React Hook Form + Zod · Resend · Cloudflare Turnstile.

## The concept — "The Signal"

One persistent WebGL particle system runs behind every page and reshapes itself as you scroll:

| Scene | Where | What it forms |
| --- | --- | --- |
| `mark` | Hero, final CTA, Careers/About heroes | The logo's broadcast mark (play button + signal arcs) |
| `wave` | Manifesto, Contact | An audio waveform terrain |
| `rings` | Services, Partnership | Broadcast rings rippling outward |
| `globe` | Global reach, About | A dotted Earth with the 9 world regions lit (the network serves every country) |
| `dust` | Everything else | A loose, drifting field |

Any section opts in with `data-scene="globe"` (plus optional `data-scene-align="left|right|center"` and `data-scene-dim="0.4"`). See `src/components/world/`.

### Animations and "reduce motion"

All motion is controlled by one switch, `<html data-motion="on|off">`, set before the page paints (`src/lib/motion.ts`):

- By default (`site.motion.default = "system"`), the site follows the visitor's device setting. On Windows, turning off **Settings → Accessibility → Visual effects → Animation effects** makes Chrome report "prefers reduced motion", and the site then shows a calm, static version.
- When that happens, a small prompt offers **Enable animations**. The footer also has a Motion On/Off switch. Both choices are remembered.
- To always animate regardless of the device setting, set `motion: { default: "on" }` in `src/config/site.ts`.

Phones get a smaller particle budget, and low-end devices get fewer particles still.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values (all optional for local preview)
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Editing business details — `src/config/site.ts`

**All** brand and contact data lives in one file: name, tagline, WhatsApp, emails, socials, regions, stats, services, roles, steps and FAQs. Search the file for `PLACEHOLDER`. Every value marked that way must be confirmed by the client before launch.

- `contact.formRecipient` is the inbox that receives every form submission.
- `team`: leadership shown as "backstage passes" on the homepage and About page. Photos live in `public/team/` (720×900 JPG). After swapping a photo, regenerate its blur placeholder in `src/data/team-blur.ts`, or delete that entry.
- `platforms`: the platform logos in the "Platform ecosystem" section, stored in `public/platforms/` (480×480). Set `platforms.show: false` to hide all logos. Only list platforms the client has worked with and may show.
- `stats`, `about`, `services`, `whyChoose`, `trust`, `values` and `audiences` hold the client-supplied copy. Values marked `// CLIENT` came from the client.
- `roles`: seven separate roles (Super Admin, Admin, Manager, BD, Agency, Coin Seller, Live Host), each with its own subtitle, duties, requirements and photo. `form` decides which application form opens. They appear in the "Find your seat" switcher on the homepage and Careers page.
- `regions`: the 9 world regions on the globe (with lat/lng for the camera). The network serves every country; `coverage` is the label shown with them.
- `stats.show: false` hides the stats strip.
- Content rules: no guaranteed-earnings claims, no fake testimonials, and third-party platform logos only with the client's permission (see `platforms`).

## Logo

The official logo (transparent background) is `public/brand/logo.png` (800px). Smaller copies: `public/brand/logo-256.png` (preloader, social image), `public/brand/icon-192.png` / `icon-512.png` (app manifest), `src/app/icon.png` (browser tab) and `src/app/apple-icon.png` (home screen). To update it, export a new transparent square PNG and replace all six files.

## Photography — `src/config/media.ts`

The site uses 22 stock photos from [Pexels](https://www.pexels.com/license/) (free for commercial use, no attribution required). They live in `public/images/`, and their sizes and blur placeholders are in `src/data/photos.ts`. **These are placeholders. The people shown are models, not the client's hosts.**

To use the client's own photos:

1. Put the new files in `public/images/` (JPG, around 2000px on the long side).
2. Add each one to `src/data/photos.ts` (`width`, `height`, and a tiny `blur` data URL).
3. Point the slots in `src/config/media.ts` (hero feeds, services, roles, reel and so on) at the new keys, and write alt text in `ALT`.

Photos load through `next/image` (AVIF/WebP, responsive sizes, lazy by default). `<Frame>` wipes each photo open on scroll and adds a slight parallax.

## Forms

There are six forms: agency registration, host application, coin seller enquiry, business partnership, customer support, and team role applications.

- Fields: `src/lib/forms/fields.ts`. Validation (shared by browser and server): `src/lib/forms/schemas.ts`.
- Server action: `src/app/actions/submit.ts`. It runs a honeypot check, rate limiting (5 per 10 min per IP), Turnstile verification, Zod validation, then emails the submission via Resend.
- The four team roles (Super Admin, Admin, Manager, BD) share the team application form; Agency, Coin Seller and Live Host each have their own.
- Without `RESEND_API_KEY`, forms still validate and show success, with a visible "preview note" that email isn't connected yet.

## Performance notes

The site is tuned to stay smooth on mid-range phones. When adding features, keep to these rules:

- Read the scroll position with `getScrollY()` / `onScrollY()` from `src/lib/scroll.ts`, never `window.scrollY` inside animation frames (that forces a page layout every frame).
- Animate only `transform` and `opacity`. Don't put CSS variables or container units (`cqw`) inside `@keyframes`; use the Web Animations API with plain values instead (see the hearts in `LivePhone.tsx`).
- Don't wrap animated content in `transform-style: preserve-3d` unless children really use depth. It keeps every animation inside on the main thread.
- Avoid `backdrop-filter` blur over the particle canvas.
- Off-screen sections pause their CSS animations automatically (`data-inview`, set in `RevealObserver.tsx`).
- Links prefetch when hovered or touched, not when they scroll into view (`TransitionLink.tsx`).
- To debug without the particle world, run `localStorage.setItem("pln:noworld", "1")` in the browser console and reload (remove it to switch the world back on).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | for production | Canonical URL for SEO, sitemap and social images |
| `RESEND_API_KEY` | to deliver forms | API key from resend.com |
| `EMAIL_FROM` | with Resend | Sender on a domain verified in Resend, e.g. `Park Live Network <noreply@parklivenetwork.com>` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | recommended | Cloudflare Turnstile spam protection; the widget only appears when the site key is set |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | optional | Shared rate limiting across serverless instances |

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project**, import the repo, and keep the defaults (framework: Next.js).
3. Add the environment variables above under **Settings → Environment Variables**.
4. Deploy. Preview deployments are automatically `noindex`.
5. When the domain is ready, add it under **Settings → Domains** and set `NEXT_PUBLIC_SITE_URL` to it.

## Project structure

```
src/
  app/                 routes, server action, sitemap/robots/manifest/OG image
  config/site.ts       ← all business data (PLACEHOLDER-marked)
  components/
    world/             the particle world (shapes, shaders, scene store/director)
    sections/          page sections (home, shared, careers)
    motion/            cursor, smooth scroll, page transitions, reveals, effects
    forms/             SmartForm + Turnstile
    layout/            header, mobile menu, footer
    ui/                buttons, badges, accordion, tabs, sheet…
  lib/                 hooks, GSAP setup, forms (schemas, fields, rate limit)
  data/world-dots.ts   generated land dots (Natural Earth, public domain)
```

## Before launch checklist

- [ ] Replace every `PLACEHOLDER` in `src/config/site.ts`
- [ ] Replace the stock photography with the client's own (see `src/config/media.ts`)
- [ ] Verify the stats, the regions and the services offered
- [ ] Confirm the wording of the seven roles, and permission to show each platform logo
- [ ] Have the Privacy Policy and Terms reviewed by the client or a lawyer (both pages carry a review banner)
- [ ] Set up Resend (verified domain) and Turnstile keys
- [ ] Connect the domain and set `NEXT_PUBLIC_SITE_URL`
