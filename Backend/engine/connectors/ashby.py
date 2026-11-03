
import sys
import os
import requests

sys.path.append(
    os.path.dirname(os.path.dirname(__file__))
)

from logger import log_info, log_success, log_error
from skill_extractor import extract_skills


def fetch_ashby_jobs(slug):
    url = f"https://api.ashbyhq.com/posting-api/job-board/{slug}"

    log_info("Connecting to Ashby...")

    try:
        response = requests.get(url, timeout=20)

        if response.status_code != 200:
            log_error(
                f"Connection Failed (Status Code: {response.status_code})"
            )
            return []

        data = response.json()
        jobs = data.get("jobs", [])

        log_success("Connected Successfully")
        log_info(f"Found {len(jobs)} total jobs")

        internships = []
        keywords = ["intern", "internship", "co-op", "student", "university","graduate"]

        for job in jobs:
            title = job.get("title", "")

            if any(keyword in title.lower() for keyword in keywords):
                description = job.get("descriptionPlain", "") or ""
                job["skills"] = extract_skills(description)
                internships.append(job)

        log_success(f"Filtered {len(internships)} internships")
        return internships

    except (requests.RequestException, ValueError) as error:
        log_error(f"Ashby connector failed: {error}")
        return []


if __name__ == "__main__":
    jobs = fetch_ashby_jobs("openai")
    print(f"Internships found: {len(jobs)}")
