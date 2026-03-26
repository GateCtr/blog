import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>About GateCtr Blog</h1>
          <p className={styles.subtitle}>
            Practical writing on LLM cost optimization, AI infrastructure, and model routing — for engineering teams building with AI.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>What We Write About</h2>
            <p>
              GateCtr Blog covers the operational side of running LLMs in production — the topics that matter
              when you move from prototype to scale. Context optimization, model routing, budget controls,
              observability, and provider selection.
            </p>
            <p>
              Every article is written for engineers and technical leads who are responsible for LLM
              infrastructure and want to reduce costs without sacrificing output quality.
            </p>
          </section>

          <section className={styles.section}>
            <h2>About GateCtr</h2>
            <p>
              GateCtr is an LLM gateway that sits between your application and model providers. One endpoint
              swap gives you full control over tokens, budgets, and routing — without changing a line of your
              application code.
            </p>
            <p>
              Teams using GateCtr typically reduce their LLM spend by 40% in the first week, through
              context optimization and intelligent model routing.
            </p>
          </section>

          <section className={styles.section}>
            <h2>The Three Products</h2>
            <p>
              <strong>gatectr.com</strong> — the main product site with pricing, features, and access requests.
            </p>
            <p>
              <strong>app.gatectr.com</strong> — the app and authentication space. Sign in at <strong>app.gatectr.com/sign-in</strong> to manage routing rules, budget limits, and usage analytics.
            </p>
            <p>
              <strong>docs.gatectr.com</strong> — integration guides, API reference, and configuration documentation.
            </p>
          </section>

          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>Cut LLM costs by 40%</h3>
            <p className={styles.ctaText}>One endpoint swap. Full control over tokens, budgets, and routing.</p>
            <a href="https://gatectr.com" className={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
              Request access →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
