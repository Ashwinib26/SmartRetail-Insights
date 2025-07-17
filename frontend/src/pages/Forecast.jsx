import React, { useEffect, useState} from 'react';
import axios from 'axios';
import LoginRegister from './LoginRegister';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Forecast() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate=useNavigate();
  const [forecast, setForecast] = useState(null);
  const [dynamicForecast, setDynamicForecast] = useState(null);

  const normalizedRole = role ? role.toLowerCase() : '';

  const chartData = dynamicForecast?.next_7_days_sales?.map((sale, index) => ({
    day: `Day ${index + 1}`,
    sales: sale
  })) || [];

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
    PromoInterval_Mar_Jun_Sept_Dec: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setRole(res.data.role);
          setUser(res.data.name);

          if (!['developer', 'admin'].includes(res.data.role.toLowerCase())) {
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
  }, []);

  useEffect(() => {
    if (isAuthenticated && (normalizedRole === 'developer' || normalizedRole === 'admin')) {
      axios.get('http://localhost:5000/api/forecast', { withCredentials: true })
        .then(res => setForecast(res.data));
    }
  }, [isAuthenticated, normalizedRole]);

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
  const weekOfYear = getWeekOfYear(today);
  const isWeekend = today.getDay() === 0 || today.getDay() === 6 ? 1 : 0;
    setInputData({
      Store: Math.floor(Math.random() * 10) + 1,
      DayOfWeek: today.getDay() === 0 ? 7 : today.getDay(),  
      Open: 1,
      Promo: Math.round(Math.random()),
      SchoolHoliday: Math.round(Math.random()),
      CompetitionDistance: 500.0,
      CompetitionOpenSinceMonth: 1,
      CompetitionOpenSinceYear: 2010,
      Promo2: 0,
      Promo2SinceWeek: 0,
      Promo2SinceYear: 0,
      Year: today.getFullYear(),
      Month: today.getMonth() + 1,
      Day: today.getDate(),
      WeekOfYear: weekOfYear,
      IsWeekend: isWeekend,
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
      ForecastDate: today.toISOString().split('T')[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { ForecastDate, ...rest } = inputData;
    console.log('Sending payload:', rest);
    axios.post('http://localhost:5000/api/forecast', rest, { withCredentials: true })
      .then(res => setDynamicForecast(res.data.predicted_sales)) 
      .catch(err => alert('Prediction failed: ' + (err.response?.data?.error || err.message)));
  };

   const handleContinue = () => {
    navigate('/auth');
  };

  const handleGoBack = () => {
    navigate('/');
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

   return (
    <div style={{ padding: "2rem", backgroundColor: "#f7f9fa", minHeight: "100vh" }}>
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
              Please login with authorized role to continue.
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

      {!isAuthenticated && !showPopup && (
        <LoginRegister
          onSuccess={() => {
            axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
              .then(res => {
                if (res.data.authenticated) {
                  setIsAuthenticated(true);
                  setRole(res.data.role);
                  setUser(res.data.name);

                  if (!['developer', 'admin'].includes(res.data.role.toLowerCase())) {
                    setShowPopup(true);
                  }
                } else {
                  setShowPopup(true);
                }
              });
          }}
        />
      )}

      {isAuthenticated && !showPopup && (
        <>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            📈 SmartRetail Insights : Sales Forecast {user ? ` | 👤 ${user}` : ''}
          </h1>

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
              </div>
            </form>
          </div>

          {dynamicForecast !== null && (
            <div style={{
              ...sectionStyle,
              borderLeft: "6px solid #0984e3",
              padding: "2rem"
            }}>
              <h3 style={{ fontSize: "1.5rem", color: "#0984e3" }}>📅 Forecast Result</h3>
              <div style={{
                marginTop: "1rem",
                padding: "1.5rem",
                backgroundColor: "#dfe6e9",
                borderRadius: "8px",
                fontSize: "1.25rem",
                fontWeight: "600",
                textAlign: "center"
              }}>
                🔮 Predicted Sales for Selected Day: <span style={{ color: "#2d3436" }}>{dynamicForecast}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Forecast;