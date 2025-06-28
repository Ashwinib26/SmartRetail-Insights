import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginRegister from './LoginRegister';

function Inventory() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role);
          if (res.data.role !== 'Analyst' && res.data.role !== 'Admin') {
            alert('Not authorized');
            navigate('/');
          }
        } else {
          setShowPopup(true);
        }
      });
  }, []);

  return (
    <div>
      {showPopup && (
        <LoginRegister onSuccess={() => {
          setIsAuthenticated(true);
          setShowPopup(false);
          axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
            .then(res => {
              setRole(res.data.role);
              if (res.data.role !== 'Analyst' && res.data.role !== 'Admin') {
                alert('Not authorized');
                navigate('/');
              }
            });
        }} />
      )}
      {isAuthenticated && (role === 'Analyst' || role === 'Admin') && (
        <iframe src="http://localhost:8501" title="Inventory" width="100%" height="800px" />
      )}
    </div>
  );
}

export default Inventory;
