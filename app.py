from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/mininews"
app.config["SECRET_KEY"] = "supersecretkey"

mongo = PyMongo(app)
bcrypt = Bcrypt(app)

@app.route("/")
def home():
    return send_from_directory("public", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("public", path)

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "User Registered Successfully"})

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = mongo.db.users.find_one({"email": email})

    if not user:
        return jsonify({"message": "Invalid Email"}), 400

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid Password"}), 400

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({"message": "Login Successful", "token": token})

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"message": "No text provided"}), 400

    if "profit" in text.lower():
        result = "Positive News 📈 Net worth may increase"
    elif "loss" in text.lower():
        result = "Negative News 📉 Net worth may decrease"
    else:
        result = "Neutral News 🤝 No major impact"

    return jsonify({"message": result})

if __name__ == "__main__":
    app.run(port=5000, debug=True)