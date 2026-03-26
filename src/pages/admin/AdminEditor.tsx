import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import styles from './AdminEditor.module.css';

const CATEGORIES_EN = ['Cost Optimization', 'Model Routing', 'AI Infrastructure'];
const CATEGORIES_FR = ['Optimisation des coûts', 'Routage de modèles', 'Infrastructure IA'];

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface ArticlePayload {
  frontmatter: {
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: number;
  };
  body: string;
  lang: 'en' | 'fr';
}

function autoSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[àâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminEditor() {
  const { token } = useAdmin();
  const navigate = useNavigate();
  const { lang: urlLang, slug: urlSlug } = useParams<{ lang?: string; slug?: string }>();

  const isEditMode = !!(urlLang && urlSlug);

  const [lang, setLang] = useState<'en' | 'fr'>(urlLang === 'fr' ? 'fr' : 'en');
  const [slug, setSlug] = useState(urlSlug ?? '');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('GateCtr Team');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(isEditMode);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);
  const [preview, setPreview] = useState('');
  const [titleLocked, setTitleLocked] = useState(isEditMode);

  const categories = lang === 'fr' ? CATEGORIES_FR : CATEGORIES_EN;

  useEffect(() => {
    const result = marked.parse(body || '');
    if (typeof result === 'string') {
      setPreview(result);
    } else {
      result.then(setPreview);
    }
  }, [body]);

  useEffect(() => {
    if (!isEditMode) return;
    setLoadingArticle(true);
    fetch(`/api/admin/articles/${urlLang}/${urlSlug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then((data: ArticlePayload) => {
        const fm = data.frontmatter;
        setLang(data.lang);
        setSlug(fm.slug ?? urlSlug ?? '');
        setTitle(fm.title ?? '');
        setExcerpt(fm.excerpt ?? '');
        setAuthor(fm.author ?? 'GateCtr Team');
        setDate(fm.date ?? new Date().toISOString().slice(0, 10));
        setCategory(fm.category ?? '');
        setReadTime(String(fm.readTime ?? 5));
        setBody(data.body ?? '');
      })
      .catch(() => setError("Impossible de charger l'article."))
      .finally(() => setLoadingArticle(false));
  }, [isEditMode, urlLang, urlSlug, token]);

  function showToast(message: string, type: Toast['type']) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!titleLocked) {
      setSlug(autoSlug(v));
    }
  }

  const excerptCount = useMemo(() => excerpt.length, [excerpt]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (excerptCount > 155) {
      setError(`L'extrait doit faire ≤ 155 caractères (actuellement ${excerptCount}).`);
      return;
    }
    if (!category) {
      setError('Veuillez choisir une catégorie.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lang,
          slug,
          frontmatter: { slug, title, excerpt, author, date, category, readTime: parseInt(readTime, 10) },
          body,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? 'Erreur lors de la publication.');
        return;
      }
      showToast(isEditMode ? 'Article mis à jour avec succès.' : 'Article publié avec succès.', 'success');
      setTimeout(() => navigate('/admin/dashboard'), 1800);
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }

  if (loadingArticle) {
    return (
      <AdminLayout>
        <p className={styles.loadingMsg}>Chargement de l'article…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.message}
        </div>
      )}

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          {isEditMode ? `Modifier : ${title || urlSlug}` : 'Nouvel article'}
        </h1>
      </div>

      <div className={styles.workspace}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Langue</label>
              <select
                className={styles.select}
                value={lang}
                onChange={e => { setLang(e.target.value as 'en' | 'fr'); setCategory(''); }}
                disabled={isEditMode}
              >
                <option value="en">English (EN)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label}>Catégorie</label>
              <select
                className={styles.select}
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="">— Choisir —</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Lecture (min)</label>
              <input
                type="number"
                className={styles.input}
                value={readTime}
                onChange={e => setReadTime(e.target.value)}
                min="1"
                max="60"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Titre</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              required
              placeholder="How to Cut LLM Costs by 40%…"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Slug
              {!isEditMode && <span className={styles.labelHint}> (auto-généré)</span>}
            </label>
            <div className={styles.slugRow}>
              <input
                type="text"
                className={styles.input}
                value={slug}
                onChange={e => { setSlug(autoSlug(e.target.value)); setTitleLocked(true); }}
                required
                placeholder="how-to-cut-llm-costs"
                readOnly={isEditMode}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Extrait
              <span className={excerptCount > 155 ? styles.countBad : styles.countOk}>
                {' '}{excerptCount}/155
              </span>
            </label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              required
              placeholder="Résumé accrocheur commençant par un mot-clé (≤ 155 caractères)…"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label}>Auteur</label>
              <input
                type="text"
                className={styles.input}
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date de publication</label>
              <input
                type="date"
                className={styles.input}
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contenu Markdown / MDX</label>
            <textarea
              className={`${styles.textarea} ${styles.editor}`}
              rows={22}
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              placeholder={'## Introduction\n\nVotre contenu en Markdown ici…'}
              spellCheck={false}
            />
            <p className={styles.hint}>
              GFM activé (tableaux, code). Évitez les balises HTML — préférez la syntaxe Markdown.
            </p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/dashboard')}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Publication…' : isEditMode ? 'Mettre à jour' : "Publier l'article"}
            </button>
          </div>
        </form>

        <aside className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <span className={styles.previewLabel}>Aperçu</span>
            {body.trim() && <span className={styles.previewHint}>{body.split(/\s+/).filter(Boolean).length} mots</span>}
          </div>
          {!body.trim() ? (
            <div className={styles.previewEmpty}>
              Commencez à rédiger pour voir l'aperçu…
            </div>
          ) : (
            <div
              className={styles.previewContent}
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          )}
        </aside>
      </div>
    </AdminLayout>
  );
}
