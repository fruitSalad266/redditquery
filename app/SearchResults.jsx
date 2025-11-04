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
    
    // Format the UTC timestamp to a readable date
    const formatDate = (utcTimestamp) => {
        if (!utcTimestamp) return 'Unknown';
        const date = new Date(utcTimestamp * 1000); // Convert from Unix timestamp
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };
    
    // Format upvotes with K/M notation
    const formatUpvotes = (ups) => {
        if (!ups && ups !== 0) return '0';
        if (ups >= 1000000) return `${(ups / 1000000).toFixed(1)}M`;
        if (ups >= 1000) return `${(ups / 1000).toFixed(1)}K`;
        return ups.toString();
    };
    
    return (
        <div>
        {n ? (
            <section key={index} className="nsfwSection" style={{marginBottom: "16px", textAlign: "left"}}>
                <p style={{fontWeight: "700", fontSize: "0.875rem", marginBottom: "8px"}}>⚠️ NSFW</p>
                <div style={{display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px"}}>
                    <span style={{fontSize: "0.75rem", color: "#9ca3af", fontWeight: "500"}}>
                        {formatUpvotes(result.ups)} upvotes
                    </span>
                    <span style={{fontSize: "0.75rem", color: "#9ca3af"}}>•</span>
                    <span style={{fontSize: "0.75rem", color: "#9ca3af"}}>
                        {formatDate(result.created)}
                    </span>
                </div>
                <p style={{fontSize: "0.875rem", color: "#fca5a5", marginBottom: "8px"}}>{result.sr}</p>
                <h3 style={{fontSize: "1.125rem", fontWeight: "600", marginBottom: "12px", color: "#fecaca"}}>{result.title}</h3>
                <a href={result.link} target="_blank" rel="noopener noreferrer" style={{color: "#fca5a5", fontWeight: "600"}}>View Post →</a>
            </section>
        ) : (
            <section key={index} style={{marginBottom: "16px", textAlign: "left"}}>
                <div style={{display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px"}}>
                    <span style={{fontSize: "0.75rem", color: "#6b7280", fontWeight: "500"}}>
                        {formatUpvotes(result.ups)} upvotes
                    </span>
                    <span style={{fontSize: "0.75rem", color: "#6b7280"}}>•</span>
                    <span style={{fontSize: "0.75rem", color: "#6b7280"}}>
                        {formatDate(result.created)}
                    </span>
                </div>
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
    const [hideNSFW, setHideNSFW] = useState(false);
    const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

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
    
    // Filter results based on NSFW preference
    let filteredResults = hideNSFW ? results.filter(result => !result.nsfw) : results;
    
    // Sort results based on upvotes
    if (sortOrder === 'asc') {
        filteredResults = [...filteredResults].sort((a, b) => (a.ups || 0) - (b.ups || 0));
    } else if (sortOrder === 'desc') {
        filteredResults = [...filteredResults].sort((a, b) => (b.ups || 0) - (a.ups || 0));
    }
    
    // Cycle through sort options
    const cycleSortOrder = () => {
        if (sortOrder === 'none') setSortOrder('desc');
        else if (sortOrder === 'desc') setSortOrder('asc');
        else setSortOrder('none');
    };

    return (
        <div style={{width: "100%"}}>
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

            {/* Filter and Sort Controls */}
            <div style={{marginTop: "16px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap"}}>
                <button 
                    onClick={() => setHideNSFW(!hideNSFW)}
                    style={{
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        borderRadius: "8px",
                        border: hideNSFW ? "2px solid #818cf8" : "2px solid #2a2a2a",
                        background: hideNSFW ? "rgba(129, 140, 248, 0.2)" : "transparent",
                        color: hideNSFW ? "#a5b4fc" : "#94a3b8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontWeight: "500",
                        height: "auto",
                        width: "auto",
                        margin: "0"
                    }}
                >
                    {hideNSFW ? "✓ NSFW Hidden" : "Hide NSFW"}
                </button>
                
                <button 
                    onClick={cycleSortOrder}
                    style={{
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        borderRadius: "8px",
                        border: sortOrder !== 'none' ? "2px solid #818cf8" : "2px solid #2a2a2a",
                        background: sortOrder !== 'none' ? "rgba(129, 140, 248, 0.2)" : "transparent",
                        color: sortOrder !== 'none' ? "#a5b4fc" : "#94a3b8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontWeight: "500",
                        height: "auto",
                        width: "auto",
                        margin: "0"
                    }}
                >
                    {sortOrder === 'none' && "Sort by Upvotes"}
                    {sortOrder === 'desc' && "↓ Most Upvoted"}
                    {sortOrder === 'asc' && "↑ Least Upvoted"}
                </button>
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
                {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                    <Result result={result} index={index} key={index}/>
                ))
                ) : results.length > 0 && hideNSFW ? (
                    <p style={{color: "#94a3b8", marginTop: "16px"}}>All results are NSFW. Toggle filter to view.</p>
                ) : (
                    !isLoading && <p style={{color: "#94a3b8", marginTop: "16px"}}>No results to display</p>
                )}
            </div>
        </div>
    );
}