from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Enable CORS with credentials support
CORS(app, supports_credentials=True)

# Dummy in-memory database
users_db = {}

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

@app.route('/api/forecast', methods=['GET'])
def forecast():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({
        'category': 'Electronics',
        'region': 'North',
        'next_7_days_sales': [200, 180, 210, 190, 205, 230, 220]
    })

@app.route('/api/inventory', methods=['GET'])
def inventory():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify([
        {'item': 'TV', 'stock': 5, 'alert': True},
        {'item': 'Laptop', 'stock': 20, 'alert': False}
    ])

# @app.route('/api/forecast')
# def forecast():
#     model = joblib.load("models/sales_forecast_model.pkl")
#     X_future = pd.DataFrame([...])  # Based on future date, store, promo info
#     y_pred = model.predict(X_future)

#     return jsonify({'predicted_sales': y_pred.tolist()})


if __name__ == '__main__':
    app.run(debug=True)
