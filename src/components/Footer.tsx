import { useLang } from '../context/LangContext';
import { useTranslations } from '../lib/i18n';
import styles from './Footer.module.css';

export default function Footer() {
  const { lang } = useLang();
  const tr = useTranslations(lang);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <a href="https://gatectr.com" target="_blank" rel="noopener noreferrer" className={styles.link}>{tr.footer.home}</a>
          <span className={styles.sep}>·</span>
          <a href="https://app.gatectr.com/sign-in" target="_blank" rel="noopener noreferrer" className={styles.link}>{tr.footer.signIn}</a>
          <span className={styles.sep}>·</span>
          <a href="https://docs.gatectr.com" target="_blank" rel="noopener noreferrer" className={styles.link}>{tr.footer.docs}</a>
        </div>
        <p className={styles.copy}>{tr.footer.copy}</p>
      </div>
    </footer>
  );
}
