import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PORT = 3001;
const POSTS_DIR = join(ROOT, 'src', 'posts');
const STATS_FILE = join(ROOT, 'data', 'stats.json');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

const isProduction = process.env.NODE_ENV === 'production';

function checkConfig() {
  const missing: string[] = [];
  if (!ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
  if (!ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');
  if (!JWT_SECRET) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    const msg = `[admin-api] WARNING: Missing env vars: ${missing.join(', ')}`;
    if (isProduction) {
      console.error(msg);
      console.error('[admin-api] FATAL: Set required env vars before starting in production.');
      process.exit(1);
    } else {
      console.warn(msg);
      console.warn('[admin-api] Using insecure defaults for development — DO NOT use in production.');
    }
  }

  if (!isProduction && JWT_SECRET && JWT_SECRET.length < 32) {
    console.warn('[admin-api] WARNING: JWT_SECRET is shorter than 32 characters — use a longer secret in production.');
  }
}

checkConfig();

const EFFECTIVE_EMAIL = ADMIN_EMAIL ?? 'admin@gatectr.com';
const EFFECTIVE_PASSWORD = ADMIN_PASSWORD ?? 'changeme';
const EFFECTIVE_SECRET = JWT_SECRET ?? 'dev-secret-change-in-production-min-32-chars';

interface StatsFile {
  total_views: number;
  articles: Record<string, { views: number; reads: number }>;
}

function readStats(): StatsFile {
  if (!existsSync(STATS_FILE)) {
    const empty: StatsFile = { total_views: 0, articles: {} };
    writeFileSync(STATS_FILE, JSON.stringify(empty, null, 2), 'utf-8');
    return empty;
  }
  return JSON.parse(readFileSync(STATS_FILE, 'utf-8')) as StatsFile;
}

function writeStats(stats: StatsFile): void {
  writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
}

interface ArticleFrontmatter {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
}

function parseFrontmatter(content: string): ArticleFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const raw = match[1];
  const result: Record<string, string | number> = {};
  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val: string = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    result[key] = key === 'readTime' ? parseInt(val, 10) : val;
  }
  return result as unknown as ArticleFrontmatter;
}

function listArticles(lang: 'en' | 'fr') {
  const dir = lang === 'fr' ? join(POSTS_DIR, 'fr') : POSTS_DIR;
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const content = readFileSync(join(dir, f), 'utf-8');
      const fm = parseFrontmatter(content);
      return fm ? { ...fm, lang } : null;
    })
    .filter(Boolean);
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé.' });
    return;
  }
  const token = header.slice(7);
  try {
    jwt.verify(token, EFFECTIVE_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
}

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5000', 'http://localhost:5001'], credentials: true }));

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis.' });
    return;
  }
  if (email !== EFFECTIVE_EMAIL || password !== EFFECTIVE_PASSWORD) {
    res.status(401).json({ error: 'Identifiants invalides.' });
    return;
  }
  const token = jwt.sign({ email, role: 'admin' }, EFFECTIVE_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.get('/api/admin/me', requireAuth, (req, res) => {
  const token = req.headers.authorization!.slice(7);
  const payload = jwt.decode(token) as { email: string };
  res.json({ email: payload.email, role: 'admin' });
});

app.get('/api/admin/articles', requireAuth, (_req, res) => {
  const en = listArticles('en');
  const fr = listArticles('fr');
  res.json([...en, ...fr]);
});

app.post('/api/admin/articles', requireAuth, (req, res) => {
  const { lang, slug, frontmatter, body } = req.body as {
    lang: 'en' | 'fr';
    slug: string;
    frontmatter: Record<string, string | number>;
    body: string;
  };

  if (!lang || !slug || !frontmatter || body === undefined) {
    res.status(400).json({ error: 'Champs manquants : lang, slug, frontmatter, body.' });
    return;
  }

  const slugClean = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const dir = lang === 'fr' ? join(POSTS_DIR, 'fr') : POSTS_DIR;

  const fmLines = Object.entries(frontmatter)
    .map(([k, v]) => {
      const needsQuotes = typeof v === 'string' && (v.includes(':') || v.startsWith('"'));
      return needsQuotes ? `${k}: "${v}"` : `${k}: ${v}`;
    })
    .join('\n');

  const content = `---\n${fmLines}\n---\n\n${body.trimStart()}`;
  const filePath = join(dir, `${slugClean}.mdx`);

  writeFileSync(filePath, content, 'utf-8');
  res.json({ ok: true, slug: slugClean, path: filePath });
});

app.delete('/api/admin/articles/:lang/:slug', requireAuth, (req, res) => {
  const { lang, slug } = req.params as { lang: string; slug: string };
  if (lang !== 'en' && lang !== 'fr') {
    res.status(400).json({ error: 'lang doit être "en" ou "fr".' });
    return;
  }
  const dir = lang === 'fr' ? join(POSTS_DIR, 'fr') : POSTS_DIR;
  const filePath = join(dir, `${slug}.mdx`);
  if (!existsSync(filePath)) {
    res.status(404).json({ error: 'Article introuvable.' });
    return;
  }
  unlinkSync(filePath);
  res.json({ ok: true });
});

app.get('/api/stats', (_req, res) => {
  res.json(readStats());
});

app.post('/api/track', (req, res) => {
  const { slug, event } = req.body as { slug?: string; event?: string };
  if (!slug || (event !== 'view' && event !== 'read')) {
    res.status(400).json({ error: 'slug et event ("view" | "read") requis.' });
    return;
  }
  const stats = readStats();
  if (!stats.articles[slug]) {
    stats.articles[slug] = { views: 0, reads: 0 };
  }
  if (event === 'view') {
    stats.articles[slug].views += 1;
    stats.total_views += 1;
  } else {
    stats.articles[slug].reads += 1;
  }
  writeStats(stats);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`[admin-api] Listening on http://localhost:${PORT}`);
  console.log(`[admin-api] ADMIN_EMAIL: ${EFFECTIVE_EMAIL}`);
  console.log(`[admin-api] JWT_SECRET : ${JWT_SECRET ? 'set via env' : '(default — set JWT_SECRET in env for production)'}`);
});
