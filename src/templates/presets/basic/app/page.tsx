import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Welcome to Next.js!</h1>
        <p>Get started by editing app/page.tsx</p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation →</h2>
            <p>Learn about Next.js in the official documentation.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn →</h2>
            <p>Learn Next.js by building a dashboard application.</p>
          </a>

          <a href="https://vercel.com/new?utm_source=create-next-app" className={styles.card}>
            <h2>Deploy →</h2>
            <p>Instantly deploy your Next.js site to Vercel.</p>
          </a>
        </div>
      </div>
    </main>
  );
}
