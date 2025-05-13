import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_diabetes_model():
    # Load the dataset with absolute path
    data_path = r"C:\Users\Mithun Raj Urs TV\Desktop\Body_Fluid_Marker\DiseasePredictorAI\DiseasePredictorAI\diabetes_data.csv"
    try:
        df = pd.read_csv(data_path)
        print(f"Successfully loaded data from: {data_path}")
    except FileNotFoundError:
        print(f"Error: Could not find the file at {data_path}")
        return
    except Exception as e:
        print(f"Error loading the file: {str(e)}")
        return

    # Define features (biomarkers) and target
    features = ['BMI', 'Chol', 'TG', 'HDL', 'LDL', 'Cr', 'BUN']  # Using available biomarkers
    X = df[features]
    y = df['Diagnosis']  # Binary classification: 0 for no diabetes, 1 for diabetes

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
    print("\nDiabetes Model Performance:")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Create models directory if it doesn't exist
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)

    # Save the model and scaler
    model_path = os.path.join(models_dir, 'diabetes_model.joblib')
    scaler_path = os.path.join(models_dir, 'diabetes_scaler.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"\nModel saved to: {model_path}")
    print(f"Scaler saved to: {scaler_path}")

if __name__ == "__main__":
    train_diabetes_model() 