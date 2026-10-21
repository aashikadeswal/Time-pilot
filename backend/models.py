from pydantic import BaseModel, Field
from typing import Optional, List, Union

class GoalModel(BaseModel):
    id: str
    name: str
    category: str
    priority: str = "High"
    progress: Optional[int] = 0
    due: Optional[str] = "Ongoing"
    status: Optional[str] = "active"
    focusLoggedMinutes: Optional[int] = 0
    streakDays: Optional[int] = 0
    targetHoursPerWeek: Optional[Union[float, int]] = 10
    icon: Optional[str] = "flag"

class TaskModel(BaseModel):
    id: str
    name: str
    priority: str = "Med"
    duration: int = 30
    category: Optional[str] = "Studies"
    completed: bool = False
    scheduledDate: Optional[str] = "today"
    scheduledTime: Optional[str] = None
    missed: Optional[bool] = False
    actualMinutesSpent: Optional[int] = 0
    goalId: Optional[str] = None
    notes: Optional[str] = ""

class CommitmentModel(BaseModel):
    id: str
    time: str
    name: str
    type: str = "Fixed"
    duration: str = "1h"
    endTime: Optional[str] = None
    durationMins: Optional[int] = None
    location: Optional[str] = ""
    color: Optional[str] = "bg-surface-variant"
    line: Optional[str] = "bg-outline"
    ring: Optional[str] = ""
    opacity: Optional[str] = ""
    icon: Optional[str] = "schedule"

class FocusSessionModel(BaseModel):
    id: str
    category: str
    secondsLogged: int
    completed: bool = True
    sentiment: Optional[str] = "Focused"
    timestamp: Optional[str] = "Just now"
    goalId: Optional[str] = None
    distractionReason: Optional[str] = None

class ChatMessageModel(BaseModel):
    id: str
    sender: str  # 'user' or 'coach'
    text: str

class SettingsModel(BaseModel):
    notifications: bool = True
    autoSchedule: bool = False
    dailyDigest: bool = True
    bufferMinutes: Optional[int] = 15
    showCompleted: Optional[bool] = True
    energyProfile: Optional[str] = "morning"
    dailyStudyGoalHours: Optional[Union[float, int]] = 4

