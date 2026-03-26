import { useLang } from '../context/LangContext';
import { useTranslations } from '../lib/i18n';
import SEO from '../components/SEO';
import styles from './About.module.css';

export default function About() {
  const { lang } = useLang();
  const tr = useTranslations(lang);
  const ab = tr.about;

  return (
    <div className={styles.page}>
      <SEO
        title={ab.title}
        description={tr.seo.aboutDesc}
        canonical="/about"
      />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{ab.title}</h1>
          <p className={styles.subtitle}>{ab.subtitle}</p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>{ab.whatWeWriteTitle}</h2>
            <p>{ab.whatWeWrite1}</p>
            <p>{ab.whatWeWrite2}</p>
          </section>

          <section className={styles.section}>
            <h2>{ab.aboutGateTitle}</h2>
            <p>{ab.aboutGate1}</p>
            <p>{ab.aboutGate2}</p>
          </section>

          <section className={styles.section}>
            <h2>{ab.threeTitle}</h2>
            <p><strong>gatectr.com</strong>{ab.three1}</p>
            <p>
              <strong>app.gatectr.com</strong>{ab.three2}<strong>app.gatectr.com/sign-in</strong>{ab.three2b}
            </p>
            <p><strong>docs.gatectr.com</strong>{ab.three3}</p>
          </section>

          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>{ab.ctaTitle}</h3>
            <p className={styles.ctaText}>{ab.ctaText}</p>
            <a href="https://gatectr.com" className={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
              {ab.ctaBtn}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
