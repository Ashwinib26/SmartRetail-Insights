import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginRegister from './LoginRegister';

function Inventory() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Check auth status on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role);

          // Check role immediately
          if (!['Analyst', 'Admin', 'analyst', 'admin'].includes(res.data.role)) {
            alert('Not authorized for Inventory.');
            navigate('/');
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

  // ✅ The content
  return (
    <div>
      {showPopup && (
        <LoginRegister
          onSuccess={() => {
            // On successful login
            axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
              .then(res => {
                setIsAuthenticated(true);
                setShowPopup(false);
                setRole(res.data.role);

                // Validate role again
                if (!['Analyst', 'Admin', 'analyst', 'admin'].includes(res.data.role)) {
                  alert('Not authorized for Inventory.');
                  navigate('/');
                }
              })
              .catch(err => {
                console.error('Auth recheck failed:', err);
                setShowPopup(true);
              });
          }}
        />
      )}

      {isAuthenticated && (role?.toLowerCase() === 'analyst' || role?.toLowerCase() === 'admin') && (
        <iframe
          src="http://localhost:8501"
          title="Inventory"
          width="100%"
          height="800px"
        />
      )}
    </div>
  );
}

export default Inventory;
