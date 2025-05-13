import sys
import json
import numpy as np
from joblib import load
import os
import traceback
from pathlib import Path

def load_model_and_scaler():
    """Load the trained model and scaler."""
    try:
        # Get the directory of the current script
        current_dir = Path(__file__).parent
        models_dir = current_dir / 'models'
        
        # Construct paths to model and scaler files
        model_path = models_dir / 'diabetes_model.joblib'
        scaler_path = models_dir / 'diabetes_scaler.joblib'
        
        # Load model and scaler
        model = load(model_path)
        scaler = load(scaler_path)
        
        return model, scaler
    except Exception as e:
        print(f"Error loading model or scaler: {str(e)}", file=sys.stderr)
        raise

def analyze_biomarkers(features):
    """Analyze individual biomarkers for potential health issues."""
    issues = []
    
    # BMI analysis
    if features['BMI'] < 18.5:
        issues.append("Underweight (BMI < 18.5)")
    elif features['BMI'] >= 25 and features['BMI'] < 30:
        issues.append("Overweight (BMI 25-29.9)")
    elif features['BMI'] >= 30:
        issues.append("Obese (BMI ≥ 30)")
    
    # Cholesterol analysis
    if features['Chol'] > 5.2:
        issues.append("High Total Cholesterol (>5.2 mmol/L)")
    
    # Triglycerides analysis
    if features['TG'] > 1.7:
        issues.append("High Triglycerides (>1.7 mmol/L)")
    
    # HDL analysis
    if features['HDL'] < 1.0:
        issues.append("Low HDL Cholesterol (<1.0 mmol/L)")
    
    # LDL analysis
    if features['LDL'] > 3.4:
        issues.append("High LDL Cholesterol (>3.4 mmol/L)")
    
    # Creatinine analysis
    if features['Cr'] > 106:
        issues.append("Elevated Creatinine (>106 μmol/L)")
    
    # BUN analysis
    if features['BUN'] > 7.1:
        issues.append("Elevated Blood Urea Nitrogen (>7.1 mmol/L)")
    
    return issues

def predict_diabetes(features):
    """Make prediction using the loaded model."""
    try:
        # Load model and scaler
        model, scaler = load_model_and_scaler()
        
        # Prepare features in the correct order
        feature_names = ['BMI', 'Chol', 'TG', 'HDL', 'LDL', 'Cr', 'BUN']
        X = np.array([[features[name] for name in feature_names]])
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Make prediction
        prediction = model.predict(X_scaled)
        probability = model.predict_proba(X_scaled)[0]
        
        # Calculate risk value (0-100)
        risk_value = int(probability[1] * 100)
        
        # Determine risk level
        if risk_value < 30:
            risk_level = "Low"
        elif risk_value < 70:
            risk_level = "Moderate"
        else:
            risk_level = "High"
        
        # Analyze individual biomarkers
        biomarker_issues = analyze_biomarkers(features)
        
        # Generate factors based on biomarker analysis
        factors = []
        if risk_value < 30:
            factors.append("Normal BMI")
            factors.append("Normal Cholesterol")
            factors.append("Normal Triglycerides")
        else:
            factors.extend(biomarker_issues)
        
        # Generate recommendation based on risk level
        if risk_level == "Low":
            recommendation = "Continue maintaining a healthy lifestyle with regular check-ups."
        elif risk_level == "Moderate":
            recommendation = "Consider lifestyle modifications and regular monitoring of blood glucose levels."
        else:
            recommendation = "Schedule a consultation with your healthcare provider for a comprehensive evaluation."
        
        # Determine potential diseases based on biomarkers
        potential_diseases = []
        if features['BMI'] >= 30:
            potential_diseases.append("Obesity")
        if features['Chol'] > 5.2 or features['LDL'] > 3.4:
            potential_diseases.append("Hypercholesterolemia")
        if features['TG'] > 1.7:
            potential_diseases.append("Hypertriglyceridemia")
        if features['Cr'] > 106 or features['BUN'] > 7.1:
            potential_diseases.append("Kidney Function Impairment")
        if features['HDL'] < 1.0:
            potential_diseases.append("Low HDL Syndrome")
        
        # If no specific diseases detected but risk is moderate or high
        if not potential_diseases and risk_level != "Low":
            potential_diseases.append("Metabolic Syndrome")
        
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
        print(f"Error making prediction: {str(e)}", file=sys.stderr)
        raise

def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        # Make prediction
        result = predict_diabetes(input_data)
        
        # Print result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 