import os
from dotenv import load_dotenv
from flask import Flask, jsonify

from app.extensions import db
from app.api import api_bp

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.secret_key = os.environ["FLASK_SECRET_KEY"]
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URI"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return jsonify({
            "name": "Products API",
            "auth": "OAuth 2.0 Bearer token (Google)",
            "endpoints": [
                "GET  /api/me",
                "GET  /api/products",
                "POST /api/products",
                "GET  /api/products/<id>",
                "DELETE /api/products/<id>",
            ],
        })

    return app
