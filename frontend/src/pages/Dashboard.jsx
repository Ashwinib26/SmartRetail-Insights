import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginRegister from './LoginRegister';

function Dashboard({ user, setUser }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [forecast, setForecast] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [dynamicForecast, setDynamicForecast] = useState(null);

  const normalizedRole = role ? role.toLowerCase() : '';

  const [showInventory, setShowInventory] = useState(false);

  const [inputData, setInputData] = useState({
    Store: 1,
    DayOfWeek: 1,
    Open: 1,
    Promo: 1,
    SchoolHoliday: 0,
    CompetitionDistance: 500.0,
    CompetitionOpenSinceMonth: 1,
    CompetitionOpenSinceYear: 2010,
    Promo2: 0,
    Promo2SinceWeek: 0,
    Promo2SinceYear: 0,
    Year: 2022,
    Month: 1,
    Day: 1,
    WeekOfYear: 1,
    IsWeekend: 0,
    StoreType_a: 1,
    StoreType_b: 0,
    StoreType_c: 0,
    StoreType_d: 0,
    Assortment_a: 1,
    Assortment_b: 0,
    Assortment_c: 0,
    StateHoliday_0: 1,
    StateHoliday_a: 0,
    StateHoliday_b: 0,
    StateHoliday_c: 0,
    PromoInterval_Feb_May_Aug_Nov: 0,
    PromoInterval_Jan_Apr_Jul_Oct: 0,
    PromoInterval_Mar_Jun_Sept_Dec: 0,
    PromoInterval_None: 1
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role);
          setUser(res.data.name);
        } else {
          setShowPopup(true);
        }
      })
      .catch(() => setShowPopup(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated && role) {
      if (normalizedRole === 'developer' || normalizedRole === 'admin') {
        axios.get('http://localhost:5000/api/forecast', { withCredentials: true })
          .then(res => setForecast(res.data));
      }
    }
  }, [isAuthenticated, normalizedRole]);

  const fetchInventory = () => {
    axios.get('http://localhost:5000/api/inventory', { withCredentials: true })
      .then(res => setInventory(res.data));
  };

  const handleToggleInventory = () => {
    if (!showInventory) {
      fetchInventory();
    }
    setShowInventory(prev => !prev);
  };

  const getWeekOfYear = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ForecastDate") {
      const date = new Date(value);
      setInputData(prev => ({
        ...prev,
        ForecastDate: value,
        Year: date.getFullYear(),
        Month: date.getMonth() + 1,
        Day: date.getDate(),
        WeekOfYear: getWeekOfYear(date),
        IsWeekend: date.getDay() === 0 || date.getDay() === 6 ? 1 : 0
      }));
    } else {
      setInputData(prev => ({
        ...prev,
        [name]: isNaN(value) ? value : Number(value)
      }));
    }
  };

  const handleReset = () => {
    const today = new Date();
    setInputData(prev => ({
      ...prev,
      Store: Math.floor(Math.random() * 10) + 1,
      Promo: Math.round(Math.random()),
      SchoolHoliday: Math.round(Math.random()),
      ForecastDate: today.toISOString().split('T')[0],
      Year: today.getFullYear(),
      Month: today.getMonth() + 1,
      Day: today.getDate(),
      WeekOfYear: getWeekOfYear(today),
      IsWeekend: today.getDay() === 0 || today.getDay() === 6 ? 1 : 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { ForecastDate, ...rest } = inputData;
    console.log('Sending payload:', rest);
    axios.post('http://localhost:5000/api/forecast', rest, { withCredentials: true })
      .then(res => setDynamicForecast(res.data))
      .catch(err => alert('Prediction failed: ' + (err.response?.data?.error || err.message)));
  };

  const sectionStyle = {
    background: "#ffffff",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "2rem"
  };

  const inputStyle = {
    padding: "8px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc"
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

  const tableHeader = {
    padding: '10px',
    fontWeight: 'bold',
    borderBottom: '2px solid #ccc'
  };

  const tableCell = {
    padding: '8px',
    borderBottom: '1px solid #eee'
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f7f9fa", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        📈 SmartRetail Insights : Forecast and Inventory {user ? ` | 👤 ${user}` : ''}
      </h1>

      {showPopup && (
        <LoginRegister onSuccess={() => {
          axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
            .then(res => {
              if (res.data.authenticated) {
                setUser(res.data.name);
              }
            });
        }} />
      )}

      {isAuthenticated && (
        <>
          {(['developer', 'admin'].includes(normalizedRole)) && (
            <>
              <div style={sectionStyle}>
                <p>Configure the parameters to forecast upcoming sales.</p>
              </div>

              <div style={sectionStyle}>
                <h2>Forecast Parameters</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    {Object.keys(inputData).map((key, i) => (
                      <div key={i}>
                        <label style={{ fontWeight: "500" }}>{key}</label>
                        <input
                          type={key === "ForecastDate" ? "date" : "number"}
                          name={key}
                          value={inputData[key]}
                          onChange={handleChange}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "1.5rem" }}>
                    <button type="submit" style={buttonStyle}>📈 Get Forecast</button>
                    <button type="button" onClick={handleReset} style={buttonStyle}>♻️ Reset</button>
                    <button onClick={handleToggleInventory} style={buttonStyle}>
                      📦 {showInventory ? "Hide Inventory" : "Display Inventory"}
                    </button>
                  </div>
                </form>
              </div>

              {dynamicForecast && (
                <div style={sectionStyle}>
                  <h3>📅 Forecast Result</h3>
                  <p><strong>Category:</strong> {dynamicForecast.category}</p>
                  <p><strong>Region:</strong> {dynamicForecast.region}</p>
                  <p><strong>Next 7 Days Sales:</strong> {dynamicForecast.next_7_days_sales.join(', ')}</p>
                </div>
              )}

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
                      {inventory.map((item, idx) => (
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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
