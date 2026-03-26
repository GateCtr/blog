import { useState } from 'react';
import { getPosts, getCategories } from '../lib/posts';
import { useLang } from '../context/LangContext';
import { useTranslations } from '../lib/i18n';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import styles from './Home.module.css';

const websiteSchemaBase = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'GateCtr Blog',
      url: 'https://blog.gatectr.com',
      publisher: { '@type': 'Organization', name: 'GateCtr', url: 'https://gatectr.com' },
    },
    {
      '@type': 'Blog',
      name: 'GateCtr Blog',
      url: 'https://blog.gatectr.com',
      publisher: { '@type': 'Organization', name: 'GateCtr', url: 'https://gatectr.com' },
    },
  ],
};

export default function Home() {
  const { lang } = useLang();
  const tr = useTranslations(lang);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const posts = getPosts(lang);
  const categories = getCategories(lang);

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

  const websiteSchema = {
    ...websiteSchemaBase,
    '@graph': websiteSchemaBase['@graph'].map(g => ({ ...g, description: tr.seo.homeDesc })),
  };

  return (
    <div className={styles.page}>
      <SEO
        title={tr.seo.homeTitle}
        description={tr.seo.homeDesc}
        canonical="/"
        jsonLd={websiteSchema}
        lang={lang}
      />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>{tr.hero.badge}</div>
          <h1 className={styles.heroTitle}>{tr.hero.title}</h1>
          <p className={styles.heroSub}>{tr.hero.sub}</p>
          <div className={styles.heroCtas}>
            <a
              href="https://app.gatectr.com/sign-up"
              className={styles.heroPrimary}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tr.hero.ctaPrimary}
            </a>
            <a
              href="https://docs.gatectr.com"
              className={styles.heroSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tr.hero.ctaSecondary}
            </a>
          </div>
          <div className={styles.searchWrap}>
            <input
              type="search"
              placeholder={tr.hero.searchPlaceholder}
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
            <h3 className={styles.sidebarTitle}>{tr.sidebar.topics}</h3>
            <ul className={styles.categoryList}>
              <li>
                <button
                  className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  {tr.sidebar.allPosts}
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
            <div className={styles.ctaBannerTitle}>{tr.sidebar.ctaTitle}</div>
            <p className={styles.ctaBannerText}>{tr.sidebar.ctaText}</p>
            <a href="https://app.gatectr.com/sign-up" className={styles.ctaBannerBtn} target="_blank" rel="noopener noreferrer">
              {tr.sidebar.ctaBtn}
            </a>
          </div>
        </aside>

        <div className={styles.content}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>{tr.feed.empty}</p>
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
