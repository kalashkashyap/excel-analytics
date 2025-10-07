import React from "react";
import { FaHome, FaFileExcel, FaChartBar, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // get current path
  const isAdmin = localStorage.getItem("role") === "admin";

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { label: "Upload Excel", icon: <FaFileExcel />, path: "/upload" },
    { label: "Reports", icon: <FaChartBar />, path: "/reports" },
  ];

  if (isAdmin) {
    menuItems.push({ label: "Admin Panel", icon: <FaUserShield />, path: "/admin" });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Excel Analytics</h2>
      <ul style={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.li,
              backgroundColor: location.pathname === item.path ? "#5148E5" : "transparent",
              borderRadius: "6px",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}

        <li onClick={handleLogout} style={{ ...styles.li, marginTop: "auto", color: "#ff6b6b" }}>
          <FaSignOutAlt />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    backgroundColor: "#6C63FF",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: { fontSize: "1.6rem", fontWeight: "bold", marginBottom: "2rem" },
  menu: { listStyle: "none", padding: 0, display: "flex", flexDirection: "column", flex: 1 },
  li: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 15px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "1rem",
  },
};

export default Sidebar;
