import { useState } from 'react';
import { posts, categories } from '../data/posts';
import PostCard from '../components/PostCard';
import styles from './Home.module.css';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Insights on <span className={styles.highlight}>Development</span>
          </h1>
          <p className={styles.heroSub}>
            Practical articles on React, TypeScript, CSS, and modern web development.
          </p>
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
            <h3 className={styles.sidebarTitle}>Categories</h3>
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
        </aside>

        <div className={styles.content}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No articles found. Try a different search or category.</p>
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
                    <PostCard key={post.id} post={post} />
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
