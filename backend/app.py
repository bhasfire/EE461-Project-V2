from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.project_routes import project_bp

app = Flask(__name__)
CORS(app)


app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(project_bp, url_prefix='/project')


@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True, port=8001)
