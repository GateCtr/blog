import { useParams, Link, useNavigate } from 'react-router-dom';
import { posts } from '../data/posts';
import styles from './PostPage.module.css';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h2>Post not found</h2>
        <Link to="/" className={styles.back}>← Back to home</Link>
      </div>
    );
  }

  const otherPosts = posts.filter(p => p.id !== post.id).slice(0, 3);

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
            {renderContent(post.content)}
          </div>

          <div className={styles.ctaBox}>
            <div className={styles.ctaBoxText}>
              <div className={styles.ctaBoxTitle}>Cut your LLM costs by 40%</div>
              <div className={styles.ctaBoxSub}>One endpoint swap. No code changes required.</div>
            </div>
            <a href="https://app.gatectr.com" className={styles.ctaBoxBtn} target="_blank" rel="noopener noreferrer">
              Start free →
            </a>
          </div>
        </article>

        {otherPosts.length > 0 && (
          <section className={styles.more}>
            <h3 className={styles.moreTitle}>More Articles</h3>
            <div className={styles.moreGrid}>
              {otherPosts.map(p => (
                <Link key={p.id} to={`/post/${p.slug}`} className={styles.moreCard}>
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

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={key++}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
    } else if (line.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {listItems.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\./.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s*/, ''));
        i++;
      }
      elements.push(
        <ol key={key++}>
          {listItems.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() !== '') {
      elements.push(
        <p key={key++} dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      );
    }
    i++;
  }

  return elements;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}
