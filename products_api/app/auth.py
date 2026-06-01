import os
from functools import wraps

import requests
from cachetools import TTLCache
from flask import request, jsonify, g

from app.extensions import db
from app.models import User

TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"

# Cache validated tokens for 5 min to avoid calling Google on every request
_token_cache = TTLCache(maxsize=1000, ttl=300)


def _validate_with_google(access_token):
    """Ask Google whether this access token is valid and for whom."""
    if access_token in _token_cache:
        return _token_cache[access_token]

    resp = requests.get(TOKENINFO_URL,
                        params={"access_token": access_token},
                        timeout=5)
    if resp.status_code != 200:
        return None
    info = resp.json()

    # Audience check: token was issued for our client_id
    if info.get("aud") != os.environ["GOOGLE_CLIENT_ID"]:
        return None

    _token_cache[access_token] = info
    return info


def require_oauth(fn):
    """Reject any request without a valid Google access token."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "missing_bearer_token"}), 401

        token = auth.split(" ", 1)[1].strip()
        info  = _validate_with_google(token)
        if info is None:
            return jsonify({"error": "invalid_or_expired_token"}), 401

        # Upsert user record (so we can attach products to them)
        sub  = info["sub"]
        user = User.query.filter_by(google_sub=sub).first()
        if user is None:
            user = User(google_sub=sub, email=info.get("email"))
            db.session.add(user)
            db.session.commit()

        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper
