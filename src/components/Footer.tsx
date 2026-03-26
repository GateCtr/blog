import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © {new Date().getFullYear()} GateCtr. Built with React &amp; Vite.
        </p>
      </div>
    </footer>
  );
}
