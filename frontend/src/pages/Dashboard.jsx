import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginRegister from './LoginRegister';

function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const [dynamicForecast, setDynamicForecast] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [inputData, setInputData] = useState({
    Store: 1,
    DayOfWeek: 1,
    Sales: 0,
    Customers: 0,
    Open: 1,
    Promo: 1,
    StateHoliday: 0,
    SchoolHoliday: 0,
    CompetitionDistance: 200,
    CompetitionOpenSinceMonth: 9,
    CompetitionOpenSinceYear: 2010,
    Promo2: 1,
    Promo2SinceWeek: 13,
    Promo2SinceYear: 2015,
    Year: 2025,
    Month: 6,
    Day: 1,
    WeekOfYear: 22,
    IsWeekend: 0,
    StoreType_a: 1,
    StoreType_b: 0,
    StoreType_c: 0,
    StoreType_d: 0,
    Assortment_a: 0,
    Assortment_b: 1,
    Assortment_c: 0,
    PromoInterval_Feb_May_Aug_Nov: 0,
    PromoInterval_Jan_Apr_Jul_Oct: 1,
    PromoInterval_Mar_Jun_Sept_Dec: 0,
    PromoInterval_None: 0,
  });

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value)
    }));
  };

  // Submit form and get prediction from backend
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/forecast', inputData, { withCredentials: true })
      .then(res => {
        setDynamicForecast(res.data);
      })
      .catch(err => {
        alert('Prediction failed: ' + (err.response?.data?.error || err.message));
      });
  };

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
            <h2>Sales Forecast (Static)</h2>
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

          <section style={{ marginTop: "2rem" }}>
            <h2>Sales Forecast (Dynamic Input)</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
              {/* For brevity, show a subset of inputs */}
              <label>
                Store:
                <input
                  type="number"
                  name="Store"
                  value={inputData.Store}
                  onChange={handleChange}
                  required
                />
              </label>{' '}
              <label>
                DayOfWeek:
                <input
                  type="number"
                  name="DayOfWeek"
                  value={inputData.DayOfWeek}
                  onChange={handleChange}
                  min={1} max={7}
                  required
                />
              </label>{' '}
              <label>
                Promo:
                <input
                  type="number"
                  name="Promo"
                  value={inputData.Promo}
                  onChange={handleChange}
                  min={0} max={1}
                  required
                />
              </label>{' '}
              {/* Add other inputs as needed */}

              <button type="submit">Get Forecast</button>
            </form>

            {dynamicForecast && (
              <div>
                <p><strong>Category:</strong> {dynamicForecast.category}</p>
                <p><strong>Region:</strong> {dynamicForecast.region}</p>
                <p><strong>Next 7 Days Forecast:</strong> {dynamicForecast.next_7_days_sales.join(', ')}</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
