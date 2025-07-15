import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginRegister from './LoginRegister';

function Inventory() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role);
          setUser(res.data.name)

          if (!['analyst', 'admin'].includes(res.data.role.toLowerCase())) {
            setShowPopup(true);
          }
        } else {
          setShowPopup(true);
        }
      })
      .catch(err => {
        console.error('Auth check failed:', err);
        setShowPopup(true);
      });
  }, [navigate]);

  const handleContinue = () => {
    navigate('/auth');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const tableHeader = {
    padding: '10px',
    fontWeight: 'bold',
    borderBottom: '2px solid #ccc'
  };

  const tableCell = {
    padding: '8px',
    borderBottom: '1px solid #eee'
  };

  const buttonStyle = {
    backgroundColor: '#1e272e',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const sectionStyle = {
    background: "#ffffff",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "2rem"
  };

  const handleToggleInventory = () => {
    if (!showInventory) {
      fetchInventory();
    }
    setShowInventory(prev => !prev);
  };

  const fetchInventory = () => {
    axios.get('http://localhost:5000/api/inventory', { withCredentials: true })
      .then(res => setInventory(res.data));
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'low') return item.alert === 1;
    if (filter === 'in') return item.alert === 0;
    return true; // all
  });

  return (
    <div style={{ padding: "2rem" }}>
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '400px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#d63031' }}>🚫 Access Unavailable</h2>
            <p style={{ marginBottom: '2rem' }}>
              You are not an authorized user for this page.<br />
              Please login with an authorized role to continue.
            </p>
            <button
              onClick={handleGoBack}
              style={{
                background: '#0984e3',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
            <button
              onClick={handleContinue}
              style={{
                background: '#0984e3',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        📈 SmartRetail Insights : Inventory Management {user ? ` | 👤 ${user}` : ''}
      </h1>

      {!isAuthenticated && !showPopup && (
        <LoginRegister
          onSuccess={() => {
            axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
              .then(res => {
                setIsAuthenticated(true);
                setRole(res.data.role);
                if (!['analyst', 'admin'].includes(res.data.role.toLowerCase())) {
                  setShowPopup(true);
                }
              });
          }}
        />
      )}

      <div>
        <button type="button" onClick={handleToggleInventory} style={buttonStyle}>
          📦 {showInventory ? "Hide Inventory" : "Display Inventory"}
        </button>

        {showInventory && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: '1rem', padding: '8px', fontSize: '1rem' }}
          >
            <option value="all">All Items</option>
            <option value="low">Low Stock</option>
            <option value="in">In Stock</option>
          </select>
        )}
      </div>

      {showInventory && (
        <div style={sectionStyle}>
          <h3>📦 Current Inventory Overview</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead style={{ backgroundColor: '#dfe6e9' }}>
              <tr>
                <th style={tableHeader}>Item</th>
                <th style={tableHeader}>Category</th>
                <th style={tableHeader}>Demand</th>
                <th style={tableHeader}>Stock</th>
                <th style={tableHeader}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, idx) => (
                <tr key={idx} style={{ textAlign: 'center' }}>
                  <td style={tableCell}>{item.item}</td>
                  <td style={tableCell}>{item.category}</td>
                  <td style={tableCell}>{item.demand}</td>
                  <td style={tableCell}>{item.stock}</td>
                  <td style={tableCell}>
                    {item.alert ? <span style={{ color: '#d63031' }}>⚠️ Low</span> : <span style={{ color: '#00b894' }}>✅ OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Inventory;
