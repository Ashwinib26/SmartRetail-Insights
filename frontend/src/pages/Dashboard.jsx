import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginRegister from './LoginRegister';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(['stock', 'demand']);
  const [chartType, setChartType] = useState('Bar');

  useEffect(() => {
    axios.get('http://localhost:5000/api/inventory', { withCredentials: true })
      .then(res => {
        setInventory(res.data);
      })
      .catch(err => {
        console.error('Failed to load inventory:', err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role);
          setUser(res.data.name);

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

  const handleContinue = () => navigate('/auth');
  const handleGoBack = () => navigate('/');
  const handleToggleChart = () => setShowChart(!showChart);

  const handleColumnChange = (col) => {
    setSelectedColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
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
              You are not an authorized user for this page.<br />
              Please login with an authorized role to continue.
            </p>
            <button onClick={handleGoBack}
              style={{
                background: '#0984e3', color: '#fff',
                padding: '10px 20px', fontSize: '1rem',
                border: 'none', borderRadius: '8px',
                cursor: 'pointer', marginRight: '1rem'
              }}>Go Back</button>
            <button onClick={handleContinue}
              style={{
                background: '#0984e3', color: '#fff',
                padding: '10px 20px', fontSize: '1rem',
                border: 'none', borderRadius: '8px',
                cursor: 'pointer'
              }}>Continue</button>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        📈 SmartRetail Insights : Analysis Dashboard {user ? ` | 👤 ${user}` : ''}
      </h1>

      {isAuthenticated && !showPopup && (
        <>
          <iframe
            src="http://localhost:8501"
            title="Inventory"
            width="100%"
            height="800px"
          />

          <div style={{ marginTop: '1rem' }}>
            <h3>Select Columns to Plot:</h3>
            <label>
              <input
                type="checkbox"
                checked={selectedColumns.includes('stock')}
                onChange={() => handleColumnChange('stock')}
              /> Stock
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input
                type="checkbox"
                checked={selectedColumns.includes('demand')}
                onChange={() => handleColumnChange('demand')}
              /> Demand
            </label>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>
              <h3>Select Chart Type:</h3>
              <select value={chartType} onChange={handleChartTypeChange}>
                <option value="Bar">Bar Chart</option>
                <option value="Line">Line Chart</option>
              </select>
            </label>
          </div>

          <button
            onClick={handleToggleChart}
            style={{
              marginTop: '1rem',
              background: '#1e272e',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </button>

          {showChart && (
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'Bar' ? (
                <BarChart data={inventory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="item" />
                  <YAxis />
                  <Tooltip />
                  {selectedColumns.includes('stock') && (
                    <Bar dataKey="stock" fill="#00b894" />
                  )}
                  {selectedColumns.includes('demand') && (
                    <Bar dataKey="demand" fill="#d63031" />
                  )}
                </BarChart>
              ) : (
                <LineChart data={inventory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="item" />
                  <YAxis />
                  <Tooltip />
                  {selectedColumns.includes('stock') && (
                    <Line type="monotone" dataKey="stock" stroke="#81908dff" />
                  )}
                  {selectedColumns.includes('demand') && (
                    <Line type="monotone" dataKey="demand" stroke="#464343ff" />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </>
      )}

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

export default Dashboard;
