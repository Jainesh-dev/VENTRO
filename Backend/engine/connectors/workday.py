
import requests

url = (
    "https://honeywell.wd5.myworkdayjobs.com/"
    "wday/cxs/honeywell/HoneywellCareers/jobs"
)

payload = {
    "limit": 20,
    "offset": 0,
    "searchText": ""
}

try:
    response = requests.post(
        url,
        json=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        timeout=20
    )

    print("Status:", response.status_code)
    print("Response:", response.text[:1500])

except requests.RequestException as error:
    print("Request failed:", error)
