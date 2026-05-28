from fastapi import FastAPI
from predictor import predict_bug
from website_scan import scan_website
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Risk Detection API Running"}


# -------------------------
# CODE RISK DETECTION
# -------------------------

@app.post("/predict-code-risk")
def code_risk(data: dict):

    features = list(data.values())

    result = predict_bug(features)

    return {
        "analysis": result
    }


# -------------------------
# WEBSITE RISK DETECTION
# -------------------------

@app.post("/scan-website")
def website_risk(data: dict):

    url = data.get("url")

    result = scan_website(url)

    return {
        "website": url,
        "scan_result": result
    }


# -------------------------
# GITHUB REPO RISK DETECTION
# -------------------------

@app.post("/scan-github-repo")
def scan_github(data: dict):

    repo_url = data.get("url")

    if not repo_url:
        return {"error": "No URL provided"}

    try:
        parts = repo_url.strip().split("/")
        owner = parts[-2]
        repo = parts[-1]
    except:
        return {"error": "Invalid GitHub URL"}

    base = f"https://api.github.com/repos/{owner}/{repo}"

    try:
        repo_data = requests.get(base).json()
        contributors = requests.get(f"{base}/contributors").json()

        # -------------------------
        # NEW: TOP CONTRIBUTORS LOGIC
        # -------------------------
        top_contributors = []

        if isinstance(contributors, list):
            for c in contributors[:5]:  # top 5 contributors
                top_contributors.append({
                    "login": c.get("login"),
                    "contributions": c.get("contributions")
                })
        else:
            contributors = []

        # -------------------------
        # BASIC METRICS
        # -------------------------
        open_issues = repo_data.get("open_issues_count", 0)
        stars = repo_data.get("stargazers_count", 0)
        forks = repo_data.get("forks_count", 0)

        contributor_count = len(contributors) if isinstance(contributors, list) else 0

        # -------------------------
        # RISK CALCULATION
        # -------------------------
        risk = 0

        if open_issues > 20:
            risk += 30

        if contributor_count < 3:
            risk += 25

        if stars < 5:
            risk += 15

        if forks < 2:
            risk += 10

        risk = min(risk, 100)

        level = "Low Risk"
        if risk >= 70:
            level = "High Risk"
        elif risk >= 40:
            level = "Medium Risk"

        # -------------------------
        # FINAL RESPONSE
        # -------------------------
        return {
            "repo": f"{owner}/{repo}",
            "open_issues": open_issues,
            "contributors": contributor_count,
            "stars": stars,
            "forks": forks,
            "risk_score": risk,
            "risk_level": level,
            "top_contributors": top_contributors   # ⭐ NEW FIELD
        }

    except Exception as e:
        return {
            "error": "Failed to fetch repository data",
            "details": str(e)
        }