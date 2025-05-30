# 🛒 SmartRetail Insights

SmartRetail Insights is a full-stack web application designed to forecast product sales and provide intelligent retail analytics. It leverages a machine learning model to predict future demand and assists businesses in making data-driven inventory and restocking decisions.

---

## 📁 Project Structure

```

SMARTRETAIL INSIGHTS/
│
├── backend/
│   ├── instance/
│   │   └── users.db                  # SQLite database file
│   ├── models/
│   │   └── sales\_forecast\_model.pkl  # Serialized ML model (e.g., LightGBM)
│   ├── routes/                       # (Optional) Flask route modules
│   ├── venv/                         # Python virtual environment
│   ├── app.py                        # Flask backend entry point
│   └── ForeCastModel.ipynb          # Model training and exploration
│
├── data/                             # Dataset used for training
│
├── frontend/
│   ├── node\_modules/                # Node dependencies
│   ├── public/
│   └── src/
│       ├── components/              # Shared React components
│       ├── pages/
│       │   ├── Dashboard.jsx        # Main dashboard with insights
│       │   ├── Home.jsx             # Landing/homepage
│       │   └── LoginRegister.jsx    # Login/Signup forms
│       ├── App.js                   # Main React component
│       ├── index.js                 # Entry point for React app
│       ├── App.css / index.css      # Global styles
│       └── logo.svg
│
└── README.md                        # Project documentation

````

---

## 🚀 Features

- 🧠 **Sales Forecasting:** Uses a trained ML model (e.g., LightGBM) for future sales prediction.
- 📊 **Dashboard:** Visual insights for sales, demand, and restocking needs.
- 🔐 **Authentication:** Login and registration pages with secure routing.
- 🌐 **API:** Flask backend with REST API endpoints.
- 💻 **Modern Frontend:** Built with React for responsive and dynamic UI.

---

## 🧠 ML Model

- **Notebook:** `ForeCastModel.ipynb` contains the model training code.
- **Model File:** `sales_forecast_model.pkl` is loaded by the backend.
- **Libraries Used:** `lightgbm`, `sklearn`, `pandas`, `joblib`

---

## 🔧 Getting Started

### 1. Backend (Flask + Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
````

> Ensure the model file `sales_forecast_model.pkl` is present inside the `models/` directory.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

> Make sure the backend runs on `http://localhost:5000` and frontend on `http://localhost:3000`.

---

## ⚙️ Tech Stack

| Layer    | Tech                        |
| -------- | --------------------------- |
| Frontend | React.js, Axios             |
| Backend  | Flask, Flask-CORS, SQLite   |
| ML Model | LightGBM / scikit-learn     |
| Storage  | Joblib, SQLite (`users.db`) |

---

## 🧪 Future Improvements

* Add CI/CD deployment using Docker
* Add role-based user access
* Implement historical analytics with charts

---

## 🙌 Acknowledgments

* [LightGBM](https://lightgbm.readthedocs.io/)
* [React](https://reactjs.org/)
* [Flask](https://flask.palletsprojects.com/)
* [Create React App](https://create-react-app.dev/)

---

## 📬 Contact

For questions or collaborations, feel free to reach out at (ashwinisbisen@gmail.com).

```

