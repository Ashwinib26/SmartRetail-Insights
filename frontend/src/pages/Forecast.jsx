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

const handleForecast = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ features: inputData }),
    });

    if (!response.ok) throw new Error('Network response not ok');

    const data = await response.json();
    alert('Predicted Sales: ' + data.predicted_sales);
  } catch (error) {
    console.error('Forecast failed:', error);
    alert('Failed to fetch forecast. See console for details.');
  }
};
