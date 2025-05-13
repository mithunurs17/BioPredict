import pandas as pd

# Load the dataset
data_path = r"C:\Users\Mithun Raj Urs TV\Desktop\Body_Fluid_Marker\DiseasePredictorAI\DiseasePredictorAI\diabetes_data.csv"
df = pd.read_csv(data_path)

# Print column names
print("\nColumns in the CSV file:")
print(df.columns.tolist())

# Print first few rows
print("\nFirst few rows of the data:")
print(df.head()) 