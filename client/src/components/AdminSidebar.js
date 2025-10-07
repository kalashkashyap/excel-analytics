// src/components/AdminSidebar.js
import React from "react";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.title}>Admin Panel</h2>
      <nav>
        <NavLink to="users" style={styles.link} end>
          Users
        </NavLink>
        <NavLink to="uploads" style={styles.link}>
          Uploads
        </NavLink>
        <NavLink to="logs" style={styles.link}>
          Logs
        </NavLink>
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    backgroundColor: "#1f2937",
    color: "#fff",
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
  },
  title: { fontSize: "1.5rem", marginBottom: "2rem" },
  link: {
    display: "block",
    marginBottom: "1rem",
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "1.1rem",
  },
};

export default AdminSidebar;
