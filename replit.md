# GateCtr Blog

The official GateCtr blog — practical insights on LLM cost optimization, model routing, and AI infrastructure.

**URLs:** blog.gatectr.com | links to app.gatectr.com, docs.gatectr.com, gatectr.com

## Stack

- **Frontend**: React 19, React Router 7, TypeScript 5.9
- **Backend**: Express 5 (admin API on port 3001, proxied via Vite `/api`)
- **Build**: Vite 8 + MDX plugin, running on port 5000
- **Styling**: CSS Modules with GateCtr brand tokens
- **Runtime**: Node.js 20
- **Dev runner**: `concurrently` — Vite + Express start together with `npm run dev`

## Brand

- Navy: `#1b4f82` — primary actions, titles
- Teal: `#00b4c8` / `#00d4e8` — accent, CTA buttons, tags
- Dark text: `#1a202c`, body text: `#4a5568`
- Display font: Syne (700, 800) — headings
- Body font: Inter — paragraph text
- Mono font: JetBrains Mono — code blocks
- Logo: "Gate**C**tr" where only the **C** is teal (`#00b4c8`)

## Project Structure

```
src/
  components/     # Header (GateCtr SVG logo + nav), Footer, PostCard
  context/
    LangContext.tsx    # FR/EN language context
    AdminContext.tsx   # JWT-in-memory auth context (login, logout, token)
  pages/
    Home.tsx           # Blog listing
    PostPage.tsx       # Article page (tracks views + 80% reads via /api/track)
    About.tsx
    admin/
      AdminLogin.tsx         # /admin/login — email+password form
      AdminDashboard.tsx     # /admin/dashboard — KPIs + article table + delete
      AdminEditor.tsx        # /admin/editor — publish new MDX article
      AdminLayout.tsx        # Protected shell (redirects to /admin/login if unauthed)
  posts/          # *.mdx — English blog posts (11 total)
  posts/fr/       # *.mdx — French blog posts (11 total)
  lib/
    posts.ts      # MDX loader: getPosts(), getPostBySlug(), getCategories()
    i18n.ts       # FR/EN translations (all FR strings use double quotes)
  types/          # Post, Category interfaces
  mdx.d.ts        # TypeScript declarations for *.mdx modules
  index.css       # CSS custom properties (brand tokens)
  App.tsx         # Router + layout (blog routes + /admin/* routes)
  main.tsx        # Entry point
server/
  index.ts        # Express 5 admin API on port 3001 (tsx watch)
data/
  stats.json      # Flat-file stats: { total_views, articles: { slug: {views, reads} } }
public/
  logo.svg        # GateCtr brand logo
  favicon.ico     # GateCtr favicon
.env.example      # Documents required env vars
```

## Admin Panel

Access at `/admin/login`. JWT is stored in React memory only (no localStorage) — session resets on refresh.

### Environment Variables (set via Replit Secrets)

| Variable | Default | Notes |
|---|---|---|
| `ADMIN_EMAIL` | `admin@gatectr.com` | Login email |
| `ADMIN_PASSWORD` | `changeme` | **Change before production** |
| `JWT_SECRET` | `dev-secret-…` | **Use a long random string in production** |

### API Routes (all proxied via Vite /api)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/admin/login` | — | Returns JWT token |
| GET | `/api/admin/me` | Bearer | Check session |
| GET | `/api/admin/articles` | Bearer | List all MDX articles |
| POST | `/api/admin/articles` | Bearer | Publish new MDX article to src/posts/ |
| DELETE | `/api/admin/articles/:lang/:slug` | Bearer | Delete MDX file |
| GET | `/api/stats` | — | Public stats JSON |
| POST | `/api/track` | — | Track view or read event |

## Bilingual (FR/EN)

- Toggle in nav header (shows "FR" when in EN mode, "EN" when in FR mode)
- `i18n.ts` — all FR strings must use **double quotes** (French apostrophes break single-quoted TS strings)
- FR category names: "Optimisation des coûts", "Routage de modèles", "Infrastructure IA"
- SEO: `<html lang="">` + `og:locale` + `og:locale:alternate` + `hreflang` (en/fr/x-default)

## Adding a New Post

Create `src/posts/<slug>.mdx` with YAML frontmatter (or use the admin panel at `/admin/editor`):

```mdx
---
slug: my-new-post
title: My New Post Title
excerpt: A short summary shown on the list page.
author: GateCtr Team
date: "2026-04-01"
category: Cost Optimization
readTime: 5
---

Your Markdown content here.
```

**Rules:**
- Excerpt ≤ 155 chars, keyword-first
- Colons in excerpts → wrap value in double quotes in YAML
- Angle brackets in body text → use "under 10ms" instead of `<10ms`
- No JSX imports in MDX (pure frontmatter + Markdown)

## Content

11 EN posts + 11 FR translations in `src/posts/` and `src/posts/fr/`, covering:
- Cost Optimization (5)
- Model Routing (4)
- AI Infrastructure (2)

## Deployment

Static site — `npm run build` outputs to `dist/`. The Express API must run separately (not part of the static build).
