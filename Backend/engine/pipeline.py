
from normalizer import (
    normalize_greenhouse_job,
    normalize_ashby_job,
    normalize_lever_job,
    normalize_workday_job,
)
from deduplicator import remove_duplicates
from storage import save_job


NORMALIZERS = {
    "greenhouse": normalize_greenhouse_job,
    "ashby": normalize_ashby_job,
    "lever": normalize_lever_job,
    "workday": normalize_workday_job,
}


def process_jobs(jobs, source="greenhouse"):
    normalizer = NORMALIZERS[source.lower()]
    normalized_jobs = []

    for job in jobs:
        normalized_jobs.append(normalizer(job))

    normalized_jobs = remove_duplicates(normalized_jobs)

    saved = 0
    for job in normalized_jobs:
        save_job(job)
        saved += 1

    return saved, normalized_jobs
