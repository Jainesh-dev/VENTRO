
import bcrypt
import jwt
import os

from datetime import datetime, timedelta
from flask import current_app

from google.oauth2 import id_token
from google.auth.transport import requests

from database.db import (
    get_all_internships,
    save_internship,
    get_saved_internships,
    delete_saved_internship,
    apply_to_internship,
    get_all_applications,
    update_application_status,
    set_application_status,
    record_internship_view,
    get_recently_viewed,
    create_User,
    create_google_User,
    get_User_by_email,
    save_user_profile,
    complete_onboarding
)


# =====================================================
# INTERNSHIPS
# =====================================================

def fetch_internships():
    return get_all_internships()


# =====================================================
# SAVED INTERNSHIPS
# =====================================================

def add_saved_internship(internship_id, user_id):
    try:
        save_internship(internship_id, user_id)

        return {
            "success": True,
            "message": "Internship saved successfully",
            "id": internship_id
        }

    except Exception as e:
        print("SAVE ERROR:", repr(e))

        return {
            "success": False,
            "message": "Unable to save internship"
        }, 500


def fetch_saved_internships(user_id):
    internships = get_saved_internships(user_id)

    return [
        {
            "id": row[0],
            "company": row[1],
            "role": row[2],
            "location": row[3],
            "type": row[4],
            "category": row[5],
            "applyLink": row[6]
        }
        for row in internships
    ]


def remove_saved_internship(internship_id, user_id):
    delete_saved_internship(internship_id, user_id)

    return {
        "success": True,
        "message": "Internship removed successfully"
    }


# =====================================================
# APPLICATIONS
# =====================================================

def add_application(internship_id, user_id):
    apply_to_internship(internship_id, user_id)

    return {
        "success": True,
        "message": "Application submitted successfully"
    }


def fetch_applications(user_id):
    applications = get_all_applications(user_id)

    return [
        {
            "id": row[0],
            "internship_id": row[1],
            "company": row[2],
            "role": row[3],
            "status": row[4],
            "applied_date": (
                row[5].isoformat() if row[5] else None
            )
        }
        for row in applications
    ]


def update_application(application_id, user_id, status):
    updated = update_application_status(
        application_id,
        user_id,
        status
    )

    if not updated:
        return {
            "success": False,
            "message": "Application not found"
        }, 404

    return {
        "success": True,
        "message": f"Application status updated to {status}"
    }


def update_internship_status(internship_id, user_id, status):
    if status not in ("Applied", "Not Applied"):
        return {
            "success": False,
            "message": "Invalid status"
        }, 400

    set_application_status(
        internship_id,
        user_id,
        status
    )

    return {
        "success": True,
        "message": f"Status updated to {status}"
    }


# =====================================================
# RECENTLY VIEWED
# =====================================================

def add_recently_viewed(internship_id, user_id):
    record_internship_view(
        internship_id,
        user_id
    )

    return {
        "success": True,
        "message": "Recently viewed updated"
    }


def fetch_recently_viewed(user_id):
    rows = get_recently_viewed(user_id)

    return [
        {
            "id": row[0],
            "company": row[1],
            "role": row[2],
            "location": row[3],
            "type": row[4],
            "category": row[5],
            "applyLink": row[6],
            "viewed_at": row[7].isoformat() if row[7] else None,
            "status": row[8]
        }
        for row in rows
    ]


# =====================================================
# AUTHENTICATION
# =====================================================

def register_User(name, email, password):
    return create_User(
        name,
        email,
        password
    )


def login_User(email, password):
    User = get_User_by_email(email)

    if not User:
        return {
            "success": False,
            "message": "User not found"
        }

    if User[3] is None:
        return {
            "success": False,
            "message": "Please login with Google"
        }

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        User[3].encode("utf-8")
    ):
        return {
            "success": False,
            "message": "Invalid password"
        }

    token = jwt.encode(
        {
            "User_id": User[0],
            "email": User[2],
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "User": {
            "id": User[0],
            "name": User[1],
            "email": User[2]
        }
    }


def login_google_User(token):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID"),
            clock_skew_in_seconds=10
        )

        email = idinfo["email"]
        name = idinfo["name"]

        User = get_User_by_email(email)
        is_new_User = False

        if not User:
            is_new_User = True

            create_google_User(
                name,
                email
            )

            User = get_User_by_email(email)

        jwt_token = jwt.encode(
            {
                "User_id": User[0],
                "email": User[2],
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            current_app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return {
            "success": True,
            "is_new_User": is_new_User,
            "onboarding_completed": User[4],
            "token": jwt_token,
            "User": {
                "id": User[0],
                "name": User[1],
                "email": User[2]
            }
        }

    except Exception as e:
        print("GOOGLE LOGIN ERROR:", repr(e))

        return {
            "success": False,
            "message": "Google login failed"
        }


# =====================================================
# ONBOARDING
# =====================================================

def finish_onboarding(data):
    save_user_profile(
        data["user_id"],
        data["college"],
        data["branch"],
        data["degree"],
        data["graduation_year"],
        data["skills"],
        data["interests"],
        data["preferred_locations"]
    )

    complete_onboarding(data["user_id"])

    return {
        "success": True,
        "message": "Onboarding completed successfully"
    }
