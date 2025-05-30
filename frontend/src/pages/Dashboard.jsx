import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginRegister from './LoginRegister';

function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setShowPopup(true);
        }
      })
      .catch(() => setShowPopup(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/api/forecast', { withCredentials: true })
        .then(response => setForecast(response.data));
  
      axios.get('http://localhost:5000/api/inventory', { withCredentials: true })
        .then(response => setInventory(response.data));
    }
  }, [isAuthenticated]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Retail Analytics Dashboard</h1>

      {showPopup && (
        <LoginRegister
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowPopup(false);
          }}
        />
      )}

      {isAuthenticated && (
        <>
          <section>
            <h2>Sales Forecast</h2>
            {forecast ? (
              <div>
                <p><strong>Category:</strong> {forecast.category}</p>
                <p><strong>Region:</strong> {forecast.region}</p>
                <p><strong>Next 7 Days:</strong> {forecast.next_7_days_sales.join(', ')}</p>
              </div>
            ) : <p>Loading forecast...</p>}
          </section>

          <section style={{ marginTop: "2rem" }}>
            <h2>Inventory Status</h2>
            {inventory.length > 0 ? (
              <ul>
                {inventory.map((item, index) => (
                  <li key={index}>
                    {item.item} — Stock: {item.stock} — {item.alert ? '⚠️ Restock Needed' : '✅ OK'}
                  </li>
                ))}
              </ul>
            ) : <p>Loading inventory...</p>}
          </section>
          <section>
            <h2>Sales Forecast (via ML Model)</h2>
            {forecast ? (
              <div>
                <p><strong>Category:</strong> {forecast.category}</p>
                <p><strong>Region:</strong> {forecast.region}</p>
                <p><strong>Next 7 Days Forecast:</strong> {forecast.next_7_days_sales.join(', ')}</p>
              </div>
            ) : <p>Loading forecast...</p>}
          </section>

        </>
      )}
    </div>
  );
}

export default Dashboard;
