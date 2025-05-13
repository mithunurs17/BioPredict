import json
import sys
from predict_diabetes import predict_diabetes

def test_prediction():
    # Test data
    test_data = {
        "BMI": 27,
        "Chol": 5.5,
        "TG": 1.8,
        "HDL": 1.2,
        "LDL": 3.5,
        "Cr": 95,
        "BUN": 6.5
    }
    
    try:
        print("Testing prediction with data:", json.dumps(test_data, indent=2))
        result = predict_diabetes(test_data)
        print("\nPrediction successful!")
        print("Result:", json.dumps(result, indent=2))
        return True
    except Exception as e:
        print("\nError during prediction:", str(e))
        return False

if __name__ == "__main__":
    success = test_prediction()
    sys.exit(0 if success else 1) 