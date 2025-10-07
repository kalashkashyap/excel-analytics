// src/pages/AdminPanelTemp.js
import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AdminPanelTemp() {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [usersRes, uploadsRes, logsRes] = await Promise.all([
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/uploads", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/logs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const uploadsData = await uploadsRes.json();
      const logsData = await logsRes.json();

      setUsers(usersData);
      setUploads(uploadsData);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admin data");
    }
    setLoading(false);
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading admin dashboard...
      </p>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#111827" }}>
          Welcome, Admin
        </h1>

        {/* Users Table */}
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Users</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Uploads Table */}
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Uploads</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
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

        {/* Logs Table */}
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Logs</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
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
      </main>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    marginBottom: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    marginBottom: "1rem",
    borderBottom: "2px solid #eaeaea",
    paddingBottom: "0.5rem",
    color: "#374151",
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    minWidth: "600px",
  },
  thead: { backgroundColor: "#f3f4f6" },
};

export default AdminPanelTemp;
