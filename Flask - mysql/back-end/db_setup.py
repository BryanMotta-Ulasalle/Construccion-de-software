# db_setup.py
from app import create_app
from models import User, db, Task
import random

app = create_app()

def create_sample_tasks():
    """Create 20 dynamic sample tasks with user_id."""

    for i in range(1, 21):
        name = f"Mi tarea {i}"
        content = f"Descripción de la tarea {i}"
        user_id = random.randint(1, 5)  

        existing_task = Task.query.filter_by(
            name=name,
            user_id=user_id
        ).first()

        if not existing_task:
            task = Task(
                name=name,
                content=content,
                user_id=user_id,
                done=random.choice([True, False])
            )
            db.session.add(task)

    db.session.commit()
    print("✅ 20 tasks creadas correctamente.")
with app.app_context():
    db.create_all()
    print("✅ Database tables created (or already exist).")
    create_sample_tasks()
