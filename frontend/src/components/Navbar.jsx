import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

function Navbar({ user , setUser }) {
  const [userDetails, setUserDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const res = await axios.get('http://localhost:5000/api/user-details', { withCredentials: true });
    setUserDetails(res.data);
    setShowPopup(true);
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
    setUser(null);  
    setShowPopup(false);
    navigate('/');  
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={{ ...styles.brand, textDecoration: 'none', color: 'inherit' }}>
        🛒 SmartRetail Insights
      </Link>
      <div style={styles.links}>
        <Link to="/forecast" style={styles.link}>Forecast</Link>
        <Link to="/detailed-inventory" style={styles.link}>Inventory</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        {user ? (
          <span style={{ ...styles.link, cursor: 'pointer' }} onClick={fetchUserDetails}>
            <FaUserCircle size={24} />
          </span>
        ) : (
          <Link to="/auth" style={styles.link}>Login</Link>
        )}
      </div>

      {showPopup && userDetails && (
        <div style={styles.popup}>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Role:</strong> {userDetails.role}</p>
          <div style={{ marginTop: '1rem' }}>
            <button style={styles.button} onClick={() => setShowPopup(false)}>Close</button>
            <button style={styles.button} onClick={handleLogout}>Logout</button>
          </div>
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
  popup: {
    position: 'absolute',
    top: '64px',
    right: '1rem',
    backgroundColor: '#f5f5f5', // light gray background
    color: '#4a545c',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
  button: {
    backgroundColor: '#1e272e',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '0.9rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'background 0.3s ease'
  }
};

export default Navbar;
