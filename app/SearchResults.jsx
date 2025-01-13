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
            <section key={index} style={{marginBottom: "20px", 
                                        textAlign: "left", 
                                        padding: "20px", 
                                        color: "red",
                                        backgroundColor: "#ffc2c2",
                                        outline: "solid",
                                        outlineWidth: "5px",
                                        outlineColor: "red"}}>
                <p><b>NSFW</b></p>
                <p>{result.sr}</p>
                <h3 className="text-lg font-bold">{result.title}</h3>
                <a href={result.link} target="_blank" rel="noopener noreferrer"> Link </a>
            </section>
        ) : (
            <section key={index} style={{marginBottom: "20px", textAlign: "left", padding: "20px"}}>
                <p>{result.sr}</p>
                <h3 className="text-lg font-bold">{result.title}</h3>
                <a href={result.link} target="_blank" rel="noopener noreferrer"> Link </a>
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
        <div>
        {/* Input and Button (assumes these are in the same component) */}
            <div style={{width: "100%"}}>
                <input type="text" 
                        id="searchInput" 
                        value = {query}
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="Enter your query"
                        autoComplete="off" />
                <button onClick={newQuery} id="searchButton"> Search </button>
            </div>

            {isLoading && (
                <div style={{ marginTop: "10px" }}>
                    <ClipLoader color="black" size={35} />
                </div>
            )}

            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Results Section */}
            <div className="mt-4">
                {results.length > 0 ? (
                results.map((result, index) => (
                    <Result result={result} index={index}/>
                ))
                ) : (
                    !isLoading && <p>No results to display</p>
                )}
            </div>
        </div>
    );
}