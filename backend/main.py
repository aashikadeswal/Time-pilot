from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import time

from .database import db
from .models import TaskModel, CommitmentModel, FocusSessionModel, ChatMessageModel, SettingsModel

app = FastAPI(title="Time Pilot Backend API")

# Enable CORS for local cross-origin request testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Seed Mock Data Helpers -----------------
async def seed_if_empty():
    # Check settings
    settings_count = await db.settings.count_documents({})
    if settings_count == 0:
        await db.settings.insert_one({
            "notifications": True,
            "autoSchedule": False,
            "dailyDigest": True
        })

    # Check tasks
    tasks_count = await db.tasks.count_documents({})
    if tasks_count == 0:
        await db.tasks.insert_many([
            {"id": "1", "name": "Draft thesis methodology section", "priority": "High", "duration": 90, "category": "Thesis", "completed": False},
            {"id": "2", "name": "Review chapter 4 literature notes", "priority": "Med", "duration": 45, "category": "Thesis", "completed": False},
            {"id": "3", "name": "Email advisor regarding meeting times", "priority": "Low", "duration": 15, "category": "Admin", "completed": True}
        ])

    # Check commitments
    commitments_count = await db.commitments.count_documents({})
    if commitments_count == 0:
        await db.commitments.insert_many([
            {"id": "1", "time": "09:00", "name": "College", "type": "Fixed", "duration": "6h", "color": "bg-surface-variant", "line": "bg-outline", "ring": "", "opacity": ""},
            {"id": "2", "time": "15:00", "name": "Travel", "type": "Fixed", "duration": "1h", "color": "bg-surface-variant", "line": "bg-outline", "ring": "", "opacity": ""},
            {"id": "3", "time": "16:00", "name": "Flexible", "type": "Flexible", "duration": "1h", "color": "bg-primary", "line": "bg-primary/50", "ring": "", "opacity": ""},
            {"id": "4", "time": "17:00", "name": "Study", "type": "Planned", "duration": "1h", "color": "bg-surface", "ring": "ring-4 ring-primary", "line": "bg-primary", "opacity": ""},
            {"id": "5", "time": "18:00", "name": "Flexible", "type": "Flexible", "duration": "1h 15m", "color": "bg-primary", "line": "bg-primary/50", "ring": "", "opacity": ""},
            {"id": "6", "time": "20:00", "name": "Dinner & Wind Down", "type": "Rest", "duration": "3h", "color": "bg-secondary-container", "line": "bg-secondary-container", "ring": "", "opacity": ""},
            {"id": "7", "time": "23:00", "name": "Sleep", "type": "Rest", "duration": "8h", "color": "bg-secondary-container", "line": "bg-secondary-container", "ring": "", "opacity": "opacity-70"}
        ])

    # Check focus history
    focus_count = await db.focus_history.count_documents({})
    if focus_count == 0:
        await db.focus_history.insert_many([
            {"id": "1", "category": "Mathematics", "secondsLogged": 2520, "completed": True, "sentiment": "Okay", "timestamp": "Just now"},
            {"id": "2", "category": "Political Science", "secondsLogged": 1800, "completed": True, "sentiment": "Easy", "timestamp": "2 hrs ago"},
            {"id": "3", "category": "Reading", "secondsLogged": 1080, "completed": False, "sentiment": "Difficult", "timestamp": "10:00 AM"}
        ])

    # Check AI Coach Chat Messages
    chat_count = await db.chat_history.count_documents({})
    if chat_count == 0:
        await db.chat_history.insert_one({
            "id": "1",
            "sender": "coach",
            "text": "Hello Sam! I'm your Time Pilot Coach. I can help you analyze your schedule, manage capacity, or jump into a focus session. What's on your mind today?"
        })

@app.on_event("startup")
async def startup_event():
    # Run auto seed
    await seed_if_empty()


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
async def get_tasks():
    cursor = db.tasks.find({}, {"_id": 0})
    tasks = await cursor.to_list(length=100)
    return [TaskModel(**t) for t in tasks]

@app.post("/api/tasks", response_model=TaskModel)
async def create_task(task: TaskModel):
    # Check if task already exists to prevent duplicate id conflicts
    existing = await db.tasks.find_one({"id": task.id})
    if existing:
        await db.tasks.update_one({"id": task.id}, {"$set": task.dict()})
    else:
        await db.tasks.insert_one(task.dict())
    return task

@app.put("/api/tasks/{task_id}", response_model=TaskModel)
async def update_task(task_id: str, updated_task: TaskModel):
    result = await db.tasks.update_one({"id": task_id}, {"$set": updated_task.dict()})
    if result.matched_count == 0:
        # If not found, insert
        await db.tasks.insert_one(updated_task.dict())
    return updated_task

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    result = await db.tasks.delete_one({"id": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}


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
