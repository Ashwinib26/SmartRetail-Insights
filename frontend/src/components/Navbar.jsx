import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ 
      backgroundColor: '#282c34', 
      padding: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        🛒 SmartRetail Insights
      </div>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Home</Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;
