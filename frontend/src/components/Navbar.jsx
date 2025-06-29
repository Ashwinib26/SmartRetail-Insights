import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>🛒 SmartRetail Insights</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/dashboard" style={styles.link}>Forecast</Link>
        <Link to="/detailed-inventory" style={styles.link}>Inventory</Link>
        {user ? (
          <span style={styles.link}>👤 {user}</span>
        ) : (
          <Link to="/auth" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#1e272e',
    height: '64px', // slightly more for vertical padding + emojis
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    padding: '0 1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxSizing: 'border-box'
  },
  brand: {
    fontSize: '1.1rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '300px', // increased
    lineHeight: '1',
    color: 'white' // ensure it's not blending in
  },
  links: {
    display: 'flex',
    gap: '1rem',
    fontSize: '1rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    lineHeight: 'normal'
  }
};

export default Navbar;
