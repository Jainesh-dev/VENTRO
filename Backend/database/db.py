
import psycopg2
import bcrypt
import os

from datetime import date
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_User"),
        password=os.getenv("DB_PASSWORD"),
        port="5432"
    )


# =====================================================
# INTERNSHIPS
# =====================================================

def get_all_internships():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                company,
                role,
                location,
                work_type,
                skills,
                category,
                apply_link,
                description,
                experience,
                degree,
                salary,
                duration
            FROM engine_internships
            WHERE apply_link IS NOT NULL
              AND TRIM(apply_link) <> ''
              AND LOWER(TRIM(apply_link)) NOT IN (
                  '#',
                  'n/a',
                  'na',
                  'none',
                  'null',
                  'javascript:void(0)'
              )
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "company": row[1],
                "role": row[2],
                "location": row[3],
                "work_type": row[4],
                "skills": row[5] or [],
                "category": row[6],
                "apply_link": row[7],
                "description": row[8],
                "experience": row[9],
                "degree": row[10],
                "salary": row[11],
                "duration": row[12]
            }
            for row in rows
        ]

    finally:
        cursor.close()
        conn.close()


# =====================================================
# SAVED INTERNSHIPS
# =====================================================

def save_internship(internship_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id
            FROM saved_internships
            WHERE internship_id = %s AND user_id = %s
        """, (internship_id, user_id))

        if cursor.fetchone():
            return

        cursor.execute("""
            INSERT INTO saved_internships
                (internship_id, user_id)
            VALUES (%s, %s)
        """, (internship_id, user_id))

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()


def get_saved_internships(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                i.id,
                i.company,
                i.role,
                i.location,
                i.work_type,
                i.category,
                i.apply_link,
                s.created_at
            FROM saved_internships s
            JOIN engine_internships i
                ON s.internship_id = i.id
            WHERE s.user_id = %s
            ORDER BY s.created_at DESC
        """, (user_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


def delete_saved_internship(internship_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE FROM saved_internships
            WHERE internship_id = %s AND user_id = %s
        """, (internship_id, user_id))

        conn.commit()

    finally:
        cursor.close()
        conn.close()


# =====================================================
# APPLICATIONS
# =====================================================

VALID_APPLICATION_STATUSES = (
    "Applied",
    "Not Applied",
    "Interview"
)


def set_application_status(internship_id, user_id, status):
    if status not in VALID_APPLICATION_STATUSES:
        raise ValueError("Invalid application status")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id
            FROM applications
            WHERE internship_id = %s AND user_id = %s
            ORDER BY id DESC
            LIMIT 1
        """, (internship_id, user_id))

        existing = cursor.fetchone()

        if existing:
            cursor.execute("""
                UPDATE applications
                SET status = %s,
                    applied_date = CASE
                        WHEN %s IN ('Applied', 'Interview')
                            THEN COALESCE(applied_date, CURRENT_DATE)
                        ELSE NULL
                    END
                WHERE id = %s
            """, (status, status, existing[0]))

        else:
            cursor.execute("""
                INSERT INTO applications
                    (internship_id, user_id, status, applied_date)
                VALUES (%s, %s, %s, %s)
            """, (
                internship_id,
                user_id,
                status,
                date.today()
                if status in ("Applied", "Interview")
                else None
            ))

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()


def apply_to_internship(internship_id, user_id):
    set_application_status(
        internship_id,
        user_id,
        "Applied"
    )


def get_all_applications(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                a.id,
                i.id,
                i.company,
                i.role,
                a.status,
                a.applied_date,
                i.category,
                a.created_at
            FROM applications a
            JOIN engine_internships i
                ON a.internship_id = i.id
            WHERE a.user_id = %s
            ORDER BY a.created_at DESC
        """, (user_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


def update_application_status(application_id, user_id, status):
    if status not in VALID_APPLICATION_STATUSES:
        raise ValueError("Invalid application status")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE applications
            SET status = %s,
                applied_date = CASE
                    WHEN %s IN ('Applied', 'Interview')
                        THEN COALESCE(applied_date, CURRENT_DATE)
                    ELSE NULL
                END
            WHERE id = %s AND user_id = %s
        """, (status, status, application_id, user_id))

        updated = cursor.rowcount
        conn.commit()

        return updated > 0

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()


# =====================================================
# RECENTLY VIEWED
# =====================================================

def record_internship_view(internship_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO recently_viewed
                (internship_id, user_id, viewed_at)
            VALUES (%s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, internship_id)
            DO UPDATE SET viewed_at = CURRENT_TIMESTAMP
        """, (internship_id, user_id))

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()


def get_recently_viewed(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                i.id,
                i.company,
                i.role,
                i.location,
                i.work_type,
                i.category,
                i.apply_link,
                rv.viewed_at,
                COALESCE(a.status, 'Not Applied') AS status
            FROM recently_viewed rv
            JOIN engine_internships i
                ON rv.internship_id = i.id
            LEFT JOIN applications a
                ON a.internship_id = i.id
                AND a.user_id = rv.user_id
            WHERE rv.user_id = %s
            ORDER BY rv.viewed_at DESC
        """, (user_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


# =====================================================
# USER AUTHENTICATION
# =====================================================

def create_User(name, email, password):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        cursor.execute("""
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s)
        """, (
            name,
            email,
            hashed_password.decode("utf-8")
        ))

        conn.commit()

        return {
            "success": True,
            "message": "User registered successfully"
        }

    except psycopg2.IntegrityError:
        conn.rollback()

        return {
            "success": False,
            "message": "Email already exists"
        }

    finally:
        cursor.close()
        conn.close()


def get_User_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                name,
                email,
                password,
                onboarding_completed
            FROM users
            WHERE email = %s
        """, (email,))

        return cursor.fetchone()

    finally:
        cursor.close()
        conn.close()


def complete_onboarding(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE users
            SET onboarding_completed = TRUE
            WHERE id = %s
        """, (user_id,))

        conn.commit()

    finally:
        cursor.close()
        conn.close()


def create_google_User(name, email):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, NULL)
        """, (name, email))

        conn.commit()

        return {
            "success": True,
            "message": "Google User created"
        }

    except psycopg2.IntegrityError:
        conn.rollback()

        return {
            "success": False,
            "message": "Email already exists"
        }

    finally:
        cursor.close()
        conn.close()


# =====================================================
# USER PROFILE
# =====================================================

def save_user_profile(
    user_id,
    college,
    branch,
    degree,
    graduation_year,
    skills,
    interests,
    preferred_locations
):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO user_profiles (
                user_id,
                college,
                branch,
                degree,
                graduation_year,
                skills,
                interests,
                preferred_locations
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)

            ON CONFLICT (user_id)
            DO UPDATE SET
                college = EXCLUDED.college,
                branch = EXCLUDED.branch,
                degree = EXCLUDED.degree,
                graduation_year = EXCLUDED.graduation_year,
                skills = EXCLUDED.skills,
                interests = EXCLUDED.interests,
                preferred_locations = EXCLUDED.preferred_locations
        """, (
            user_id,
            college,
            branch,
            degree,
            graduation_year,
            skills,
            interests,
            preferred_locations
        ))

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()


def get_user_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                skills,
                interests,
                preferred_locations
            FROM user_profiles
            WHERE user_id = %s
        """, (user_id,))

        row = cursor.fetchone()

        if row is None:
            return None

        return {
            "skills": row[0],
            "interest": row[1][0] if row[1] else "",
            "locations": row[2]
        }

    finally:
        cursor.close()
        conn.close()


# =====================================================
# COMPANIES
# =====================================================

def get_active_companies():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                company_name,
                ats,
                slug
            FROM companies
            WHERE active = TRUE
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()
