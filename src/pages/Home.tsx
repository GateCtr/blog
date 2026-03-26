import { useState } from 'react';
import { getPosts, getCategories } from '../lib/posts';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import styles from './Home.module.css';

const posts = getPosts();
const categories = getCategories();

const META_DESC =
  'Guides, benchmarks, and strategies to optimize and scale your LLM usage. Cut AI costs, master model routing, and build smarter systems.';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'GateCtr Blog',
      url: 'https://blog.gatectr.com',
      description: META_DESC,
      publisher: {
        '@type': 'Organization',
        name: 'GateCtr',
        url: 'https://gatectr.com',
      },
    },
    {
      '@type': 'Blog',
      name: 'GateCtr Blog',
      url: 'https://blog.gatectr.com',
      description: META_DESC,
      publisher: {
        '@type': 'Organization',
        name: 'GateCtr',
        url: 'https://gatectr.com',
      },
    },
  ],
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className={styles.page}>
      <SEO
        title="The GateCtr Blog"
        description={META_DESC}
        canonical="/"
        jsonLd={websiteSchema}
      />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Cost · Routing · Infrastructure</div>
          <h1 className={styles.heroTitle}>
            Stop wasting money on AI.
          </h1>
          <p className={styles.heroSub}>
            Guides, benchmarks, and strategies to optimize and scale your LLM usage.
          </p>
          <div className={styles.heroCtas}>
            <a
              href="https://app.gatectr.com/sign-up"
              className={styles.heroPrimary}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start using GateCtr →
            </a>
            <a
              href="https://docs.gatectr.com"
              className={styles.heroSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              View docs →
            </a>
          </div>
          <div className={styles.searchWrap}>
            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.search}
            />
          </div>
        </div>
      </section>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Topics</h3>
            <ul className={styles.categoryList}>
              <li>
                <button
                  className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Posts
                  <span className={styles.count}>{posts.length}</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`${styles.categoryBtn} ${selectedCategory === cat.name ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                  >
                    {cat.name}
                    <span className={styles.count}>{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.ctaBanner}>
            <div className={styles.ctaBannerTitle}>Cut LLM costs by 40%</div>
            <p className={styles.ctaBannerText}>One endpoint swap. Full control over tokens, budgets, and routing.</p>
            <a href="https://app.gatectr.com/sign-up" className={styles.ctaBannerBtn} target="_blank" rel="noopener noreferrer">
              Start free →
            </a>
          </div>
        </aside>

        <div className={styles.content}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No articles found. Try a different search or topic.</p>
            </div>
          ) : (
            <>
              {featured && (
                <div className={styles.featured}>
                  <PostCard post={featured} featured />
                </div>
              )}
              {rest.length > 0 && (
                <div className={styles.grid}>
                  {rest.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
