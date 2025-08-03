from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import pandas as pd
import pymysql
import numpy as np
from dotenv import load_dotenv
from pathlib import Path
from bot import ask_chatbot

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
app.secret_key = 'your-secret-key'
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

users_db = {}   # email -> password_hash
roles_db = {}   # email -> role

model = joblib.load('D:/projects/Final Project/SmartRetail Insights/backend/sales_forecast_model.pkl')
print("Loaded model:", type(model))

EXPECTED_FEATURES = [
  "Store", "DayOfWeek", "Open", "Promo", "SchoolHoliday",
  "CompetitionDistance", "CompetitionOpenSinceMonth", "CompetitionOpenSinceYear",
  "Promo2", "Promo2SinceWeek", "Promo2SinceYear",
  "Year", "Month", "Day", "WeekOfYear", "IsWeekend",
  "StoreType_a", "StoreType_b", "StoreType_c", "StoreType_d",
  "Assortment_a", "Assortment_b", "Assortment_c",
  "StateHoliday_0", "StateHoliday_a", "StateHoliday_b", "StateHoliday_c",
  "PromoInterval_Feb_May_Aug_Nov", "PromoInterval_Jan_Apr_Jul_Oct",
  "PromoInterval_Mar_Jun_Sept_Dec"
]

MODEL_COLUMNS = [f'Column_{i}' for i in range(len(EXPECTED_FEATURES))]

MODEL_COLUMNS = EXPECTED_FEATURES.copy()
print("Expected features:", len(EXPECTED_FEATURES))

def make_prediction(input_dict):
    full_input = {f: input_dict.get(f, 0) for f in EXPECTED_FEATURES}
    ordered_values = [full_input[f] for f in EXPECTED_FEATURES]
    df = pd.DataFrame([ordered_values], columns=MODEL_COLUMNS)
    prediction = model.predict(df)[0]
    return prediction

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')  # 👉 plain text
    role = data.get('role', 'Analyst')

    if not email or not password or not role or not name:
        return jsonify({'error': 'Name, email, password, role are required'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                return jsonify({'error': 'User already exists'}), 400

            # 👇 INSERT plain password directly
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                (name, email, password, role)
            )
            connection.commit()
        connection.close()

        session['user'] = email
        session['role'] = role
        return jsonify({'message': 'Registered successfully', 'role': role, 'name': name}), 200

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT name, password, role FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        if not isinstance(user, dict):
            user = dict(user)

        stored_password = user['password']
        stored_role = user['role']

        if stored_password != password:
            return jsonify({'error': 'Invalid credentials'}), 401

        if role.lower() != stored_role.lower():
            return jsonify({'error': 'Incorrect role for this user'}), 403

        session['user'] = email
        session['role'] = stored_role
        return jsonify({
            'message': 'Logged in successfully',
            'role': stored_role,
            'name': user['name']
        }), 200

    finally:
        connection.close()

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    session.pop('role', None)
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user' not in session:
        return jsonify({'authenticated': False})
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT name FROM users WHERE email = %s", (session['user'],))
            user = cursor.fetchone()
        return jsonify({
            'authenticated': True,
            'role': session.get('role'),
            'name': user['name']  
        })
    finally:
        connection.close()

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        prompt = data.get("message", "").strip()
        if not prompt:
            return jsonify({"reply": "⚠️ Please enter a message."}), 400

        reply = ask_chatbot(prompt)
        return jsonify({"reply": reply})

    except Exception as e:
        app.logger.exception("Chat error:")
        return jsonify({"reply": f"⚠️ Internal error: {e}"}), 500

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if session.get('role').lower() not in ['developer', 'admin']:
        return jsonify({'error': 'Forbidden'}), 403
    try:
        static_data = {
            'Store': 1, 'DayOfWeek': 4, 'Open': 1, 'Promo': 1, 'SchoolHoliday': 0,
            'CompetitionDistance': 200.0, 'CompetitionOpenSinceMonth': 9, 'CompetitionOpenSinceYear': 2010,
            'Promo2': 1, 'Promo2SinceWeek': 13, 'Promo2SinceYear': 2015,
            'Year': 2022, 'Month': 1, 'Day': 1, 'WeekOfYear': 1, 'IsWeekend': 0,
            'StoreType_a': 1, 'StoreType_b': 0, 'StoreType_c': 0, 'StoreType_d': 0,
            'Assortment_a': 1, 'Assortment_b': 0, 'Assortment_c': 0,
            'PromoInterval_Feb_May_Aug_Nov': 0, 'PromoInterval_Jan_Apr_Jul_Oct': 1,
            'PromoInterval_Mar_Jun_Sept_Dec': 0, 'PromoInterval_None': 0
        }

        prediction = make_prediction(static_data)
        return jsonify({"predicted_sales": int(prediction)})

    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/api/forecast', methods=['POST'])
def post_forecast():
    data = request.get_json()
    sales = data.get('sales', [])
    forecast_days = data.get('forecastDays', 0)

    if not sales or not forecast_days:
        return jsonify({'error': 'Missing sales or forecastDays'}), 400

    forecast = [sales[-1] + i * 5 for i in range(1, forecast_days + 1)]
    return jsonify({'forecast': forecast})


# @app.route('/api/forecast', methods=['POST'])
# def forecast():
#     data = request.get_json()
#     sales = data.get('sales', [])
    
#     # Dummy forecast result
#     forecast_result = [s + 10 for s in sales]
    
#     return jsonify({'forecast': forecast_result})


def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='retail_user',
        password='MmartRetail',
        database='SmartRetail_Insights',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/user-details', methods=['GET'])
def user_details():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT name, email, role FROM users WHERE email = %s", (session['user'],))
            user = cursor.fetchone()
        return jsonify(user)
    finally:
        connection.close()
        
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM inventory")
            rows = cursor.fetchall()
            # convert rows to dicts if needed
            data = [dict(row) for row in rows]
        return jsonify(data), 200
    finally:
        connection.close()

@app.route('/api/inventory', methods=['GET'])
def inventory():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if session.get('role').lower() not in ['developer', 'admin']:
        return jsonify({'error': 'Forbidden'}), 403

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM inventory")
            result = cursor.fetchall()
        connection.close()
        return jsonify(result)
    except Exception as e:
        print("INVENTORY FETCH ERROR:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
