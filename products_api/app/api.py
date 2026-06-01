from flask import Blueprint, request, jsonify, g

from app.extensions import db
from app.models import Product
from app.auth import require_oauth

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/products", methods=["GET"])
@require_oauth
def list_products():
    items = Product.query.filter_by(user_id=g.current_user.id).all()
    return jsonify([p.to_dict() for p in items])


@api_bp.route("/products", methods=["POST"])
@require_oauth
def create_product():
    data = request.get_json() or {}
    for field in ("name", "price"):
        if field not in data:
            return jsonify({"error": f"missing field: {field}"}), 400

    p = Product(
        user_id=g.current_user.id,
        name=data["name"],
        price=float(data["price"]),
        stock=int(data.get("stock", 0)),
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201


@api_bp.route("/products/<int:pid>", methods=["GET"])
@require_oauth
def get_product(pid):
    p = Product.query.filter_by(id=pid, user_id=g.current_user.id).first_or_404()
    return jsonify(p.to_dict())


@api_bp.route("/products/<int:pid>", methods=["DELETE"])
@require_oauth
def delete_product(pid):
    p = Product.query.filter_by(id=pid, user_id=g.current_user.id).first_or_404()
    db.session.delete(p)
    db.session.commit()
    return "", 204


@api_bp.route("/me", methods=["GET"])
@require_oauth
def whoami():
    return jsonify({
        "id":    g.current_user.id,
        "email": g.current_user.email,
        "sub":   g.current_user.google_sub,
    })
