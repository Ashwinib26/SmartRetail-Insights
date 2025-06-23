import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginRegister from './LoginRegister';
import 'D:/projects/Final Project/SmartRetail Insights/frontend/src/index.css';

function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const [dynamicForecast, setDynamicForecast] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [inputData, setInputData] = useState({
    Store: 1, DayOfWeek: 4, Promo: 1, SchoolHoliday: 0,
    StateHoliday_0: 1, StateHoliday_a: 0, StateHoliday_b: 0, StateHoliday_c: 0,
    StoreType_a: 1, StoreType_b: 0, StoreType_c: 0, StoreType_d: 0,
    Assortment_a: 1, Assortment_b: 0, Assortment_c: 0,
    Promo2: 1, Promo2SinceWeek: 13, Promo2SinceYear: 2015,
    CompetitionDistance: 200.0, CompetitionOpenSinceMonth: 9, CompetitionOpenSinceYear: 2010,
    PromoInterval_Feb_May_Aug_Nov: 0, PromoInterval_Jan_Apr_Jul_Oct: 1,
    PromoInterval_Mar_Jun_Sept_Dec: 0, PromoInterval_None: 0,
    Open: 1, Year: 2022, Month: 1, Day: 1, WeekOfYear: 1, IsWeekend: 0,
    ForecastDate: '2022-01-01'
  });

  const navigate = useNavigate();

  const getWeekOfYear = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        res.data.authenticated ? setIsAuthenticated(true) : setShowPopup(true);
      }).catch(() => setShowPopup(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/api/forecast', { withCredentials: true })
        .then(res => setForecast(res.data));
      axios.get('http://localhost:5000/api/inventory', { withCredentials: true })
        .then(res => setInventory(res.data));
    }
  }, [isAuthenticated]);

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
    const allowed = [ "Store", "DayOfWeek", "Promo", "SchoolHoliday", "StateHoliday_0", "StateHoliday_a", "StateHoliday_b", "StateHoliday_c", "StoreType_a", "StoreType_b", "StoreType_c", "StoreType_d", "Assortment_a", "Assortment_b", "Assortment_c", "Promo2", "Promo2SinceWeek", "Promo2SinceYear", "CompetitionDistance", "CompetitionOpenSinceMonth", "CompetitionOpenSinceYear", "PromoInterval_Feb_May_Aug_Nov", "PromoInterval_Jan_Apr_Jul_Oct", "PromoInterval_Mar_Jun_Sept_Dec", "PromoInterval_None", "Open", "WeekOfYear" ];
    const modelInput = Object.fromEntries(Object.entries(rest).filter(([k]) => allowed.includes(k)));

    axios.post('http://localhost:5000/api/forecast', modelInput, { withCredentials: true })
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
    backgroundColor: '#0984e3',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f7f9fa", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>📈 Sales Forecast Dashboard</h1>

      {showPopup && <LoginRegister onSuccess={() => { setIsAuthenticated(true); setShowPopup(false); }} />}

      {isAuthenticated && (
        <>
          <div style={sectionStyle}>
            <p style={{ fontSize: "1.1rem" }}>
              Configure the parameters to forecast upcoming sales based on store, promo, holidays, and more.
            </p>
          </div>

          <div style={sectionStyle}>
            <h2> Forecast Parameters</h2>
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
