import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>About GateCtr Blog</h1>
          <p className={styles.subtitle}>A place for practical, in-depth writing about modern web development.</p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>What We Write About</h2>
            <p>
              GateCtr Blog is focused on practical web development topics — the kind of articles that help
              you build better software and grow as a developer. We cover React, TypeScript, CSS, performance,
              tooling, and team workflows.
            </p>
            <p>
              Every article is written with real-world scenarios in mind. You will not find artificially
              simple examples here — we tackle the nuances and edge cases that actually matter when building
              production software.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Our Philosophy</h2>
            <p>
              Good software is a craft. It takes time, practice, and a willingness to keep learning. We
              believe that sharing knowledge openly makes the entire ecosystem better, and that is the
              spirit behind everything we publish.
            </p>
            <p>
              We favour clarity over cleverness, simplicity over complexity, and practical guidance over
              theoretical abstraction.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Stay in Touch</h2>
            <p>
              Follow the blog for new articles on React, TypeScript, performance, and everything in between.
              We publish regularly and aim for quality over quantity.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
