# GateCtr Blog

The official GateCtr blog — practical insights on LLM cost optimization, model routing, and AI infrastructure.

**URLs:** blog.gatectr.com | links to app.gatectr.com, docs.gatectr.com, gatectr.com

## Stack

- **Frontend**: React 19, React Router 7, TypeScript 5.9
- **Build**: Vite 8, running on port 5000
- **Styling**: CSS Modules with GateCtr brand tokens (Inter font, navy #1B4F82, teal #00D4E8)
- **Runtime**: Node.js 20

## Brand Colors

- Navy: `#1b4f82` — primary actions, titles
- Teal: `#00d4e8` — accent, CTA buttons, tags
- Dark navy text: `#1a202c`
- Body text: `#4a5568`
- Font: Inter (loaded from Google Fonts)

## Project Structure

```
src/
  components/     # Header (with GateCtr SVG logo), Footer, PostCard
  pages/          # Home, PostPage, About
  data/           # posts.ts — all blog post content
  types/          # Post, Category interfaces
  index.css       # CSS custom properties (brand tokens)
  App.tsx         # Router + layout
  main.tsx        # Entry point
public/
  logo.svg        # GateCtr brand logo
  favicon.ico     # GateCtr favicon
```

## Content

Blog posts are in `src/data/posts.ts`. Topics covered:
- LLM cost optimization
- Context window optimization
- Model routing (OpenAI, Anthropic, Google)
- Budget controls and operations
- LLM observability and dashboards

## Adding Posts

Add a new object to the `posts` array in `src/data/posts.ts` with:
- `id`, `slug`, `title`, `excerpt`, `content` (markdown-like)
- `author`, `date` (YYYY-MM-DD), `category`, `readTime` (minutes)

## Deployment

Configured as a static site — `npm run build` outputs to `dist/`.
