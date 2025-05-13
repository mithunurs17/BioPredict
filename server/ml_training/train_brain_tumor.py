import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train_brain_tumor_model():
    # Load the dataset
    # Note: Replace 'brain_tumor_data.csv' with your actual data file
    try:
        df = pd.read_csv('brain_tumor_data.csv')
    except FileNotFoundError:
        print("Please provide the brain tumor dataset in CSV format")
        return

    # Define features (biomarkers) and target
    features = ['csfGlucose', 'csfProtein', 'csfLdh', 'cellCount']
    X = df[features]
    y = df['brain_tumor_status']  # Binary classification: 0 for no tumor, 1 for tumor

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
    print("\nBrain Tumor Model Performance:")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save the model and scaler
    joblib.dump(model, 'brain_tumor_model.joblib')
    joblib.dump(scaler, 'brain_tumor_scaler.joblib')
    print("\nModel and scaler saved successfully!")

if __name__ == "__main__":
    train_brain_tumor_model() 