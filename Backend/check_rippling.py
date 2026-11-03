
import requests
import re

url = "https://www.rippling.com/careers/open-roles"

response = requests.get(url, timeout=20)
html = response.text

print("Status:", response.status_code)
print("Page length:", len(html))

patterns = [
    "greenhouse",
    "lever",
    "ashby",
    "workday",
    "jobPosting",
    "api/",
]

for pattern in patterns:
    matches = re.findall(
        r".{0,80}" + re.escape(pattern) + r".{0,100}",
        html,
        re.IGNORECASE
    )
    print(f"\n--- {pattern}: {len(matches)} matches ---")
    for match in matches[:3]:
        print(match)


print("\n--- JavaScript files ---")

scripts = re.findall(
    r'<script[^>]+src=["\']([^"\']+)',
    html,
    re.IGNORECASE
)

for script in scripts[:15]:
    print(script)


print("\n--- Embedded job data clues ---")

for term in ["open-roles", "jobTitle", "job_title", "department", "location"]:
    print(f"{term}: {html.lower().count(term.lower())} occurrences")
