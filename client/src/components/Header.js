import React from 'react';

function Header({ title, onLogout }) {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <button onClick={onLogout} style={styles.logout}>Logout</button>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  title: { fontSize: '1.5rem', color: '#333' },
  logout: {
    backgroundColor: '#FF4C4C',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Header;
