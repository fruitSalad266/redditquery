import styles from "./page.module.css";
import SearchResults from "./SearchResults.jsx";
import GridBackground from "./GridBackground.jsx";

export const metadata =  {
  title: 'Reddit Query',
  description: 'Search Reddit for a Keyword'
}

export default function Home() {
  return (
    <div className={styles.page}>
      <GridBackground />
      <main className={styles.main}>
        <h1 style={{fontSize: "2.5rem", fontWeight: "700", marginBottom: "8px", background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 0 40px rgba(129, 140, 248, 0.3)"}}>
          Reddit Search
        </h1>
        <h3 style={{fontSize: "1rem", color: "#94a3b8", marginBottom: "24px"}}>
          Powered by <a href="https://pullpush.io" target="_blank">pullpush.io</a> API
        </h3>

        <div style={{display: "flex", gap: "12px", marginBottom: "24px", fontSize: "0.875rem", flexWrap: "wrap", justifyContent: "center"}}>
          <p style={{color: "#f87171", fontWeight: "500"}}>⚠️ NSFW results are highlighted</p>
          <span style={{color: "#475569"}}>•</span>
          <p style={{color: "#94a3b8"}}>Showing top 100 recent posts</p>
        </div>

        <SearchResults />

        <section className="infoSection">
            <p style={{fontSize: "0.95rem"}}>
              This tool returns the top 100 most recent <a href="https://reddit.com" target="_blank" style={{color: "#93c5fd"}}>Reddit</a> submissions containing your search term. Some posts may have been deleted or removed.
            </p>
        </section>

      </main>
    </div>
  );
}
