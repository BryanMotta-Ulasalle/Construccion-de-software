import os
import secrets
from urllib.parse import urlencode

import requests
from dotenv import load_dotenv
from flask import Flask, redirect, request, session, render_template, url_for

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ["FLASK_SECRET_KEY"]
app.config["SESSION_COOKIE_NAME"] = "client_app_session"

CLIENT_ID     = os.environ["CLIENT_ID"]
CLIENT_SECRET = os.environ["CLIENT_SECRET"]
AUTH_URL      = os.environ["AUTH_SERVER_URL"]
RES_URL       = os.environ["RESOURCE_SERVER_URL"]
REDIRECT_URI  = os.environ["REDIRECT_URI"]
SCOPE         = "read write"


@app.route("/")
def index():
    return render_template("index.html",
                           logged_in="access_token" in session)


@app.route("/login")
def login():
    state = secrets.token_urlsafe(16)
    session["oauth_state"] = state

    params = {
        "response_type": "code",
        "client_id":     CLIENT_ID,
        "redirect_uri":  REDIRECT_URI,
        "scope":         SCOPE,
        "state":         state,
    }
    return redirect(f"{AUTH_URL}/oauth/authorize?{urlencode(params)}")


@app.route("/oauth/callback")
def callback():
    if request.args.get("state") != session.pop("oauth_state", None):
        return "Invalid state (CSRF)", 400
    if "error" in request.args:
        return f"OAuth error: {request.args['error']}", 400

    # Back-channel exchange
    token_resp = requests.post(f"{AUTH_URL}/oauth/token", data={
        "grant_type":    "authorization_code",
        "code":          request.args["code"],
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri":  REDIRECT_URI,
    }, timeout=10)
    token_resp.raise_for_status()
    tokens = token_resp.json()

    session["access_token"] = tokens["access_token"]
    return redirect(url_for("dashboard"))


def _api(method, path, **kwargs):
    headers = {"Authorization": f"Bearer {session['access_token']}"}
    return requests.request(method, f"{RES_URL}{path}",
                            headers=headers, timeout=5, **kwargs)


@app.route("/dashboard")
def dashboard():
    if "access_token" not in session:
        return redirect(url_for("login"))

    me    = _api("GET", "/api/me").json()
    notes = _api("GET", "/api/notes").json()
    return render_template("dashboard.html", me=me, notes=notes)


@app.route("/notes", methods=["POST"])
def create_note():
    if "access_token" not in session:
        return redirect(url_for("login"))

    _api("POST", "/api/notes", json={
        "title": request.form["title"],
        "body":  request.form.get("body", ""),
    })
    return redirect(url_for("dashboard"))


@app.route("/notes/<int:nid>/delete", methods=["POST"])
def delete_note(nid):
    if "access_token" not in session:
        return redirect(url_for("login"))
    _api("DELETE", f"/api/notes/{nid}")
    return redirect(url_for("dashboard"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
