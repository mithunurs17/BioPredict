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
    risk_factors = 0
    risk_details = []

    # BMI: 21-24 ideal range
    if features['BMI'] > 30:
        issues.append({"type": "negative", "text": f"Very High BMI ({features['BMI']}) - Significant risk for diabetes"})
        risk_factors += 2
        risk_details.append("Obesity (BMI > 30)")
    elif features['BMI'] > 24:
        issues.append({"type": "warning", "text": f"High BMI ({features['BMI']}) may increase insulin resistance"})
        risk_factors += 1
        risk_details.append("Overweight")
    elif features['BMI'] < 21:
        issues.append({"type": "warning", "text": f"Low BMI ({features['BMI']}) - monitor nutritional status"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Healthy BMI ({features['BMI']})"})

    # Total Cholesterol: < 4.0 mmol/L target
    if features['Chol'] >= 4.0:
        issues.append({"type": "negative", "text": f"Elevated total cholesterol ({features['Chol']} mmol/L) - above target for diabetics"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Healthy total cholesterol ({features['Chol']} mmol/L)"})

    # Triglycerides: < 1.3 mmol/L target
    if features['TG'] >= 1.3:
        issues.append({"type": "negative", "text": f"High triglycerides ({features['TG']} mmol/L) - increased heart disease risk"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Healthy triglyceride levels ({features['TG']} mmol/L)"})

    # HDL: > 1.3-1.5 mmol/L target
    if features['HDL'] < 1.3:
        issues.append({"type": "negative", "text": f"Low HDL cholesterol ({features['HDL']} mmol/L) - reduced protection against heart disease"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Healthy HDL cholesterol ({features['HDL']} mmol/L)"})

    # LDL: < 2.0 mmol/L target
    if features['LDL'] >= 2.0:
        issues.append({"type": "negative", "text": f"High LDL cholesterol ({features['LDL']} mmol/L) - increased cardiovascular risk"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Healthy LDL cholesterol ({features['LDL']} mmol/L)"})

    # BUN: 4.0-6.5 mmol/L range
    if features['BUN'] < 4.0 or features['BUN'] > 6.5:
        issues.append({"type": "negative", "text": f"Abnormal BUN levels ({features['BUN']} mmol/L) - may indicate kidney function issues"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Normal BUN levels ({features['BUN']} mmol/L)"})

    # Creatinine: 60-90 µmol/L (using average range)
    if features['Cr'] < 60 or features['Cr'] > 90:
        issues.append({"type": "negative", "text": f"Abnormal creatinine levels ({features['Cr']} µmol/L) - possible kidney function concern"})
        risk_factors += 1
    else:
        issues.append({"type": "positive", "text": f"Normal creatinine levels ({features['Cr']} µmol/L)"})

    return issues, risk_factors

def predict_diabetes(features):
    try:
        model, scaler = load_model_and_scaler()

        feature_names = ['BMI', 'Chol', 'TG', 'HDL', 'LDL', 'Cr', 'BUN']
        X = np.array([[features[name] for name in feature_names]])

        X_scaled = scaler.transform(X)
        prediction = model.predict(X_scaled)
        probability = model.predict_proba(X_scaled)[0]

        biomarker_issues, risk_factors = analyze_biomarkers(features)
        
        # Calculate risk based on individual parameters
        parameter_risks = []
        
        # BMI risk (0-25 points)
        if features['BMI'] > 30:
            parameter_risks.append(25)  # Severe obesity
        elif features['BMI'] > 25:
            parameter_risks.append(20)  # Overweight
        elif features['BMI'] < 18.5:
            parameter_risks.append(15)  # Underweight
            
        # Cholesterol risk (0-20 points)
        if features['Chol'] > 5.2:
            parameter_risks.append(20)  # Very high cholesterol
        elif features['Chol'] > 4.0:
            parameter_risks.append(15)  # High cholesterol
            
        # Triglycerides risk (0-20 points)
        if features['TG'] > 2.0:
            parameter_risks.append(20)  # Very high triglycerides
        elif features['TG'] > 1.3:
            parameter_risks.append(15)  # High triglycerides
            
        # HDL risk (0-20 points)
        if features['HDL'] < 1.0:
            parameter_risks.append(20)  # Very low HDL
        elif features['HDL'] < 1.3:
            parameter_risks.append(15)  # Low HDL
            
        # LDL risk (0-20 points)
        if features['LDL'] > 3.4:
            parameter_risks.append(20)  # Very high LDL
        elif features['LDL'] > 2.0:
            parameter_risks.append(15)  # High LDL
            
        # Kidney function risk (0-25 points)
        if features['Cr'] > 106 or features['BUN'] > 7.1:
            parameter_risks.append(25)  # Severe kidney impairment
        elif features['Cr'] > 90 or features['BUN'] > 6.5:
            parameter_risks.append(20)  # Moderate kidney impairment
            
        # Calculate total risk from parameters
        parameter_risk = sum(parameter_risks)
        
        # Add additional risk points for multiple unhealthy parameters
        unhealthy_count = sum(1 for risk in parameter_risks if risk >= 15)
        if unhealthy_count >= 3:
            parameter_risk += 20  # Additional risk for multiple unhealthy parameters
        
        # Calculate base risk from model prediction
        base_risk = int(probability[1] * 100)
        
        # Use the higher of the two risk calculations
        risk_value = max(base_risk, parameter_risk)
        
        # Ensure minimum risk value for unhealthy parameters
        if any(risk >= 20 for risk in parameter_risks):
            risk_value = max(risk_value, 60)  # Minimum high risk if any parameter is very unhealthy
        
        # Ensure risk value is between 0 and 100
        risk_value = min(100, risk_value)

        # Determine risk level based on combined risk score
        if risk_value < 15:
            risk_level = "Minimal"
        elif risk_value < 35:
            risk_level = "Low"
        elif risk_value < 55:
            risk_level = "Moderate"
        elif risk_value < 75:
            risk_level = "High"
        else:
            risk_level = "Very High"

        # Generate recommendations based on risk level
        if risk_level == "Minimal":
            recommendation = "Continue maintaining your healthy lifestyle with regular check-ups."
        elif risk_level == "Low":
            recommendation = "Maintain current lifestyle and schedule regular health check-ups."
        elif risk_level == "Moderate":
            recommendation = "Consider lifestyle modifications and consult healthcare provider for preventive measures."
        elif risk_level == "High":
            recommendation = "Schedule an immediate consultation with your healthcare provider for comprehensive evaluation."
        else:
            recommendation = "Urgent medical attention required. Please consult your healthcare provider immediately."

        # Determine potential diseases based on biomarker values
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
            "factors": biomarker_issues,
            "recommendation": recommendation,
            "potentialDiseases": potential_diseases
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
