
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

    # BMI: 21-24 ideal range
    if features['BMI'] > 24:
        issues.append("High BMI may increase insulin resistance")
        risk_factors += 1
    elif features['BMI'] < 21:
        issues.append("Low BMI - monitor nutritional status")
        risk_factors += 1

    # Total Cholesterol: < 4.0 mmol/L target
    if features['Chol'] >= 4.0:
        issues.append("Elevated total cholesterol - above target for diabetics")
        risk_factors += 1

    # Triglycerides: < 1.3 mmol/L target
    if features['TG'] >= 1.3:
        issues.append("High triglycerides - increased heart disease risk")
        risk_factors += 1

    # HDL: > 1.3-1.5 mmol/L target
    if features['HDL'] < 1.3:
        issues.append("Low HDL cholesterol - reduced protection against heart disease")
        risk_factors += 1

    # LDL: < 2.0 mmol/L target
    if features['LDL'] >= 2.0:
        issues.append("High LDL cholesterol - increased cardiovascular risk")
        risk_factors += 1

    # BUN: 4.0-6.5 mmol/L range
    if features['BUN'] < 4.0 or features['BUN'] > 6.5:
        issues.append("Abnormal BUN levels - may indicate kidney function issues")
        risk_factors += 1

    # Creatinine: 60-90 µmol/L (using average range)
    if features['Cr'] < 60 or features['Cr'] > 90:
        issues.append("Abnormal creatinine levels - possible kidney function concern")
        risk_factors += 1

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
        
        # Adjust risk based on number of risk factors
        base_risk = int(probability[1] * 100)
        risk_value = min(100, base_risk + (risk_factors * 10))  # Increase risk by 10% per risk factor

        if risk_value < 30:
            risk_level = "Low"
        elif risk_value < 70:
            risk_level = "Moderate"
        else:
            risk_level = "High"

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

        # Add specific conditions and remedies based on biomarker values
        conditions = []
        remedies = []
        
        # BMI Analysis
        if features['BMI'] > 24:
            conditions.append("High BMI - Risk factor for diabetes")
            remedies.append("Regular exercise (30 mins/day), balanced diet with reduced calories")
        
        # Cholesterol Analysis
        if features['Chol'] >= 4.0:
            conditions.append("Elevated Cholesterol")
            remedies.append("Limit saturated fats, increase fiber intake, consider statins if prescribed")
            
        # Triglycerides Analysis    
        if features['TG'] >= 1.3:
            conditions.append("High Triglycerides")
            remedies.append("Reduce sugar intake, limit alcohol, increase omega-3 rich foods")
            
        # HDL Analysis
        if features['HDL'] < 1.3:
            conditions.append("Low HDL (Good) Cholesterol")
            remedies.append("Regular aerobic exercise, quit smoking, maintain healthy weight")
            
        # LDL Analysis
        if features['LDL'] >= 2.0:
            conditions.append("High LDL (Bad) Cholesterol")
            remedies.append("Mediterranean diet, limit processed foods, regular exercise")
            
        # Kidney Function Analysis
        if features['Cr'] < 60 or features['Cr'] > 90:
            conditions.append("Abnormal Creatinine Levels")
            remedies.append("Stay hydrated, limit protein intake, regular kidney function monitoring")
            
        if features['BUN'] < 4.0 or features['BUN'] > 6.5:
            conditions.append("Abnormal BUN Levels")
            remedies.append("Monitor protein intake, maintain hydration, regular kidney checkups")

        result.update({
            "conditions": conditions,
            "remedies": remedies
        })
        
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
