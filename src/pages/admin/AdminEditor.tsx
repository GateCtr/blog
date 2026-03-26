import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import styles from './AdminEditor.module.css';

const CATEGORIES_EN = ['Cost Optimization', 'Model Routing', 'AI Infrastructure'];
const CATEGORIES_FR = ['Optimisation des coûts', 'Routage de modèles', 'Infrastructure IA'];

export default function AdminEditor() {
  const { token } = useAdmin();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('GateCtr Team');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = lang === 'fr' ? CATEGORIES_FR : CATEGORIES_EN;

  function autoSlug(value: string) {
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

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(v));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (excerpt.length > 155) {
      setError(`L'extrait doit faire ≤ 155 caractères (actuellement ${excerpt.length}).`);
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
      navigate('/admin/dashboard');
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className={styles.pageTitle}>Nouvel article</h1>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Langue</label>
            <select
              className={styles.select}
              value={lang}
              onChange={e => { setLang(e.target.value as 'en' | 'fr'); setCategory(''); }}
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
            <label className={styles.label}>Temps de lecture (min)</label>
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
            Slug (auto-généré)
          </label>
          <input
            type="text"
            className={styles.input}
            value={slug}
            onChange={e => setSlug(autoSlug(e.target.value))}
            required
            placeholder="how-to-cut-llm-costs"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Extrait
            <span className={excerpt.length > 155 ? styles.countBad : styles.countOk}>
              {' '}{excerpt.length}/155
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
            rows={24}
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            placeholder="## Introduction&#10;&#10;Votre contenu en Markdown ici…"
            spellCheck={false}
          />
          <p className={styles.hint}>
            Utilisez Markdown standard + GFM (tableaux, code). Évitez les balises HTML (&lt;…&gt;) dans le texte — préférez la syntaxe texte.
          </p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/dashboard')}>
            Annuler
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Publication…' : 'Publier l\'article'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
