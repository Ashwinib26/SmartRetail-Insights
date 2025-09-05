import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


function Forecast() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [dynamicForecast, setDynamicForecast] = useState(null);
  const [predictedSales, setPredictedSales] = useState(null);

  const navigate = useNavigate();
  const normalizedRole = role ? role.toLowerCase() : '';

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
    IsPromoMonth: 1,
    ForecastDate: '',
    forecastDays: 7
  });

  const chartData = dynamicForecast?.next_n_days_sales?.map((sale, index) => ({
    day: `Day ${index + 1}`,
    sales: sale
  })) || [];

  const getWeekOfYear = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  };

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
        WeekOfYear: getWeekOfYear(date)
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
    setInputData({
      ...inputData,
      Store: 1,
      DayOfWeek: today.getDay() === 0 ? 7 : today.getDay(),
      Open: 1,
      Promo: 0,
      SchoolHoliday: 0,
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
      IsPromoMonth: 1,
      ForecastDate: today.toISOString().split('T')[0],
      forecastDays: 7
    });
  };

  const handleForecast = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ features: inputData, forecastDays: inputData.forecastDays}),
      });
      console.log("Forecast API response:", response);

      if (!response.ok) throw new Error('Network response not ok');

      const data = await response.json();
      if (data.next_n_days_sales) {
        setDynamicForecast({ next_n_days_sales: data.next_n_days_sales });
        setPredictedSales(data.next_n_days_sales[0]); // store first day as "next day"
      } 
      else 
      {
        setDynamicForecast({ next_n_days_sales: [data.predicted_sales] });
        setPredictedSales(data.predicted_sales);
      }

      console.log("Forecast API parsed data:", data);

    } catch (error) {
      console.error('Forecast failed:', error);
      alert('Failed to fetch forecast. See console for details.');
    }
  };


  const sectionStyle = { background: "#ffffff", padding: "1.5rem 2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "2rem" };
  const inputStyle = { padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" };
  const buttonStyle = { backgroundColor: '#1e272e', color: '#fff', padding: '10px 20px', fontSize: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f7f9fa", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        📈 SmartRetail Insights : Sales Forecast {user ? ` | 👤 ${user}` : ''}
      </h1>

      <div style={sectionStyle}>
        <form onSubmit={handleForecast}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {Object.keys(inputData).map((key, i) => (
              key !== 'ForecastDate' && key !== 'forecastDays' && (
                <div key={i}>
                  <label style={{ fontWeight: "500" }}>{key}</label>
                  <input
                    style={inputStyle}
                    type={typeof inputData[key] === 'number' ? 'number' : 'text'}
                    name={key}
                    value={inputData[key]}
                    onChange={handleChange}
                  />
                </div>
              )
            ))}
            <div>
              <label style={{ fontWeight: "500" }}>ForecastDate</label>
              <input
                type="date"
                name="ForecastDate"
                value={inputData.ForecastDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontWeight: "500" }}>Forecast Days</label>
              <input
                style={inputStyle}
                type="number"
                name="forecastDays"
                value={inputData.forecastDays}
                min="1"
                max="30"
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <button type="submit" style={buttonStyle}>📈 Get Forecast</button>
            <button type="button" onClick={handleReset} style={buttonStyle}>♻️ Reset</button>
          </div>
        </form>
      </div>

      {dynamicForecast?.next_n_days_sales && (
        <div style={{ marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: '500', color: '#0e181fff' }}>
          <ul>
            {dynamicForecast.next_n_days_sales.map((sale, index) => (
              <li key={index}>
                Predicted Sales for Day {index + 1}:{" "}
                {sale !== undefined && sale !== null ? sale.toLocaleString() : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dynamicForecast && (
        <div style={{ ...sectionStyle, borderLeft: "6px solid #0f1214ff", padding: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", color: "#11181eff" }}>📅 Forecast Result</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#0e181fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Forecast;
