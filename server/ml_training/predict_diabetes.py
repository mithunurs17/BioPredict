
import json
import sys
import numpy as np
import joblib
import os

def load_model_and_scaler():
    try:
        model_dir = os.path.join(os.path.dirname(__file__), 'models')
        model = joblib.load(os.path.join(model_dir, 'diabetes_model.joblib'))
        scaler = joblib.load(os.path.join(model_dir, 'diabetes_scaler.joblib'))
        return model, scaler
    except Exception as e:
        print(f"Error loading model: {str(e)}", file=sys.stderr)
        raise

def analyze_biomarkers(features):
    issues = []

    if features['BMI'] >= 30:
        issues.append("High BMI indicates obesity risk")
    elif features['BMI'] >= 25:
        issues.append("Elevated BMI suggests overweight condition")

    if features['Chol'] > 5.2:
        issues.append("Elevated total cholesterol")

    if features['TG'] > 1.7:
        issues.append("High triglycerides level")

    if features['HDL'] < 1.0:
        issues.append("Low HDL cholesterol")

    if features['LDL'] > 3.4:
        issues.append("High LDL cholesterol")

    if features['Cr'] > 106:
        issues.append("Elevated creatinine level")

    if features['BUN'] > 7.1:
        issues.append("High blood urea nitrogen")

    return issues

def predict_diabetes(features):
    try:
        model, scaler = load_model_and_scaler()

        feature_names = ['BMI', 'Chol', 'TG', 'HDL', 'LDL', 'Cr', 'BUN']
        X = np.array([[features[name] for name in feature_names]])

        X_scaled = scaler.transform(X)
        prediction = model.predict(X_scaled)
        probability = model.predict_proba(X_scaled)[0]

        risk_value = int(probability[1] * 100)

        if risk_value < 30:
            risk_level = "Low"
        elif risk_value < 70:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        biomarker_issues = analyze_biomarkers(features)

        factors = []
        if biomarker_issues:
            factors.extend(biomarker_issues)
        else:
            factors.append("All biomarkers within normal range")

        if risk_level == "Low":
            recommendation = "Continue maintaining your healthy lifestyle with regular check-ups."
        elif risk_level == "Moderate":
            recommendation = "Consider lifestyle modifications and consult healthcare provider for preventive measures."
        else:
            recommendation = "Schedule an immediate consultation with your healthcare provider for comprehensive evaluation."

        potential_diseases = []
        if features['BMI'] >= 30:
            potential_diseases.append("Obesity")
        if features['Chol'] > 5.2 or features['LDL'] > 3.4:
            potential_diseases.append("Hypercholesterolemia")
        if features['TG'] > 1.7:
            potential_diseases.append("Hypertriglyceridemia")
        if features['Cr'] > 106 or features['BUN'] > 7.1:
            potential_diseases.append("Kidney Function Impairment")

        result = {
            "riskLevel": risk_level,
            "riskValue": risk_value,
            "factors": factors,
            "recommendation": recommendation,
            "potentialDiseases": potential_diseases,
            "biomarkerIssues": biomarker_issues
        }

        return result

    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        raise

def main():
    try:
        input_data = json.loads(sys.stdin.read())
        result = predict_diabetes(input_data)
        print(json.dumps(result))

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
