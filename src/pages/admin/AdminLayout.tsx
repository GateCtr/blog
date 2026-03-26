import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAdmin } from '../../context/AdminContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className={styles.shell}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <nav className={styles.nav}>
        <Link to="/admin/dashboard" className={styles.navLogo}>
          Gate<span className={styles.ctr}>C</span>tr Admin
        </Link>
        <div className={styles.navLinks}>
          <Link
            to="/admin/dashboard"
            className={`${styles.navLink} ${location.pathname === '/admin/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/editor"
            className={`${styles.navLink} ${location.pathname === '/admin/editor' ? styles.active : ''}`}
          >
            Nouvel article
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
