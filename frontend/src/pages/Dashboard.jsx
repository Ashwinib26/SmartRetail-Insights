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
              You are not an authorized user for this page.<br/>
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
        📈 SmartRetail Insights : Analysis Dashboard {user ? ` | 👤 ${user}` : ''}
      </h1>

      {/* {isAuthenticated && !showPopup && (
        <iframe
          src="http://localhost:8501"
          title="Inventory"
          width="100%"
          height="800px"
        />
      )} */}

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
    </div>
  );
}

export default Inventory;
