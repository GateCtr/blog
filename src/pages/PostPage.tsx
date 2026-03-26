import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { getPostBySlug, getPosts } from '../lib/posts';
import { useLang } from '../context/LangContext';
import { useTranslations } from '../lib/i18n';
import SEO from '../components/SEO';
import styles from './PostPage.module.css';
import 'highlight.js/styles/github-dark.css';

const BASE_URL = 'https://blog.gatectr.com';

function track(slug: string, event: 'view' | 'read') {
  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, event }),
  }).catch(() => undefined);
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = useTranslations(lang);
  const post = slug ? getPostBySlug(slug, lang) : undefined;

  const readTracked = useRef(false);

  useEffect(() => {
    if (!slug) return;
    const currentSlug = slug;
    readTracked.current = false;
    track(currentSlug, 'view');

    function onScroll() {
      if (readTracked.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.8) {
        readTracked.current = true;
        track(currentSlug, 'read');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h2>{tr.post.notFound}</h2>
        <Link to="/" className={styles.back}>{tr.post.backHome}</Link>
      </div>
    );
  }

  const { Component } = post;
  const otherPosts = getPosts(lang).filter(p => p.slug !== post.slug).slice(0, 3);
  const canonicalPath = `/post/${post.slug}`;
  const postUrl = `${BASE_URL}${canonicalPath}`;

  const coverImageUrl = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${BASE_URL}${post.coverImage}`)
    : undefined;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'GateCtr', url: 'https://gatectr.com' },
    articleSection: post.category,
    timeRequired: `PT${post.readTime}M`,
    isPartOf: { '@type': 'Blog', name: 'GateCtr Blog', url: BASE_URL },
    ...(coverImageUrl ? { image: coverImageUrl } : {}),
  };

  return (
    <div className={styles.page}>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={canonicalPath}
        type="article"
        article={{
          publishedTime: post.date,
          author: post.author,
          category: post.category,
        }}
        jsonLd={blogPostingSchema}
        lang={lang}
        image={post.coverImage}
      />

      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          {tr.post.back}
        </button>

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.category}>{post.category}</span>
              <span className={styles.dot}>·</span>
              <time dateTime={post.date}>{formatDate(post.date, tr.dateLocale)}</time>
              <span className={styles.dot}>·</span>
              <span>{post.readTime} {tr.post.minRead}</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <div className={styles.authorRow}>
              <div className={styles.avatar}>{post.author[0]}</div>
              <span className={styles.author}>{post.author}</span>
            </div>
          </header>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className={styles.featuredImage}
            />
          )}

          <div className={styles.divider} />

          <div className={styles.content}>
            <MDXProvider>
              <Component />
            </MDXProvider>
          </div>

          <div className={styles.ctaBox}>
            <div className={styles.ctaBoxText}>
              <div className={styles.ctaBoxTitle}>{tr.post.ctaTitle}</div>
              <div className={styles.ctaBoxSub}>{tr.post.ctaSub}</div>
            </div>
            <a href="https://app.gatectr.com/sign-up" className={styles.ctaBoxBtn} target="_blank" rel="noopener noreferrer">
              {tr.post.ctaBtn}
            </a>
          </div>
        </article>

        {otherPosts.length > 0 && (
          <section className={styles.more}>
            <h3 className={styles.moreTitle}>{tr.post.moreArticles}</h3>
            <div className={styles.moreGrid}>
              {otherPosts.map(p => (
                <Link key={p.slug} to={`/post/${p.slug}`} className={styles.moreCard}>
                  <span className={styles.moreCategory}>{p.category}</span>
                  <span className={styles.morePostTitle}>{p.title}</span>
                  <span className={styles.moreReadTime}>{p.readTime} {tr.post.minRead}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
}
