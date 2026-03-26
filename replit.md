# GateCtr Blog

The official GateCtr blog — practical insights on LLM cost optimization, model routing, and AI infrastructure.

**URLs:** blog.gatectr.com | links to app.gatectr.com, docs.gatectr.com, gatectr.com

## Stack

- **Frontend**: React 19, React Router 7, TypeScript 5.9
- **Build**: Vite 8 + MDX plugin, running on port 5000
- **Styling**: CSS Modules with GateCtr brand tokens
- **Runtime**: Node.js 20

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
  pages/          # Home, PostPage, About
  posts/          # *.mdx — one file per blog post
  lib/
    posts.ts      # MDX loader: getPosts(), getPostBySlug(), getCategories()
  types/          # Post, Category interfaces
  mdx.d.ts        # TypeScript declarations for *.mdx modules
  index.css       # CSS custom properties (brand tokens)
  App.tsx         # Router + layout
  main.tsx        # Entry point
public/
  logo.svg        # GateCtr brand logo
  favicon.ico     # GateCtr favicon
```

## Adding a New Post

Create `src/posts/<slug>.mdx` with YAML frontmatter:

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

Your Markdown content here. Use ##, ###, bullet lists, code blocks, **bold**, etc.
```

No TypeScript file edits required — the loader picks up new `.mdx` files automatically via `import.meta.glob`.

## Content

6 posts currently in `src/posts/`, covering:
- LLM cost optimization (2)
- Model routing (2)
- Operations / dashboards / budget controls (2)

## Deployment

Static site — `npm run build` outputs to `dist/`.
