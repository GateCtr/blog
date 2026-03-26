import { useParams, Link, useNavigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { getPostBySlug, getPosts } from '../lib/posts';
import styles from './PostPage.module.css';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h2>Post not found</h2>
        <Link to="/" className={styles.back}>← Back to home</Link>
      </div>
    );
  }

  const { Component } = post;
  const otherPosts = getPosts().filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.category}>{post.category}</span>
              <span className={styles.dot}>·</span>
              <time>{formatDate(post.date)}</time>
              <span className={styles.dot}>·</span>
              <span>{post.readTime} min read</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <div className={styles.authorRow}>
              <div className={styles.avatar}>{post.author[0]}</div>
              <span className={styles.author}>{post.author}</span>
            </div>
          </header>

          <div className={styles.divider} />

          <div className={styles.content}>
            <MDXProvider>
              <Component />
            </MDXProvider>
          </div>

          <div className={styles.ctaBox}>
            <div className={styles.ctaBoxText}>
              <div className={styles.ctaBoxTitle}>Cut your LLM costs by 40%</div>
              <div className={styles.ctaBoxSub}>One endpoint swap. No code changes required.</div>
            </div>
            <a href="https://app.gatectr.com/sign-up" className={styles.ctaBoxBtn} target="_blank" rel="noopener noreferrer">
              Start free →
            </a>
          </div>
        </article>

        {otherPosts.length > 0 && (
          <section className={styles.more}>
            <h3 className={styles.moreTitle}>More Articles</h3>
            <div className={styles.moreGrid}>
              {otherPosts.map(p => (
                <Link key={p.slug} to={`/post/${p.slug}`} className={styles.moreCard}>
                  <span className={styles.moreCategory}>{p.category}</span>
                  <span className={styles.morePostTitle}>{p.title}</span>
                  <span className={styles.moreReadTime}>{p.readTime} min read</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
