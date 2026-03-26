# GateCtr Blog

A modern blog built with React 19 + Vite 8 + TypeScript.

## Stack

- **Frontend**: React 19, React Router 7, TypeScript 5.9
- **Build**: Vite 8
- **Styling**: CSS Modules (no CSS framework)
- **Runtime**: Node.js 20

## Project Structure

```
src/
  components/     # Shared UI components (Header, Footer, PostCard)
  pages/          # Route-level components (Home, PostPage, About)
  data/           # Static blog post data (posts.ts)
  types/          # TypeScript interfaces (Post, Category)
  index.css       # Global CSS variables and resets
  App.tsx         # Root component with routing
  main.tsx        # Entry point
```

## Development

The app runs on port 5000 via Vite's dev server.

```bash
npm run dev      # Start development server
npm run build    # Build for production (output: dist/)
```

## Blog Content

Posts are stored in `src/data/posts.ts` as static data. Each post has:
- `id`, `slug`, `title`, `excerpt`, `content`
- `author`, `date`, `category`, `readTime`

Content is rendered via a lightweight custom Markdown-like parser in `PostPage.tsx`.

## Deployment

Configured as a static site — `npm run build` outputs to `dist/`.
