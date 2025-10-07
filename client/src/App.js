// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth / User Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Admin Panel
import AdminPanelTemp from "./pages/AdminPanelTemp";
import UsersPage from "./pages/UsersPage";
import UploadsPage from "./pages/UploadsPage";
import LogsPage from "./pages/LogsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // "admin" or "user"
    if (token) setIsLoggedIn(true);
    if (userRole) setRole(userRole);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />

        {/* Admin Panel */}
        {role === "admin" && (
          <Route path="/admin/*" element={<AdminPanelTemp />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="uploads" element={<UploadsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="*" element={<Navigate to="users" replace />} />
          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
