// src/pages/LogsPage.js
import React, { useEffect, useState } from "react";

function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch logs");
    }
    setLoading(false);
  };

  if (loading) return <p>Loading logs...</p>;

  return (
    <div style={styles.card}>
      <h2 style={styles.cardHeader}>Logs</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.action}</td>
                <td>{log.username}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
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

export default LogsPage;
