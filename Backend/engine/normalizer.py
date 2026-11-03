
from classifier import classify
from parser import parse_description


def normalize_greenhouse_job(job):
    return normalize_job(job, "Greenhouse")


def normalize_ashby_job(job):
    return normalize_job(job, "Ashby")


def normalize_lever_job(job):
    return normalize_job(job, "Lever")


def normalize_workday_job(job):
    return normalize_job(job, "Workday")


def normalize_job(job, source):
    if not isinstance(job, dict):
        raise ValueError(f"Expected job dictionary, got {type(job).__name__}")

    if source == "Greenhouse":
        description = job.get("content", "") or ""
        company = job.get("company_name", "")
        location = job.get("location", {})
        location = location.get("name", "") if isinstance(location, dict) else location
        apply_link = job.get("absolute_url", "")

    elif source == "Ashby":
        description = job.get("descriptionPlain", "") or job.get("descriptionHtml", "") or ""
        company = job.get("companyName", "") or job.get("company", "") or "OpenAI"
        location = job.get("location", "") or ""
        apply_link = job.get("jobUrl", "") or job.get("applyUrl", "")

    elif source == "Lever":
        description = job.get("descriptionPlain", "") or job.get("description", "") or ""
        company = job.get("company", "")
        location_data = job.get("categories", {})
        location = location_data.get("location", "") if isinstance(location_data, dict) else ""
        apply_link = job.get("hostedUrl", "") or job.get("applyUrl", "")

    elif source == "Workday":
        description = job.get("description", "") or ""
        company = job.get("company", "")
        location = job.get("locationsText", "") or ""
        apply_link = job.get("externalPath", "") or ""

    else:
        raise ValueError(f"Unsupported ATS source: {source}")

    parsed = parse_description(description)

    normalized_job = {
        "company": company,
        "role": job.get("title", ""),
        "location": location,
        "work_type": parsed["work_type"],
        "skills": job.get("skills") or parsed["skills"],
        "experience": parsed["experience"],
        "degree": parsed["degree"],
        "salary": parsed["salary"],
        "duration": parsed["duration"],
        "description": description,
        "apply_link": apply_link,
        "source": source,
    }

    normalized_job["category"] = classify(normalized_job)
    return normalized_job
