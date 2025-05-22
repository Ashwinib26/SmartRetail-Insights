from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests (for React frontend)

# Dummy route for health check
@app.route('/')
def home():
    return jsonify({'message': 'Retail Analytics API is running!'})

# Dummy sales forecast endpoint
@app.route('/api/forecast', methods=['GET'])
def forecast_sales():
    # Simulated response
    dummy_forecast = {
        "category": "Electronics",
        "region": "North",
        "next_7_days_sales": [120, 135, 140, 150, 160, 170, 165]
    }
    return jsonify(dummy_forecast)

# Dummy inventory status endpoint
@app.route('/api/inventory', methods=['GET'])
def inventory_status():
    dummy_inventory = [
        {"item": "Laptop", "stock": 20, "alert": False},
        {"item": "Smartphone", "stock": 5, "alert": True},
        {"item": "TV", "stock": 12, "alert": False}
    ]
    return jsonify(dummy_inventory)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
