from datetime import datetime
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id         = db.Column(db.Integer, primary_key=True)
    google_sub = db.Column(db.String(64), unique=True, nullable=False)
    email      = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship("Product", backref="owner",
                               cascade="all, delete-orphan")


class Product(db.Model):
    __tablename__ = "products"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name       = db.Column(db.String(200), nullable=False)
    price      = db.Column(db.Float, nullable=False)
    stock      = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":    self.id,
            "name":  self.name,
            "price": self.price,
            "stock": self.stock,
        }
