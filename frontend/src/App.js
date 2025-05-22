import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [forecast, setForecast] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    // Fetch forecast data
    axios.get('http://localhost:5000/api/forecast')
      .then(response => setForecast(response.data))
      .catch(err => console.error('Forecast API error:', err));

    // Fetch inventory data
    axios.get('http://localhost:5000/api/inventory')
      .then(response => setInventory(response.data))
      .catch(err => console.error('Inventory API error:', err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Retail Analytics Dashboard</h1>

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
    </div>
  );
}

export default App;
