from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp

app = Flask(__name__)
CORS(app, resources={r"/auth/*": {"origins": "*"}})  # Allow all origins for routes starting with /auth

app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True, port=8001)
