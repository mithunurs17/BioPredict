import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train_alzheimers_model():
    # Load the dataset
    # Note: Replace 'alzheimers_data.csv' with your actual data file
    try:
        df = pd.read_csv('alzheimers_data.csv')
    except FileNotFoundError:
        print("Please provide the Alzheimer's disease dataset in CSV format")
        return

    # Define features (biomarkers) and target
    features = ['abeta42', 'totalTau', 'pTau', 'nfl']
    X = df[features]
    y = df['alzheimers_status']  # Binary classification: 0 for no disease, 1 for disease

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    # Make predictions
    y_pred = model.predict(X_test_scaled)

    # Print model performance
    print("\nAlzheimer's Disease Model Performance:")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save the model and scaler
    joblib.dump(model, 'alzheimers_model.joblib')
    joblib.dump(scaler, 'alzheimers_scaler.joblib')
    print("\nModel and scaler saved successfully!")

if __name__ == "__main__":
    train_alzheimers_model() 