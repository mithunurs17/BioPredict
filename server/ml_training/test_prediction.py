import json
from predict_diabetes import predict_diabetes

# Test Case 1: Normal, healthy values
normal_values = {
    "BMI": 22.5,
    "Chol": 4.5,
    "TG": 1.2,
    "HDL": 1.5,
    "LDL": 2.5,
    "Cr": 80,
    "BUN": 5.5
}

# Test Case 2: High-risk values
high_risk_values = {
    "BMI": 32,
    "Chol": 6.5,
    "TG": 2.5,
    "HDL": 0.8,
    "LDL": 4.0,
    "Cr": 120,
    "BUN": 8.5
}

# Test Case 3: Moderate risk values
moderate_risk_values = {
    "BMI": 27,
    "Chol": 5.5,
    "TG": 1.8,
    "HDL": 1.2,
    "LDL": 3.5,
    "Cr": 95,
    "BUN": 6.5
}

def run_test_case(name, values):
    print(f"\n{'='*50}")
    print(f"Test Case: {name}")
    print(f"{'='*50}")
    print("\nInput Values:")
    for key, value in values.items():
        print(f"{key}: {value}")
    
    print("\nPrediction Results:")
    result = predict_diabetes(values)
    print(json.dumps(result, indent=2))

# Run all test cases
print("Testing Diabetes Prediction System")
print("="*50)

run_test_case("Normal Values", normal_values)
run_test_case("High Risk Values", high_risk_values)
run_test_case("Moderate Risk Values", moderate_risk_values) 