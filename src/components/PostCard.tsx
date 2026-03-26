import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { useLang } from '../context/LangContext';
import { useTranslations } from '../lib/i18n';
import styles from './PostCard.module.css';

interface Props {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  const { lang } = useLang();
  const tr = useTranslations(lang);

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <Link to={`/post/${post.slug}`} className={styles.cardLink}>
        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.dot}>·</span>
            <time className={styles.date}>{formatDate(post.date, tr.dateLocale)}</time>
            <span className={styles.dot}>·</span>
            <span className={styles.readTime}>{post.readTime} {tr.card.minRead}</span>
          </div>
          <h2 className={styles.title}>{post.title}</h2>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.footer}>
            <span className={styles.author}>{post.author}</span>
            <span className={styles.readMore}>{tr.card.readMore}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
}
