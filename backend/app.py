from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

CORS(app, supports_credentials=True)

users_db = {}

model = joblib.load('D:/projects/Final Project/SmartRetail Insights/backend/models/sales_forecast_model.pkl')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    if email in users_db:
        return jsonify({'error': 'User already exists'}), 400
    hashed = generate_password_hash(password)
    users_db[email] = hashed
    session['user'] = email
    return jsonify({'message': 'Registered successfully'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = users_db.get(email)
    if not user or not check_password_hash(user, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    session['user'] = email
    return jsonify({'message': 'Logged in successfully'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'user' in session:
        return jsonify({'authenticated': True})
    return jsonify({'authenticated': False}), 401

# Existing static forecast GET endpoint (unchanged)
@app.route('/api/forecast', methods=['GET'])
def forecast():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    input_data = pd.DataFrame([{
        'Store': 1, 'DayOfWeek': 1, 'Date': '2025-06-01', 'Sales': 0, 'Customers': 0,
        'Open': 1, 'Promo': 1, 'StateHoliday': 0, 'SchoolHoliday': 0,
        'CompetitionDistance': 200.0, 'CompetitionOpenSinceMonth': 9,
        'CompetitionOpenSinceYear': 2010, 'Promo2': 1, 'Promo2SinceWeek': 13,
        'Promo2SinceYear': 2015, 'Year': 2025, 'Month': 6, 'Day': 1, 'WeekOfYear': 22,
        'IsWeekend': 0, 'StoreType_a': 1, 'StoreType_b': 0, 'StoreType_c': 0,
        'StoreType_d': 0, 'Assortment_a': 0, 'Assortment_b': 1, 'Assortment_c': 0,
        'PromoInterval_Feb,May,Aug,Nov': 0, 'PromoInterval_Jan,Apr,Jul,Oct': 1,
        'PromoInterval_Mar,Jun,Sept,Dec': 0, 'PromoInterval_None': 0
    }])
    prediction = model.predict(input_data)[0]
    return jsonify({
        'category': 'Electronics',
        'region': 'North',
        'next_7_days_sales': [int(prediction + i * 5) for i in range(7)]
    })

# New POST forecast endpoint to accept dynamic input JSON
@app.route('/api/forecast', methods=['POST'])
def forecast_dynamic():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    # Convert JSON input to DataFrame with 1 row (assuming correct keys are sent)
    try:
        input_df = pd.DataFrame([data])
    except Exception as e:
        return jsonify({'error': f'Invalid input format: {str(e)}'}), 400

    try:
        prediction = model.predict(input_df)[0]
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    # Return the predicted sales for next 7 days (mock trend)
    result = {
        'category': 'Electronics',
        'region': 'North',
        'next_7_days_sales': [int(prediction + i * 5) for i in range(7)]
    }

    return jsonify(result)

@app.route('/api/inventory', methods=['GET'])
def inventory():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify([
        {'item': 'TV', 'stock': 5, 'alert': True},
        {'item': 'Laptop', 'stock': 20, 'alert': False}
    ])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
