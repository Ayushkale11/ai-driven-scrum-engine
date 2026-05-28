def predict_bug(features):
    loc, complexity, developers, bugs, commits, coverage = features

    risk = 0

    if loc > 2000:
        risk += 15

    if complexity > 15:
        risk += 25

    if developers > 5:
        risk += 10

    if bugs > 5:
        risk += 25

    if commits > 30:
        risk += 10

    if coverage < 60:
        risk += 20

    risk = min(risk, 100)

    defect = risk >= 50

    return {
        "defect": defect,
        "risk_probability": risk / 100
    }