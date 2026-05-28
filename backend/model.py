import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle


def train_model():

    print("Loading dataset...")

    # Load dataset
    data = pd.read_csv("Bug Detection.csv")

    # Replace '?' with NaN
    data = data.replace("?", pd.NA)

    # Convert all columns to numeric
    data = data.apply(pd.to_numeric, errors="coerce")

    # Remove rows with missing values
    data = data.dropna()

    print("Dataset cleaned")
    print("Total samples:", len(data))

    # Separate features and target
    X = data.drop("defects", axis=1)
    y = data["defects"]

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Training model...")

    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=200, random_state=42)

    model.fit(X_train, y_train)

    # Evaluate accuracy
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    print("Model Accuracy:", round(accuracy * 100, 2), "%")

    # Save trained model
    with open("bug_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Model saved as bug_model.pkl")


if __name__ == "__main__":
    train_model()