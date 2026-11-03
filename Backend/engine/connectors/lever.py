
import sys
import os
import requests

sys.path.append(
    os.path.dirname(os.path.dirname(__file__))
)

from logger import log_info, log_success, log_error
from skill_extractor import extract_skills


def fetch_lever_jobs(slug):
    url = f"https://api.lever.co/v0/postings/{slug}?mode=json"

    log_info(f"Connecting to Lever: {slug}")

    try:
        response = requests.get(url, timeout=20)

        if response.status_code != 200:
            log_error(
                f"Connection Failed (Status Code: {response.status_code})"
            )
            log_error(response.text[:300])
            return []

        jobs = response.json()

        if not isinstance(jobs, list):
            log_error("Unexpected Lever response format")
            return []

        log_success("Connected Successfully")
        log_info(f"Found {len(jobs)} total jobs")

        internships = []
        keywords = ["intern", "internship", "co-op", "student", "university","graduate"]

        for job in jobs:
            title = job.get("text", "")

            if any(keyword in title.lower() for keyword in keywords):
                description = (
                    job.get("descriptionPlain", "")
                    or job.get("description", "")
                    or ""
                )

                job["skills"] = extract_skills(description)
                internships.append(job)

        log_success(f"Filtered {len(internships)} internships")
        return internships

    except (requests.RequestException, ValueError) as error:
        log_error(f"Lever connector failed: {error}")
        return []


if __name__ == "__main__":
    jobs = fetch_lever_jobs("leverdemo")
    print(f"Internships found: {len(jobs)}")
