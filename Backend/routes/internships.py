
from flask import Blueprint, jsonify, request

from middleware.auth import token_required
from services.internship_service import (
    fetch_dashboard_data
)
from services.internship_service import (
    fetch_internships,
    add_saved_internship,
    fetch_saved_internships,
    remove_saved_internship,
    add_application,
    fetch_applications,
    update_application,
    update_internship_status,
    add_recently_viewed,
    fetch_recently_viewed,
    register_User,
    login_User,
    login_google_User,
    finish_onboarding
)

from services.recommendation_service import fetch_recommendations


internship_bp = Blueprint("internships", __name__)


# =====================================================
# AUTHENTICATION
# =====================================================

@internship_bp.route("/auth/google", methods=["POST"])
def google_login():
    data = request.get_json(silent=True) or {}

    token = data.get("token")

    if not token:
        return jsonify({
            "success": False,
            "message": "Google token is required"
        }), 400

    result = login_google_User(token)
    return jsonify(result)



@internship_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    return jsonify(
        register_User(
            data.get("name"),
            data.get("email"),
            data.get("password")
        )
    )


@internship_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    return jsonify(
        login_User(
            data.get("email"),
            data.get("password")
        )
    )


# =====================================================
# INTERNSHIPS
# =====================================================

@internship_bp.route("/internships", methods=["GET"])
def get_internships():
    return jsonify(fetch_internships())


@internship_bp.route("/internships/<int:id>", methods=["GET"])
def get_internship(id):
    internships = fetch_internships()

    internship = next(
        (item for item in internships if item["id"] == id),
        None
    )

    if internship:
        return jsonify(internship)

    return jsonify({
        "message": "Internship not found"
    }), 404


# =====================================================
# SAVED INTERNSHIPS
# =====================================================

@internship_bp.route("/saved/<int:id>", methods=["POST"])
@token_required
def save_job(id):
    user_id = request.User["User_id"]

    result = add_saved_internship(id, user_id)

    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    return jsonify(result)


@internship_bp.route("/saved", methods=["GET"])
@token_required
def get_saved_jobs():
    user_id = request.User["User_id"]

    return jsonify(
        fetch_saved_internships(user_id)
    )


@internship_bp.route("/saved/<int:id>", methods=["DELETE"])
@token_required
def delete_saved_job(id):
    user_id = request.User["User_id"]

    return jsonify(
        remove_saved_internship(id, user_id)
    )


# =====================================================
# APPLICATIONS
# =====================================================

@internship_bp.route("/apply/<int:id>", methods=["POST"])
@token_required
def apply_job(id):
    user_id = request.User["User_id"]

    return jsonify(
        add_application(id, user_id)
    )


@internship_bp.route("/applications", methods=["GET"])
@token_required
def get_applications():
    user_id = request.User["User_id"]

    return jsonify(
        fetch_applications(user_id)
    )


@internship_bp.route("/applications/<int:id>", methods=["PUT"])
@token_required
def update_application_route(id):
    user_id = request.User["User_id"]

    data = request.get_json(silent=True) or {}
    status = data.get("status")

    result = update_application(
        id,
        user_id,
        status
    )

    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    return jsonify(result)


# Update status using internship ID.
# Used by Recently Viewed Applied / Not Applied controls.

@internship_bp.route(
    "/internships/<int:id>/status",
    methods=["PUT"]
)
@token_required
def update_internship_status_route(id):
    user_id = request.User["User_id"]

    data = request.get_json(silent=True) or {}

    result = update_internship_status(
        id,
        user_id,
        data.get("status")
    )

    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    return jsonify(result)


# =====================================================
# RECENTLY VIEWED
# =====================================================

@internship_bp.route(
    "/recently-viewed/<int:id>",
    methods=["POST"]
)
@token_required
def record_view(id):
    user_id = request.User["User_id"]

    return jsonify(
        add_recently_viewed(id, user_id)
    )


@internship_bp.route(
    "/recently-viewed",
    methods=["GET"]
)
@token_required
def get_recently_viewed_route():
    user_id = request.User["User_id"]

    return jsonify(
        fetch_recently_viewed(user_id)
    )


# =====================================================
# ONBOARDING
# =====================================================

@internship_bp.route(
    "/onboarding/complete",
    methods=["POST"]
)
@token_required
def onboarding_complete():
    data = request.get_json(silent=True) or {}

    data["user_id"] = request.User["User_id"]

    return jsonify(
        finish_onboarding(data)
    )


# =====================================================
# RECOMMENDATIONS
# =====================================================

@internship_bp.route(
    "/recommendations/<int:user_id>",
    methods=["GET"]
)
@token_required
def recommendations(user_id):
    authenticated_user_id = request.User["User_id"]

    if authenticated_user_id != user_id:
        return jsonify({
            "success": False,
            "message": "Unauthorized"
        }), 403

    return jsonify(
        fetch_recommendations(user_id)
    )

# =====================================================
# DASHBOARD
# =====================================================

@internship_bp.route("/dashboard", methods=["GET"])
@token_required
def get_dashboard():
    user_id = request.User["User_id"]

    return jsonify(
        fetch_dashboard_data(user_id)
    )