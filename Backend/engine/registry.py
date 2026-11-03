from connectors.greenhouse import fetch_greenhouse_jobs
from connectors.lever import fetch_lever_jobs
from connectors.ashby import fetch_ashby_jobs


CONNECTORS = {
    "greenhouse": fetch_greenhouse_jobs,
    "lever":fetch_lever_jobs,
    "ashby": fetch_ashby_jobs,
}