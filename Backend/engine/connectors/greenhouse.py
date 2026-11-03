import sys
import os
import re

sys.path.append(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)
import requests
from logger import (
    log_info,
    log_success,
    log_error
)
from skill_extractor import extract_skills   

def fetch_greenhouse_jobs(slug):

    GREENHOUSE_URL = (
    f"https://api.greenhouse.io/v1/boards/{slug}/jobs?content=true"
    )

    log_info("Connecting to Greenhouse...")

    response = requests.get(GREENHOUSE_URL)

    if response.status_code != 200:
        log_error(
        f"Connection Failed (Status Code: {response.status_code})"
        )
        log_error(response.text)
        return []

    data = response.json()

    log_success("Connected Successfully")
    log_info(
    f"Found {len(data['jobs'])} total jobs"
    )

    jobs = data["jobs"]

    internships = []

    keywords = [
        "intern",
        "internship",
        "co-op",
        "co op",
    ]

    for job in jobs:
        title = job["title"].lower()

        if any(
            re.search(r"\b" + re.escape(keyword) + r"\b", title)
            for keyword in keywords
        ):
            description = job.get("content", "")
            skills = extract_skills(description)
            job["skills"] = skills

            internships.append(job)

    log_success(
    f"Filtered {len(internships)} internships"
    )

    return internships

if __name__ == "__main__":

    jobs = fetch_greenhouse_jobs("stripe")

    if jobs:
        print(jobs[0]["title"])
        print(jobs[0]["skills"])
    else:
        print("No jobs found.")