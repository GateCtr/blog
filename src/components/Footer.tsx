import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <a href="https://gatectr.com" target="_blank" rel="noopener noreferrer" className={styles.link}>gatectr.com</a>
          <span className={styles.sep}>·</span>
          <a href="https://app.gatectr.com/sign-in" target="_blank" rel="noopener noreferrer" className={styles.link}>Sign in</a>
          <span className={styles.sep}>·</span>
          <a href="https://docs.gatectr.com" target="_blank" rel="noopener noreferrer" className={styles.link}>docs.gatectr.com</a>
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()} GateCtr. Cut LLM costs by 40%.</p>
      </div>
    </footer>
  );
}
