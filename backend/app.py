from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import pandas as pd
import pymysql

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app, supports_credentials=True)

users_db = {}   # email -> password_hash
roles_db = {}   # email -> role

model = joblib.load('D:/projects/Final Project/SmartRetail Insights/backend/models/sales_forecast_model.pkl')

def make_prediction(input_dict):
    try:
        df = pd.DataFrame([input_dict])
        expected_features = model.feature_names_in_

        for col in expected_features:
            if col not in df.columns:
                df[col] = 0

        df = df[expected_features]
        prediction = model.predict(df)[0]
        return prediction
    except Exception as e:
        print("MODEL PREDICTION ERROR:", str(e))
        raise


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Analyst')

    if not email or not password or not role or not name:
        return jsonify({'error': 'Name, email, password, role are required'}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                return jsonify({'error': 'User already exists'}), 400

            hashed = generate_password_hash(password)
            cursor.execute(
                "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, %s)",
                (name, email, hashed, role)
            )
            connection.commit()
        connection.close()

        session['user'] = email
        session['role'] = role
        return jsonify({'message': 'Registered successfully', 'role': role}), 200

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    print('Login data received:', data)
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
        print('User fetched:', user)

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

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
            'next_7_days_sales': [123, 123, 123, 123, 123, 123, 123]
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
def inventory():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

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
