import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar({ user }) {
  const [userDetails, setUserDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchUserDetails = async () => {
    const res = await axios.get('http://localhost:5000/api/user-details', { withCredentials: true });
    setUserDetails(res.data);
    setShowPopup(true);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>🛒 SmartRetail Insights</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/dashboard" style={styles.link}>Forecast</Link>
        <Link to="/detailed-inventory" style={styles.link}>Inventory</Link>
        {user ? (
          <span style={{ ...styles.link, cursor: 'pointer' }} onClick={fetchUserDetails}>
            👤
          </span>
        ) : (
          <Link to="/auth" style={styles.link}>Login</Link>
        )}
      </div>

      {showPopup && userDetails && (
        <div style={styles.popup}>
          <h4>User Details</h4>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Role:</strong> {userDetails.role}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#1e272e',
    height: '64px',
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
    fontWeight: 600
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
    cursor: 'pointer'
  },
  popup: {
    position: 'absolute',
    top: '64px',
    right: '1rem',
    backgroundColor: 'white',
    color: '#1e272e',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
};

export default Navbar;
