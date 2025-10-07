// src/pages/UploadsPage.js
import React, { useEffect, useState } from "react";

function UploadsPage() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/uploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUploads(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch uploads");
    }
    setLoading(false);
  };

  if (loading) return <p>Loading uploads...</p>;

  return (
    <div style={styles.card}>
      <h2 style={styles.cardHeader}>Uploads</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload, idx) => (
              <tr key={idx}>
                <td>{upload.fileName}</td>
                <td>{upload.username}</td>
                <td>{new Date(upload.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    marginBottom: "1rem",
    borderBottom: "2px solid #eaeaea",
    paddingBottom: "0.5rem",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "center" },
};

export default UploadsPage;
