from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    new_user = User(email=data['email'], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    return jsonify({'authenticated': 'user_id' in session}), 200

@app.route('/api/forecast', methods=['GET'])
def forecast():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    # Dummy data
    return jsonify({
        'category': 'Electronics',
        'region': 'West',
        'next_7_days_sales': [120, 130, 110, 145, 150, 140, 160]
    })

@app.route('/api/inventory', methods=['GET'])
def inventory():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    # Dummy data
    return jsonify([
        {'item': 'TV', 'stock': 10, 'alert': True},
        {'item': 'Headphones', 'stock': 50, 'alert': False},
        {'item': 'Laptop', 'stock': 5, 'alert': True}
    ])

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
