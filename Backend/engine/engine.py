from registry import CONNECTORS
from pipeline import process_jobs
from promoter import promote_jobs
from storage import get_active_companies
from logger import (
    log_info,
    log_success,
    log_error
)



def run_engine():
    total_jobs = 0
    total_saved = 0
    companies = get_active_companies()

    for company in companies:
        company_name, ats, slug = company

        connector = CONNECTORS.get(ats.lower())

        if connector is None:
            log_info(f"Skipping {company_name}: unsupported ATS '{ats}'")
            continue

        log_info(f"Running {company_name} ({ats})")

        try:
            if ats.lower() == "workday":
                config = {
                    "tenant": slug,
                    "board": "HoneywellCareers",
                    "site": "HoneywellCareers",
                    "instance": "wd5"
                }
                jobs = connector(config)
            else:
                jobs = connector(slug)

            total_jobs += len(jobs)

            saved, normalized_jobs = process_jobs(jobs,ats)
            promoted = promote_jobs(normalized_jobs)

            log_success(f"Promoted {promoted} internships")
            total_saved += saved

        except Exception as error:
            log_error(f"{company_name} failed: {error}")

    print()
    print("=" * 40)
    print("ENGINE REPORT")
    print("=" * 40)
    print(f"Companies Scanned : {len(companies)}")
    print(f"Jobs Found        : {total_jobs}")
    print(f"Jobs Processed    : {total_saved}")
    print("=" * 40)

if __name__ == "__main__":
    run_engine()