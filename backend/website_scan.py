import requests
from bs4 import BeautifulSoup


def scan_website(url):

    result = {
        "https": False,
        "forms_found": 0,
        "scripts_found": 0,
        "risk_score": 0
    }

    if url.startswith("https"):
        result["https"] = True

    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        forms = soup.find_all("form")
        scripts = soup.find_all("script")

        result["forms_found"] = len(forms)
        result["scripts_found"] = len(scripts)

        risk = 0

        if not result["https"]:
            risk += 40

        if len(forms) > 5:
            risk += 20

        if len(scripts) > 20:
            risk += 20

        if response.status_code != 200:
            risk += 20

        result["risk_score"] = min(risk, 100)

    except Exception as e:
        result["error"] = str(e)
        result["risk_score"] = 100

    return result