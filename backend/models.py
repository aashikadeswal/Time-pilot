from pydantic import BaseModel, Field
from typing import Optional, List

class TaskModel(BaseModel):
    id: str
    name: str
    priority: str
    duration: int
    category: str
    completed: bool

class CommitmentModel(BaseModel):
    id: str
    time: str
    name: str
    type: str
    duration: str
    color: str
    line: str
    ring: Optional[str] = ""
    opacity: Optional[str] = ""

class FocusSessionModel(BaseModel):
    id: str
    category: str
    secondsLogged: int
    completed: bool
    sentiment: str
    timestamp: str

class ChatMessageModel(BaseModel):
    id: str
    sender: str  # 'user' or 'coach'
    text: str

class SettingsModel(BaseModel):
    notifications: bool
    autoSchedule: bool
    dailyDigest: bool
