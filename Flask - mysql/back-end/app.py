# app.py
from flask import Flask, request, jsonify
from models import db, Task, User
import config
from flask_cors import CORS
from datetime import datetime
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Load configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = config.SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config["SECRET_KEY"] = config.SECRET_KEY

    # Initialize database with app context
    db.init_app(app)

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    # ---------- Health & Root ----------
    @app.route("/")
    def root():
        return jsonify({"message": "Task Manager API (Flask + PostgreSQL + SQLAlchemy)"}), 200

    @app.route("/healths")
    def health():
        # Lightweight health check
        return jsonify({"status": "ok"}), 200

    # ---------- CRUD: Tasks ----------
    @app.route("/tasks", methods=["GET"])
    def list_tasks():
        """List all tasks with pagination and optional search."""
        try:
            page = request.args.get("page", 1, type=int)
            limit = request.args.get("limit", 5, type=int)
            query = request.args.get("query", "").strip()
            

            if page < 1:
                page = 1
            if limit < 1 or limit > 100:
                limit = 5
            
            task_query = Task.query.filter(Task.deleted_at.is_(None))
            if query:
                
                task_query = task_query.filter(
                    db.or_(
                        Task.name.ilike(f"%{query}%"),
                        Task.content.ilike(f"%{query}%")
                    )
                )
            
            
            paginated = task_query.order_by(Task.created_at.desc()).paginate(
                page=page, per_page=limit, error_out=False
            )
            
            return jsonify({
                "data": [t.to_dict() for t in paginated.items],
                "total": paginated.total,
                "pages": paginated.pages,
                "current_page": page,
                "per_page": limit,
                "has_next": paginated.has_next,
                "has_prev": paginated.has_prev,
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @app.route("/tasks/<int:task_id>", methods=["GET"])
    def get_task(task_id):
        """Get a single task by id."""
        task = Task.query.filter(Task.id == task_id, Task.deleted_at.is_(None)).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        return jsonify(task.to_dict()), 200

    @app.route("/tasks", methods=["POST"])
    def create_task():
        """Create a new task."""
        payload = request.get_json(silent=True) or {}
        name = payload.get("name", "").strip()
        content = payload.get("content", "").strip()
        user_id = payload.get("user_id")

        if not name:
            return jsonify({"error": "Field 'name' is required and cannot be empty."}), 400
        if not content:
            return jsonify({"error": "Field 'content' is required and cannot be empty."}), 400
        if user_id is None:
            return jsonify({"error": "Field 'user_id' is required."}), 400

        # Validate user exists and is active
        user = User.query.filter(User.id == user_id, User.deleted_at.is_(None)).first()
        if not user:
            return jsonify({"error": "User not found or inactive."}), 400

        task = Task(name=name, content=content, done=bool(payload.get("done", False)), user_id=user_id)
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201

    @app.route("/tasks/<int:task_id>", methods=["PUT"])
    def update_task(task_id):
        """Update name/content/done/user_id for an existing task."""
        task = Task.query.filter(Task.id == task_id, Task.deleted_at.is_(None)).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        payload = request.get_json(silent=True) or {}

        # Only update provided fields
        if "name" in payload:
            new_name = str(payload["name"]).strip()
            if not new_name:
                return jsonify({"error": "Field 'name' cannot be empty."}), 400
            task.name = new_name

        if "content" in payload:
            new_content = str(payload["content"]).strip()
            if not new_content:
                return jsonify({"error": "Field 'content' cannot be empty."}), 400
            task.content = new_content

        if "done" in payload:
            task.done = bool(payload["done"])

        if "user_id" in payload:
            new_user_id = payload["user_id"]
            if new_user_id is not None:
                # Validate new user exists and is active
                user = User.query.filter(User.id == new_user_id, User.deleted_at.is_(None)).first()
                if not user:
                    return jsonify({"error": "User not found or inactive."}), 400
                task.user_id = new_user_id

        db.session.commit()
        return jsonify(task.to_dict()), 200

    @app.route("/tasks/<int:task_id>", methods=["DELETE"])
    def delete_task(task_id):
        """Soft delete a task by id."""
        task = Task.query.filter(Task.id == task_id, Task.deleted_at.is_(None)).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        task.deleted_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200

    @app.route("/tasks/deleted", methods=["GET"])
    def list_deleted_tasks():
        """List all soft deleted tasks."""
        try:
            page = request.args.get("page", 1, type=int)
            limit = request.args.get("limit", 5, type=int)
            
            
            if page < 1:
                page = 1
            if limit < 1 or limit > 100:
                limit = 5
            
            
            paginated = Task.query.filter(Task.deleted_at.isnot(None)).order_by(Task.deleted_at.desc()).paginate(
                page=page, per_page=limit, error_out=False
            )
            
            return jsonify({
                "data": [t.to_dict() for t in paginated.items],
                "total": paginated.total,
                "pages": paginated.pages,
                "current_page": page,
                "per_page": limit,
                "has_next": paginated.has_next,
                "has_prev": paginated.has_prev,
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # ---------- Convenience Filters ----------
    @app.route("/tasks/done", methods=["GET"])
    def list_done():
        count = Task.query.filter_by(done=True, deleted_at=None).count()
        return jsonify({"count": count}), 200

    @app.route("/tasks/pending", methods=["GET"])
    def list_pending():
        count = Task.query.filter_by(done=False, deleted_at=None).count()
        return jsonify({"count": count}), 200

    # ---------- CRUD: Users ----------
    @app.route("/users", methods=["GET"])
    def list_users():
        """List all active users with pagination."""
        try:
            page = request.args.get("page", 1, type=int)
            limit = request.args.get("limit", 5, type=int)
            
            # Validate pagination parameters
            if page < 1:
                page = 1
            if limit < 1 or limit > 100:
                limit = 5
            
            # Paginate active users ordered by creation date
            paginated = User.query.filter(User.deleted_at.is_(None)).order_by(User.created_at.desc()).paginate(
                page=page, per_page=limit, error_out=False
            )
            
            return jsonify({
                "data": [u.to_dict() for u in paginated.items],
                "total": paginated.total,
                "pages": paginated.pages,
                "current_page": page,
                "per_page": limit,
                "has_next": paginated.has_next,
                "has_prev": paginated.has_prev,
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @app.route("/users/<int:user_id>", methods=["GET"])
    def get_user(user_id):
        """Get a single active user by id."""
        user = User.query.filter(User.id == user_id, User.deleted_at.is_(None)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200

    @app.route("/users", methods=["POST"])
    def create_user():
        """Create a new user."""
        payload = request.get_json(silent=True) or {}
        name = payload.get("name", "").strip()
        email = payload.get("email", "").strip()

        if not name:
            return jsonify({"error": "Field 'name' is required and cannot be empty."}), 400
        if not email:
            return jsonify({"error": "Field 'email' is required and cannot be empty."}), 400

        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already exists."}), 400

        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201

    @app.route("/users/<int:user_id>", methods=["PUT"])
    def update_user(user_id):
        """Update name/email for an existing user."""
        user = User.query.filter(User.id == user_id, User.deleted_at.is_(None)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        payload = request.get_json(silent=True) or {}

        # Only update provided fields
        if "name" in payload:
            new_name = str(payload["name"]).strip()
            if new_name:
                user.name = new_name

        if "email" in payload:
            new_email = str(payload["email"]).strip()
            if new_email:
                # Check if email is already taken by another user
                existing_user = User.query.filter(User.email == new_email, User.id != user_id).first()
                if existing_user:
                    return jsonify({"error": "Email already exists."}), 400
                user.email = new_email

        db.session.commit()
        return jsonify(user.to_dict()), 200

    @app.route("/users/<int:user_id>", methods=["DELETE"])
    def delete_user(user_id):
        """Soft delete a user by id."""
        user = User.query.filter(User.id == user_id, User.deleted_at.is_(None)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if user has active tasks
        active_tasks = Task.query.filter(Task.user_id == user_id, Task.deleted_at.is_(None)).count()
        if active_tasks > 0:
            return jsonify({"error": f"Cannot delete user with {active_tasks} active tasks. Delete or reassign tasks first."}), 400
        
        user.deleted_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200

    @app.route("/users/<int:user_id>/tasks", methods=["GET"])
    def get_user_tasks(user_id):
        """Get all active tasks for a specific user."""
        user = User.query.filter(User.id == user_id, User.deleted_at.is_(None)).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        try:
            page = request.args.get("page", 1, type=int)
            limit = request.args.get("limit", 5, type=int)
            query = request.args.get("query", "").strip()
            
            # Validate pagination parameters
            if page < 1:
                page = 1
            if limit < 1 or limit > 100:
                limit = 5
            
            # Build query for user's active tasks
            task_query = Task.query.filter(Task.user_id == user_id, Task.deleted_at.is_(None))
            if query:
                task_query = task_query.filter(
                    db.or_(
                        Task.name.ilike(f"%{query}%"),
                        Task.content.ilike(f"%{query}%")
                    )
                )
            
            # Paginate tasks ordered by creation date
            paginated = task_query.order_by(Task.created_at.desc()).paginate(
                page=page, per_page=limit, error_out=False
            )
            
            return jsonify({
                "data": [t.to_dict() for t in paginated.items],
                "total": paginated.total,
                "pages": paginated.pages,
                "current_page": page,
                "per_page": limit,
                "has_next": paginated.has_next,
                "has_prev": paginated.has_prev,
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    return app

# Dev entrypoint
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
