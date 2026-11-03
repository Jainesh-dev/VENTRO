
from storage import get_db_connection

def promote_jobs(jobs):
    conn = get_db_connection()
    cursor = conn.cursor()
    promoted = 0

    try:
        for job in jobs:
            cursor.execute(
                """
                INSERT INTO engine_internships
                (
                    company, role, location,
                    work_type, category, apply_link
                )
                VALUES (%s, %s, %s, %s, %s, %s)

                ON CONFLICT (apply_link)
                DO UPDATE SET
                    company = EXCLUDED.company,
                    role = EXCLUDED.role,
                    location = EXCLUDED.location,
                    work_type = EXCLUDED.work_type,
                    category = EXCLUDED.category
                """,
                (
                    job["company"],
                    job["role"],
                    job["location"],
                    job["work_type"],
                    job["category"],
                    job["apply_link"]
                )
            )

            promoted += 1

        conn.commit()
        return promoted

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()
