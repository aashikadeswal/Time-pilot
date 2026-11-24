"""
Authentication API routes for Time Pilot.
Handles signup, login, session validation, password reset, and profile management.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
import re

try:
    from .database import db
    from .auth import (
        hash_password, verify_password,
        create_access_token, create_reset_token, decode_token,
        get_current_user
    )
except (ImportError, ValueError):
    from database import db
    from auth import (
        hash_password, verify_password,
        create_access_token, create_reset_token, decode_token,
        get_current_user
    )

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ----- Request/Response Models -----

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    institution: Optional[str] = ""
    field_of_study: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    avatar: Optional[str] = None


# ----- Helper -----

def sanitize_user(user_doc: dict) -> dict:
    """Remove sensitive fields from user document before returning."""
    if user_doc is None:
        return None
    return {
        "name": user_doc.get("name", ""),
        "email": user_doc.get("email", ""),
        "institution": user_doc.get("institution", ""),
        "field_of_study": user_doc.get("field_of_study", ""),
        "avatar": user_doc.get("avatar", ""),
        "created_at": user_doc.get("created_at", ""),
        "onboarding_completed": user_doc.get("onboarding_completed", False),
    }

def validate_email_format(email: str) -> bool:
    """Basic email format validation."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password meets minimum requirements."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, ""


# ----- Routes -----

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """Register a new user account."""
    try:
        # Validate email format
        email = request.email.strip().lower()
        if not validate_email_format(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format. Please provide a valid address like user@example.com"
            )

        # Validate password strength
        is_valid, error_msg = validate_password_strength(request.password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # Check if user already exists
        existing_user = await db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists. Please sign in instead."
            )

        # Create user document
        user_doc = {
            "name": request.name.strip(),
            "email": email,
            "password_hash": hash_password(request.password),
            "institution": request.institution.strip() if request.institution else "",
            "field_of_study": request.field_of_study.strip() if request.field_of_study else "",
            "avatar": "",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "onboarding_completed": False,
        }

        await db.users.insert_one(user_doc)

        # Create access token
        token = create_access_token(data={"sub": email})

        return AuthResponse(
            success=True,
            message="Account created successfully",
            token=token,
            user=sanitize_user(user_doc)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database or server error during signup: {str(e)}"
        )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    email = request.email.strip().lower()

    # Find user
    user_doc = await db.users.find_one({"email": email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(request.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create access token
    token = create_access_token(data={"sub": email})

    return AuthResponse(
        success=True,
        message="Login successful",
        token=token,
        user=sanitize_user(user_doc)
    )


@router.get("/me", response_model=AuthResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the current authenticated user's profile. Used for session validation."""
    user_doc = await db.users.find_one({"email": current_user["email"]})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return AuthResponse(
        success=True,
        message="Session valid",
        user=sanitize_user(user_doc)
    )


@router.post("/forgot-password", response_model=AuthResponse)
async def forgot_password(request: ForgotPasswordRequest):
    """
    Request a password reset. Generates a reset token.
    In production, this would send an email with a reset link.
    For now, it returns the reset token directly for development purposes.
    """
    email = request.email.strip().lower()
    user_doc = await db.users.find_one({"email": email})

    # Always return success to prevent email enumeration attacks
    if not user_doc:
        return AuthResponse(
            success=True,
            message="If an account with that email exists, a password reset link has been sent."
        )

    # Generate reset token
    reset_token = create_reset_token(email)

    # Store the reset token in the database for validation
    await db.password_resets.update_one(
        {"email": email},
        {"$set": {
            "email": email,
            "token": reset_token,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "used": False
        }},
        upsert=True
    )

    # In production: send email with reset link containing the token
    # For development: return the token directly
    return AuthResponse(
        success=True,
        message="If an account with that email exists, a password reset link has been sent.",
        token=reset_token  # Remove in production — only for dev/testing
    )


@router.post("/reset-password", response_model=AuthResponse)
async def reset_password(request: ResetPasswordRequest):
    """Reset password using a valid reset token."""
    # Validate password strength
    is_valid, error_msg = validate_password_strength(request.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )

    # Decode and validate the reset token
    try:
        payload = decode_token(request.token)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    if payload.get("type") != "reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type"
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )

    # Check if the token exists and hasn't been used
    reset_record = await db.password_resets.find_one({"email": email, "token": request.token, "used": False})
    if not reset_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has already been used or is invalid"
        )

    # Update password
    new_hash = hash_password(request.new_password)
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"password_hash": new_hash}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Mark token as used
    await db.password_resets.update_one(
        {"email": email, "token": request.token},
        {"$set": {"used": True}}
    )

    # Create new access token so user is logged in after reset
    token = create_access_token(data={"sub": email})

    user_doc = await db.users.find_one({"email": email})

    return AuthResponse(
        success=True,
        message="Password reset successfully",
        token=token,
        user=sanitize_user(user_doc)
    )


@router.put("/profile", response_model=AuthResponse)
async def update_profile(request: UpdateProfileRequest, current_user: dict = Depends(get_current_user)):
    """Update the current user's profile."""
    update_fields = {}
    if request.name is not None:
        update_fields["name"] = request.name.strip()
    if request.institution is not None:
        update_fields["institution"] = request.institution.strip()
    if request.field_of_study is not None:
        update_fields["field_of_study"] = request.field_of_study.strip()
    if request.avatar is not None:
        update_fields["avatar"] = request.avatar.strip()

    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )

    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": update_fields}
    )

    user_doc = await db.users.find_one({"email": current_user["email"]})

    return AuthResponse(
        success=True,
        message="Profile updated successfully",
        user=sanitize_user(user_doc)
    )


@router.post("/change-password", response_model=AuthResponse)
async def change_password(request: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    """Change password for authenticated user."""
    # Validate new password strength
    is_valid, error_msg = validate_password_strength(request.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )

    # Get current user document
    user_doc = await db.users.find_one({"email": current_user["email"]})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Verify current password
    if not verify_password(request.current_password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    # Update password
    new_hash = hash_password(request.new_password)
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"password_hash": new_hash}}
    )

    return AuthResponse(
        success=True,
        message="Password changed successfully"
    )


@router.post("/complete-onboarding", response_model=AuthResponse)
async def complete_onboarding(current_user: dict = Depends(get_current_user)):
    """Mark onboarding as completed for the current user."""
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"onboarding_completed": True}}
    )

    user_doc = await db.users.find_one({"email": current_user["email"]})

    return AuthResponse(
        success=True,
        message="Onboarding completed",
        user=sanitize_user(user_doc)
    )


@router.post("/logout", response_model=AuthResponse)
async def logout():
    """
    Logout endpoint. JWT tokens are stateless, so this is mainly
    for the frontend to clear its stored token. In a production app,
    you might add the token to a blacklist.
    """
    return AuthResponse(
        success=True,
        message="Logged out successfully"
    )
