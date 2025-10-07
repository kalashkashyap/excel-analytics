// src/components/Layout.js
import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  container: { display: "flex", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  main: { flexGrow: 1, padding: "2rem", backgroundColor: "#f5f7fa", minHeight: "100vh" },
};

export default Layout;
