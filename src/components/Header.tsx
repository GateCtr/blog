import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>G</span>
          <span className={styles.logoText}>GateCtr<span className={styles.logoDot}>.</span>blog</span>
        </Link>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${styles.navLink} ${location.pathname === '/about' ? styles.active : ''}`}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
