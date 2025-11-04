'use client'

import { useState } from "react";
import { ClipLoader } from "react-spinners";

var domain = "jstest2.onrender.com";
if (process.env.NODE_ENV === 'development') {
    // domain = "localhost:8000";
}

function Loading() {
    return <h2>Fetching Results</h2>;
}

function Result({result, index}) {
    const n = result.nsfw;
    return (
        <div>
        {n ? (
            <section key={index} className="nsfwSection" style={{marginBottom: "16px", textAlign: "left"}}>
                <p style={{fontWeight: "700", fontSize: "0.875rem", marginBottom: "8px"}}>⚠️ NSFW</p>
                <p style={{fontSize: "0.875rem", color: "#fca5a5", marginBottom: "8px"}}>{result.sr}</p>
                <h3 style={{fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px", color: "#fecaca"}}>{result.title}</h3>
                <a href={result.link} target="_blank" rel="noopener noreferrer" style={{color: "#fca5a5", fontWeight: "600"}}>View Post →</a>
            </section>
        ) : (
            <section key={index} style={{marginBottom: "16px", textAlign: "left"}}>
                <p style={{fontSize: "0.875rem", color: "#94a3b8", marginBottom: "8px", fontWeight: "500"}}>{result.sr}</p>
                <h3 style={{fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px", color: "#e2e8f0"}}>{result.title}</h3>
                <a href={result.link} target="_blank" rel="noopener noreferrer" style={{fontWeight: "600"}}>View Post →</a>
            </section>    
        )}
        </div>
    );
}

export default function SearchResults() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const newQuery = async () => {

        if (!query.trim()) {
            console.log(query);
            alert("Query cannot be blank");
            return;
        }

        setIsLoading(true);
        try {
            const url = "https://" + domain + "/q2?query=" + encodeURIComponent(query);
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error(`HTTP error, status: ${response.status}`);
            }
            const data = await response.json();

            setResults(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div style={{width: "100%"}}>
        {/* Input and Button (assumes these are in the same component) */}
            <div style={{width: "100%", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap"}}>
                <input type="text" 
                        id="searchInput" 
                        value = {query}
                        onChange={(e) => setQuery(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && newQuery()}
                        placeholder="Enter your search query..."
                        autoComplete="off" />
                <button onClick={newQuery} id="searchButton">Search</button>
            </div>

            {isLoading && (
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ClipLoader color="#818cf8" size={40} />
                </div>
            )}

            {/* Error Message */}
            {error && <p style={{ color: "#f87171", marginTop: "16px", fontWeight: "500" }}>{error}</p>}

            {/* Results Section */}
            <div style={{marginTop: "24px"}}>
                {results.length > 0 ? (
                results.map((result, index) => (
                    <Result result={result} index={index} key={index}/>
                ))
                ) : (
                    !isLoading && <p style={{color: "#94a3b8", marginTop: "16px"}}>No results to display</p>
                )}
            </div>
        </div>
    );
}