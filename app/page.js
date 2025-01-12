import Image from "next/image";
import styles from "./page.module.css";
import SearchResults from "./SearchResults.jsx";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Search Reddit For Keyword</h1>
        <h3>Created with <a href="https://pullpush.io" target="_blank">pullpush.io</a> API</h3>
        <p style={{color: "red"}}>WARNING! Does not mark NSFW results</p>
        <p>Some posts may have been deleted by their authors and/or removed</p>
        {/* <section className = "searchSection">
          <input type = "text" id="searchInput" placeholder="Enter query"/> 
          <button id="searchButton">Search</button>
        </section> */}

        {/* <section className = "resultSection">
            <p id = "sr">Subreddit</p>
            <h4 id = "title">This will display the post </h4>
            <a id = "link" target ="_blank">Link</a>
        </section> */}

        <SearchResults />

        <section className = "infoSection">
            <p>This tool will return the top 100 most recent <a href="https://reddit.com" target="_blank">Reddit</a> submissions containing your term. </p>
        </section>

      </main>
    </div>
  );
}
