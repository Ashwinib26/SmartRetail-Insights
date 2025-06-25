from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import pandas as pd
import pymysql

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app, supports_credentials=True)

users_db = {}
model = joblib.load('D:/projects/Final Project/SmartRetail Insights/backend/models/sales_forecast_model.pkl')

def make_prediction(input_dict):
    try:
        df = pd.DataFrame([input_dict])
        expected_features = model.feature_name_

        # Fill missing features with 0 if not provided
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0

        df = df[expected_features]  # Match order
        print("Final input to model:", df.columns.tolist())
        prediction = model.predict(df)[0]
        return prediction
    except Exception as e:
        print("MODEL PREDICTION ERROR:", str(e))
        raise

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email, password = data.get('email'), data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    if email in users_db:
        return jsonify({'error': 'User already exists'}), 400
    users_db[email] = generate_password_hash(password)
    session['user'] = email
    return jsonify({'message': 'Registered successfully'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email, password = data.get('email'), data.get('password')
    user = users_db.get(email)
    if not user or not check_password_hash(user, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    session['user'] = email
    return jsonify({'message': 'Logged in successfully'}), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    return jsonify({'authenticated': 'user' in session})

@app.route('/api/forecast', methods=['GET'])
def forecast():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
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
        return jsonify({
            'category': 'Grocery',
            'region': 'North',
            'next_7_days_sales': [123, 123, 123, 123, 123, 123, 123]  # <-- suspicious
        })
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/forecast', methods=['POST'])
def forecast_dynamic():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    try:
        prediction = make_prediction(data)
        return jsonify({
            'category': 'Electronics',
            'region': 'North',
            'next_7_days_sales': [int(prediction + i * 5) for i in range(7)]
        })
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='retail_user',
        password='MmartRetail',
        database='SmartRetail_Insights',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/inventory', methods=['GET'])
def inventory():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM inventory")
            result = cursor.fetchall()
        connection.close()
        print("Fetched inventory:", result)  # ✅ Add this
        return jsonify(result)
    except Exception as e:
        print("INVENTORY FETCH ERROR:", str(e))  # ✅ Log the real reason
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
