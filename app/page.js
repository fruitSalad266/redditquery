import styles from "./page.module.css";
import SearchResults from "./SearchResults.jsx";

export const metadata =  {
  title: 'Reddit Query',
  description: 'Search Reddit for a Keyword'
}

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Search Reddit For Keyword</h1>
        <h3>Created with <a href="https://pullpush.io" target="_blank">pullpush.io</a> API</h3>

        <p style={{color: "red"}}>NSFW results in red</p>
        <p>Some posts may have been deleted by their authors and/or removed</p>

        <SearchResults />

        <section className = "infoSection">
            <p>This tool will return the top 100 most recent <a href="https://reddit.com" target="_blank">Reddit</a> submissions containing your term. </p>
        </section>

      </main>
    </div>
  );
}
