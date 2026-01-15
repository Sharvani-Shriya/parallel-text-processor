import React, { useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";

const ProcessorDashboard = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileId, setFileId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [email, setEmail] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Reset state on new file selection
    setResults(null);
    setFileId(null);
    setSearchResults([]);
  };

  const handleProcessText = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      // 1. Upload
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok || !uploadData.chunk_ids || uploadData.chunk_ids.length === 0) {
         throw new Error(uploadData.error || "Upload failed or no chunks created.");
      }

      const firstChunk = uploadData.chunk_ids[0];

      // 2. Analyze (Scoring)
      const analyzeRes = await fetch(`http://127.0.0.1:8000/analyze/${firstChunk}`);
      const analyzeData = await analyzeRes.json();

      // 3. Update UI
      setResults({
        status: "Complete",
        documentsProcessed: uploadData.total_chunks,
        sentimentScore: analyzeData.score,
        patternsFound: Object.values(analyzeData.matches).flat(),
        fileId: uploadData.file_id
      });
      setFileId(uploadData.file_id);

    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred during processing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !fileId) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(searchQuery)}&file_id=${fileId}&limit=20`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setSearchResults(data.results);
      }
    } catch (error) {
      alert("Search failed.");
    }
  };

  const handleEmailSummary = async () => {
    if (!fileId || !email) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/email_summary?file_id=${fileId}&to_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      alert(res.ok ? (data.message || "Email sent!") : (data.error || "Failed to send email."));
    } catch (error) {
      alert("Failed to send email.");
    }
  };

  const handleExport = async () => {
    if (!fileId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/export?file_id=${fileId}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileId}_chunks.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      alert("Failed to export CSV.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <section className="dashboard-section text-center">
        <h1>🐍 Parallel Text Processor</h1>
        <p className="subtitle">High-performance text analysis, rule-based scoring, and data mining.</p>
      </section>

      {/* Upload Section */}
      <section className="dashboard-section card">
        <h3>1. Upload Data</h3>
        <p className="description">Select a text file (TXT, PDF, DOCX) to begin parallel processing.</p>
        <div className="upload-controls">
           <input type="file" onChange={handleFileChange} className="file-input" />
           <Button 
             onClick={handleProcessText}
             disabled={isLoading || !file}
             className="primary-button"
           >
             {isLoading ? "Processing..." : "🚀 Start Analysis"}
           </Button>
        </div>
      </section>

      {/* Status Section */}
      <section className="dashboard-section">
        {isLoading && (
           <div className="status-box loading">
             <div className="spinner"></div>
             <p>Running multi-threaded analysis...</p>
           </div>
        )}
        {!isLoading && results && (
            <div className="status-box success">
              <p>✅ Processing Complete. File ID: {fileId?.substring(0, 8)}...</p>
            </div>
        )}
      </section>

      {/* Results Section */}
      {results && (
        <section className="dashboard-section card">
          <h3>2. Analysis Results</h3>
          <div className="results-grid">
            <div className="result-item">
               <span className="label">Documents Processed</span>
               <span className="value">{results.documentsProcessed}</span>
            </div>
            <div className="result-item">
               <span className="label">Sentiment Score</span>
               <span className="value score-high">{results.sentimentScore}</span>
            </div>
            <div className="result-item full-width">
               <span className="label">Patterns Detected</span>
               <div className="tags">
                 {results.patternsFound.length > 0 ? (
                    results.patternsFound.map((p, i) => <span key={i} className="tag">{p}</span>)
                 ) : (
                    <span className="no-data">No specific patterns found.</span>
                 )}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Search & Export Section */}
      {results && (
        <section className="dashboard-section card">
          <h3>3. Search & Export</h3>
          <div className="search-bar">
             <Input 
               placeholder="Search keywords..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <Button onClick={handleSearch} className="secondary-button">🔍 Search</Button>
          </div>

          {searchResults.length > 0 && (
            <div className="search-results-list">
               <h4>Search Results ({searchResults.length})</h4>
               <table>
                 <thead>
                   <tr>
                     <th>Chunk ID</th>
                     <th>Score</th>
                     <th>Snippet</th>
                   </tr>
                 </thead>
                 <tbody>
                   {searchResults.map((r, i) => (
                     <tr key={i}>
                       <td>{r.chunk_id.split('_').pop()}</td>
                       <td>{r.score.toFixed(2)}</td>
                       <td className="snippet-cell">{r.snippet}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}

          <div className="export-controls">
             <div className="email-group">
               <Input 
                 placeholder="Email for report..." 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
               <Button onClick={handleEmailSummary} className="secondary-button">📧 Send Summary</Button>
             </div>
             <Button onClick={handleExport} className="secondary-button">⬇️ Export CSV</Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProcessorDashboard;
