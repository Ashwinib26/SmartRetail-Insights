# 🛒 SmartRetail Insights

SmartRetail Insights is a web-based retail analytics and inventory management platform. It allows users like Analysts, Developers, and Admins to log in, forecast sales, track inventory, and visualize business trends through an integrated dashboard. The system includes AI-powered chatbot support and helps optimize restocking decisions with predictive insights.

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
│   ├── bot.py                        # chatbot model file
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
│       │   ├── Forecast.jsx        # Sales Forecasting page
│       │   ├── Inventory.jsx        # Inventory Analysis page
│       │   ├── Dashboard.jsx        # Main dashboard with insights
│       │   ├── ChatBot.jsx        # Integrated Chatbot model page
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
## 📷 Screenshots 
| ![Home Page](https://github.com/user-attachments/assets/5537bec3-37ec-4749-940f-af17443cf2f8) | ![Sales Forecast Page](https://github.com/user-attachments/assets/10c63e8e-a4d4-479a-95e6-93aabf19a63c) |
|:--:|:--:|
| **1. Home Page** | **2. Sales Forecast Page** |

| ![Inventory Page](https://github.com/user-attachments/assets/cc9cdf9b-cc24-4bd8-a66c-d83a10ae54bf) | ![Dashboard Page](https://github.com/user-attachments/assets/60b4337a-b7e0-4871-a447-3fc368332bb5) |
|:--:|:--:|
| **3. Inventory Page** | **4. Dashboard Page** |


---

## 🚀 Features

- 🧠 **Sales Forecasting:** Predicts future sales using a trained ML model (e.g., LightGBM) via an interactive Forecast component.
- 📦 **Inventory Management:** Dedicated Inventory page displays current stock levels and sales history for smarter restocking decisions.
- 📊 **Dashboard:** Centralized Dashboard page providing visual analytics for retail performance, demand trends, and inventory flow.
- 💬 **Business Chatbot (AI Assistant):** AI-powered chatbot component to assist with business insights, FAQs, and operational queries.
- 🔐 **Authentication:** Secure login and registration with protected routing.
- 🌐 **RESTful API:** Flask backend serving real-time data and ML forecasts through API endpoints.
- 💻 **Modern Frontend:** Responsive and dynamic UI built with React and integrated components for seamless user experience.

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
| API      | Gemini (for chatbot) |

---

## 🧪 Future Improvements

* 🚢 **CI/CD Deployment with Docker:** Containerize the full-stack application and automate deployment using Docker and GitHub Actions or similar CI/CD tools.
* 📈 **Advanced Historical Analytics:** Integrate time-series visualizations and trend analysis for historical sales, demand patterns, and inventory levels.
* 🗣️ **Enhance Chatbot Intelligence:** Improve the business chatbot’s capabilities with contextual memory, report generation, and integration with business documents.
  
---

## 🙌 Acknowledgments

* [LightGBM](https://lightgbm.readthedocs.io/)
* [React](https://reactjs.org/)
* [Flask](https://flask.palletsprojects.com/)
* [Create React App](https://create-react-app.dev/)

---

## 📬 Contact

For questions or collaborations, feel free to reach out at (ashwinisbisen@gmail.com).

---
THANK YOU !!
