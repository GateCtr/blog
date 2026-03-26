import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const BASE_URL = 'https://blog.gatectr.com'

function sitemapPlugin() {
  return {
    name: 'gatectr-sitemap',
    closeBundle() {
      const postsDir = resolve(__dirname, 'src/posts')
      const distDir = resolve(__dirname, 'dist')

      const slugs = readdirSync(postsDir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => {
          const slug = f.replace('.mdx', '')
          const content = readFileSync(join(postsDir, f), 'utf-8')
          const dateMatch = content.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m)
          const lastmod = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
          return { slug, lastmod }
        })

      const today = new Date().toISOString().split('T')[0]

      const staticPages = [
        { loc: `${BASE_URL}/`, lastmod: today, priority: '1.0', changefreq: 'daily' },
        { loc: `${BASE_URL}/about`, lastmod: today, priority: '0.7', changefreq: 'monthly' },
      ]

      const postPages = slugs.map(({ slug, lastmod }) => ({
        loc: `${BASE_URL}/post/${slug}`,
        lastmod,
        priority: '0.8',
        changefreq: 'weekly',
      }))

      const allPages = [...staticPages, ...postPages]

      const urlElements = allPages.map(p =>
        `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      ).join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlElements}\n</urlset>\n`

      writeFileSync(join(distDir, 'sitemap.xml'), xml, 'utf-8')
      console.log('[gatectr-sitemap] sitemap.xml generated with', allPages.length, 'URLs')
    },
  }
}

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react(),
    sitemapPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
})
