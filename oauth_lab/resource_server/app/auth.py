import os
from functools import wraps

import requests
from cachetools import TTLCache
from flask import request, jsonify, g

from app.extensions import db
from app.models import User

# Cache validated tokens for 60 s — avoids hitting the Auth Server every request
_cache = TTLCache(maxsize=1000, ttl=60)


def _introspect(token):
    if token in _cache:
        return _cache[token]

    url = os.environ["AUTH_SERVER_URL"] + "/oauth/introspect"
    resp = requests.post(url, data={"token": token}, timeout=5)
    if resp.status_code != 200:
        return None
    info = resp.json()
    if not info.get("active"):
        return None

    _cache[token] = info
    return info


def require_oauth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "missing_bearer_token"}), 401

        token = auth[7:].strip()
        info  = _introspect(token)
        if info is None:
            return jsonify({"error": "invalid_or_expired_token"}), 401

        sub  = info["sub"]
        user = User.query.filter_by(sub=sub).first()
        if user is None:
            user = User(sub=sub, email=info.get("email"), name=info.get("name"))
            db.session.add(user)
            db.session.commit()

        g.current_user = user
        g.token_scope  = info.get("scope", "")
        return fn(*args, **kwargs)

    return wrapper


def require_scope(needed):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if needed not in (g.token_scope or "").split():
                return jsonify({"error": "insufficient_scope",
                                "required": needed}), 403
            return fn(*args, **kwargs)
        return wrapper
    return deco
