import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  publishAt?: string;
}

export default function AdminDashboard() {
  const { token } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<'en' | 'fr'>('en');
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
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
    const key = `${lang}-${slug}`;
    setDeleteKey(key);
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
      setDeleteKey(null);
    }
  }

  const articleStats: ArticleStat[] = stats
    ? Object.entries(stats.articles)
        .map(([slug, s]) => ({ slug, ...s }))
        .sort((a, b) => b.views - a.views)
    : [];

  const top5 = articleStats.slice(0, 5);
  const maxViews = top5[0]?.views ?? 1;

  return (
    <AdminLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <button className={styles.newBtn} onClick={() => navigate('/admin/editor')}>
          + Nouvel article
        </button>
      </div>

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

      {!loading && top5.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Top 5 articles (vues)</h2>
          <div className={styles.barList}>
            {top5.map(a => (
              <div key={a.slug} className={styles.barItem}>
                <div className={styles.barMeta}>
                  <span className={styles.barSlug}>{a.slug}</span>
                  <span className={styles.barCount}>{a.views.toLocaleString()} vues</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.round((a.views / maxViews) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  <th>Lectures (80 %)</th>
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
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Articles ({articles.length})
          </h2>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${langTab === 'en' ? styles.tabActive : ''}`}
              onClick={() => setLangTab('en')}
            >
              EN <span className={styles.tabCount}>{articles.filter(a => a.lang === 'en').length}</span>
            </button>
            <button
              className={`${styles.tab} ${langTab === 'fr' ? styles.tabActive : ''}`}
              onClick={() => setLangTab('fr')}
            >
              FR <span className={styles.tabCount}>{articles.filter(a => a.lang === 'fr').length}</span>
            </button>
          </div>
        </div>
        {loading ? (
          <p className={styles.hint}>Chargement…</p>
        ) : articles.filter(a => a.lang === langTab).length === 0 ? (
          <p className={styles.hint}>Aucun article {langTab.toUpperCase()} trouvé.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {articles.filter(a => a.lang === langTab).map(a => {
                  const key = `${a.lang}-${a.slug}`;
                  const isScheduled = a.publishAt && new Date(a.publishAt).getTime() > Date.now();
                  return (
                    <tr key={key}>
                      <td className={styles.titleCell}>
                        {a.title}
                        {isScheduled && (
                          <span className={styles.scheduledBadge}>
                            🕐 {new Date(a.publishAt!).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </td>
                      <td>{a.category}</td>
                      <td className={styles.dateCell}>{a.date}</td>
                      <td className={styles.actionsCell}>
                        <button
                          className={styles.editBtn}
                          onClick={() => navigate(`/admin/editor/${a.lang}/${a.slug}`)}
                        >
                          Modifier
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(a.lang, a.slug)}
                          disabled={deleteKey === key}
                        >
                          {deleteKey === key ? '…' : 'Supprimer'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
