from fastapi import FastAPI, Depend: HTTPException, Body, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import List, Optional
import time

try:
    from .database import db
    from .models import GoalModel, TaskModel, CommitmentModel, FocusSessionModel, ChatMessageModel, SettingsModel
    from .auth_routes import router as auth_router
    from .auth import get_current_user, get_current_user_optional
except (ImportError, ValueError):
    from database import db
    from models import GoalModel, TaskModel, CommitmentModel, FocusSessionModel, ChatMessageModel, SettingsModel
    from auth_routes import router as auth_router
    from auth import get_current_user, get_current_user_optional

app = FastAPI(title="Time Pilot Backend API")

# Enable CORS for local cross-origin request testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handlers guaranteeing every error returns a valid application/json body
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]["msg"] if errors else "Invalid request data"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": first_error, "errors": errors, "success": False},
        media_type="application/json",
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "success": False},
        headers=getattr(exc, "headers", None),
        media_type="application/json",
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal server error: {str(exc)}", "success": False},
        media_type="application/json",
    )

# Register authentication routes
app.include_router(auth_router)

# ----------------- Seed Mock Data Helpers -----------------
async def seed_if_empty():
    # Only seed global defaults if completely empty (never seed tasks or goals into user space)
    settings_count = await db.settings.count_documents({})
    if settings_count == 0:
        await db.settings.insert_one({
            "notifications": True,
            "autoSchedule": False,
            "dailyDigest": True
        })

@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Time Pilot API"}

@app.on_event("startup")
async def startup_event():
    # Run auto seed safely without crashing server if DB is unreachable
    try:
        await seed_if_empty()
        print("Database connection verified and initialized.")
    except Exception as e:
        print(f"Notice: Could not seed database on startup ({e}). App is online.")


# ----------------- Settings Endpoint -----------------
@app.get("/api/settings", response_model=SettingsModel)
async def get_settings():
    settings_doc = await db.settings.find_one({}, {"_id": 0})
    if not settings_doc:
        # Fallback default
        return SettingsModel(notifications=True, autoSchedule=False, dailyDigest=True)
    return SettingsModel(**settings_doc)

@app.put("/api/settings", response_model=SettingsModel)
async def update_settings(updated: SettingsModel):
    # Upsert single settings document
    await db.settings.update_one({}, {"$set": updated.dict()}, upsert=True)
    return updated


# ----------------- Tasks Endpoints -----------------
@app.get("/api/tasks", response_model=List[TaskModel])
async def get_tasks(current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    cursor = db.tasks.find({"user_email": user_email}, {"_id": 0})
    tasks = await cursor.to_list(length=200)
    return [TaskModel(**t) for t in tasks]

@app.post("/api/tasks", response_model=TaskModel)
async def create_task(task: TaskModel, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    task_dict = task.model_dump() if hasattr(task, 'model_dump') else task.dict()
    task_dict["user_email"] = user_email
    await db.tasks.update_one(
        {"id": task.id, "user_email": user_email},
        {"$set": task_dict},
        upsert=True
    )
    return TaskModel(**task_dict)

@app.put("/api/tasks/{task_id}", response_model=TaskModel)
async def update_task(task_id: str, updated_task: TaskModel, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    task_dict = updated_task.model_dump() if hasattr(updated_task, 'model_dump') else updated_task.dict()
    task_dict["user_email"] = user_email
    await db.tasks.update_one(
        {"id": task_id, "user_email": user_email},
        {"$set": task_dict},
        upsert=True
    )
    return TaskModel(**task_dict)

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    result = await db.tasks.delete_one({"id": task_id, "user_email": user_email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully", "success": True}


# ----------------- Commitments Endpoints -----------------
@app.get("/api/commitments", response_model=List[CommitmentModel])
async def get_commitments():
    cursor = db.commitments.find({}, {"_id": 0})
    commitments = await cursor.to_list(length=100)
    # Sort commitments chronologically by time
    commitments.sort(key=lambda x: x.get("time", "00:00"))
    return [CommitmentModel(**c) for c in commitments]

@app.post("/api/commitments", response_model=CommitmentModel)
async def create_commitment(commitment: CommitmentModel):
    await db.commitments.update_one({"id": commitment.id}, {"$set": commitment.dict()}, upsert=True)
    return commitment

@app.delete("/api/commitments/{commitment_id}")
async def delete_commitment(commitment_id: str):
    result = await db.commitments.delete_one({"id": commitment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Commitment not found")
    return {"message": "Commitment deleted successfully"}


# ----------------- Focus History Endpoints -----------------
@app.get("/api/focus/history", response_model=List[FocusSessionModel])
async def get_focus_history():
    cursor = db.focus_history.find({}, {"_id": 0})
    history_list = await cursor.to_list(length=100)
    # Return reversed order (newest first)
    history_list.reverse()
    return [FocusSessionModel(**h) for h in history_list]

@app.post("/api/focus/log", response_model=FocusSessionModel)
async def log_focus_session(session: FocusSessionModel):
    await db.focus_history.insert_one(session.dict())
    return session


# ----------------- AI Coach Endpoints -----------------
@app.get("/api/coach/messages", response_model=List[ChatMessageModel])
async def get_coach_messages():
    cursor = db.chat_history.find({}, {"_id": 0})
    messages = await cursor.to_list(length=100)
    return [ChatMessageModel(**m) for m in messages]

@app.post("/api/coach/message", response_model=List[ChatMessageModel])
async def send_coach_message(user_msg: ChatMessageModel):
    # Save user message
    await db.chat_history.insert_one(user_msg.dict())

    # Build reply text based on standard coach prompts
    text_lower = user_msg.text.lower()
    reply_text = "That sounds like an important task, Sam. Let's make sure we allocate a focused block for it in your daily timeline."
    
    if "should i do now" in text_lower or "what can i do" in text_lower:
        reply_text = "You have 35 minutes of flexible time right now. I recommend starting your high-priority 'Mathematics Practice' focus session."
    elif "plan my day" in text_lower:
        reply_text = "Looking at your schedule: you have classes until 15:00, followed by a Study Group at 17:00. You have two flexible blocks at 16:00 and 18:00 that we can allocate for your Thesis draft."
    elif "analyze my week" in text_lower:
        reply_text = "You've logged 6.5 hours of focus time this week. Your peak focus times were between 14:00 and 16:00. You're doing great keeping up with your goals!"
    elif "too much planned" in text_lower or "capacity" in text_lower:
        reply_text = "Your total planned tasks for today sum up to 2 hours and 5 minutes. Given your 2h 30m of flexible time, you have a 25-minute buffer. Your day is perfectly balanced!"

    coach_msg = {
        "id": str(int(time.time() * 1000)),
        "sender": "coach",
        "text": reply_text
    }
    # Save coach reply message
    await db.chat_history.insert_one(coach_msg)

    # Return full message history
    cursor = db.chat_history.find({}, {"_id": 0})
    messages = await cursor.to_list(length=100)
    return [ChatMessageModel(**m) for m in messages]


# ----------------- Goals Endpoints -----------------
@app.get("/api/goals", response_model=List[GoalModel])
async def get_goals(current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    cursor = db.goals.find({"user_email": user_email}, {"_id": 0})
    goals = await cursor.to_list(length=200)
    return [GoalModel(**g) for g in goals]

@app.post("/api/goals", response_model=GoalModel)
async def create_goal(goal: GoalModel, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    goal_dict = goal.model_dump() if hasattr(goal, 'model_dump') else goal.dict()
    goal_dict["user_email"] = user_email
    await db.goals.update_one(
        {"id": goal.id, "user_email": user_email},
        {"$set": goal_dict},
        upsert=True
    )
    return GoalModel(**goal_dict)

@app.put("/api/goals/{goal_id}", response_model=GoalModel)
async def update_goal(goal_id: str, updated_goal: GoalModel, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    goal_dict = updated_goal.model_dump() if hasattr(updated_goal, 'model_dump') else updated_goal.dict()
    goal_dict["user_email"] = user_email
    await db.goals.update_one(
        {"id": goal_id, "user_email": user_email},
        {"$set": goal_dict},
        upsert=True
    )
    return GoalModel(**goal_dict)

@app.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"].lower()
    result = await db.goals.delete_one({"id": goal_id, "user_email": user_email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted successfully", "success": True}

