import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import styles from './AdminDashboard.module.css';

interface ArticleStat {
  slug: string;
  views: number;
  reads: number;
}

interface StatsData {
  total_views: number;
  articles: Record<string, { views: number; reads: number }>;
}

interface ArticleMeta {
  slug: string;
  title: string;
  lang: 'en' | 'fr';
  date: string;
  category: string;
}

export default function AdminDashboard() {
  const { token } = useAdmin();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      const [statsRes, artRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/admin/articles', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json() as StatsData);
      if (artRes.ok) setArticles(await artRes.json() as ArticleMeta[]);
    } catch {
      setError('Erreur de chargement des données.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadData(); }, []);

  async function handleDelete(lang: string, slug: string) {
    if (!confirm(`Supprimer l'article "${slug}" (${lang}) ?`)) return;
    setDeleteSlug(slug);
    try {
      const res = await fetch(`/api/admin/articles/${lang}/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? 'Erreur lors de la suppression.');
        return;
      }
      await loadData();
    } catch {
      setError('Erreur réseau.');
    } finally {
      setDeleteSlug(null);
    }
  }

  const articleStats: ArticleStat[] = stats
    ? Object.entries(stats.articles).map(([slug, s]) => ({ slug, ...s })).sort((a, b) => b.views - a.views)
    : [];

  return (
    <AdminLayout>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <div className={styles.kpiValue}>{loading ? '…' : (stats?.total_views ?? 0).toLocaleString()}</div>
          <div className={styles.kpiLabel}>Vues totales</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiValue}>{loading ? '…' : articles.filter(a => a.lang === 'en').length}</div>
          <div className={styles.kpiLabel}>Articles EN</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiValue}>{loading ? '…' : articles.filter(a => a.lang === 'fr').length}</div>
          <div className={styles.kpiLabel}>Articles FR</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiValue}>{loading ? '…' : articleStats.reduce((s, a) => s + a.reads, 0).toLocaleString()}</div>
          <div className={styles.kpiLabel}>Lectures complètes</div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Statistiques par article</h2>
        {loading ? (
          <p className={styles.hint}>Chargement…</p>
        ) : articleStats.length === 0 ? (
          <p className={styles.hint}>Aucune donnée — les vues s'enregistrent automatiquement à la lecture.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Vues</th>
                  <th>Lectures (80%)</th>
                  <th>Taux de lecture</th>
                </tr>
              </thead>
              <tbody>
                {articleStats.map(a => (
                  <tr key={a.slug}>
                    <td className={styles.slugCell}>{a.slug}</td>
                    <td>{a.views.toLocaleString()}</td>
                    <td>{a.reads.toLocaleString()}</td>
                    <td>{a.views > 0 ? `${Math.round((a.reads / a.views) * 100)} %` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Articles publiés ({articles.length})</h2>
        {loading ? (
          <p className={styles.hint}>Chargement…</p>
        ) : articles.length === 0 ? (
          <p className={styles.hint}>Aucun article trouvé.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Lang</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={`${a.lang}-${a.slug}`}>
                    <td className={styles.titleCell}>{a.title}</td>
                    <td><span className={`${styles.badge} ${a.lang === 'fr' ? styles.badgeFr : styles.badgeEn}`}>{a.lang.toUpperCase()}</span></td>
                    <td>{a.category}</td>
                    <td className={styles.dateCell}>{a.date}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(a.lang, a.slug)}
                        disabled={deleteSlug === a.slug}
                      >
                        {deleteSlug === a.slug ? '…' : 'Supprimer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
