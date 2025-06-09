import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginRegister from './LoginRegister';
import 'D:/projects/Final Project/SmartRetail Insights/frontend/src/index.css'

function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const [dynamicForecast, setDynamicForecast] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [inputData, setInputData] = useState({
    Store: 1,
    DayOfWeek: 4,
    Promo: 1,
    SchoolHoliday: 0,
    StateHoliday_0: 1,
    StateHoliday_a: 0,
    StateHoliday_b: 0,
    StateHoliday_c: 0,
    StoreType_a: 1,
    StoreType_b: 0,
    StoreType_c: 0,
    StoreType_d: 0,
    Assortment_a: 1,
    Assortment_b: 0,
    Assortment_c: 0,
    Promo2: 1,
    Promo2SinceWeek: 13,
    Promo2SinceYear: 2015,
    CompetitionDistance: 200.0,
    CompetitionOpenSinceMonth: 9,
    CompetitionOpenSinceYear: 2010,
    PromoInterval_Feb_May_Aug_Nov: 0,
    PromoInterval_Jan_Apr_Jul_Oct: 1,
    PromoInterval_Mar_Jun_Sept_Dec: 0,
    PromoInterval_None: 0,

    Open: 1,
    Year: 2022,
    Month: 1,
    Day: 1,
    WeekOfYear: 1,
    IsWeekend: 0,
    ForecastDate: '2022-01-01' 
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

  const getWeekOfYear = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      ForecastDate, // exclude helper field
      ...rest
    } = inputData;

    // Define the 27 expected feature names by your model
    const allowedFields = [
      "Store", "DayOfWeek", "Promo", "SchoolHoliday",
      "StateHoliday_0", "StateHoliday_a", "StateHoliday_b", "StateHoliday_c",
      "StoreType_a", "StoreType_b", "StoreType_c", "StoreType_d",
      "Assortment_a", "Assortment_b", "Assortment_c",
      "Promo2", "Promo2SinceWeek", "Promo2SinceYear",
      "CompetitionDistance", "CompetitionOpenSinceMonth", "CompetitionOpenSinceYear",
      "PromoInterval_Feb_May_Aug_Nov", "PromoInterval_Jan_Apr_Jul_Oct",
      "PromoInterval_Mar_Jun_Sept_Dec", "PromoInterval_None",
      "Open", "WeekOfYear"
    ];


    // Filter out only the required fields
    const modelInput = Object.fromEntries(
      Object.entries(rest).filter(([key]) => allowedFields.includes(key))
    );

    axios.post('http://localhost:5000/api/forecast', modelInput, { withCredentials: true })
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
              {Object.keys(inputData).map((key, idx) => {
                const isDateField = key === 'ForecastDate';
                return (
                  <label key={idx} style={{ marginRight: '1rem', display: 'inline-block', width: '250px', marginBottom: '1rem' }}>
                    {key}:
                    <input
                      type={isDateField ? 'date' : 'number'}
                      name={key}
                      value={inputData[key]}
                      onChange={handleChange}
                      style={{ marginLeft: '5px' }}
                    />
                  </label>
                );
              })}

              <br /><button type="submit" style={{ marginTop: '1rem' }}>Get Forecast</button>
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
