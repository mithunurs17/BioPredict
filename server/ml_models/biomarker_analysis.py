import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import os

class BiomarkerAnalyzer:
    def __init__(self, model_type='both'):
        """
        Initialize the BiomarkerAnalyzer
        
        Args:
            model_type (str): Type of models to use ('sklearn', 'keras', or 'both')
        """
        self.model_type = model_type
        self.scaler = StandardScaler()
        self.sklearn_models = {}
        self.keras_models = {}
        self.feature_importance = {}
        
    def load_data(self, csv_path, target_column, biomarker_type):
        """
        Load and preprocess the biomarker data
        
        Args:
            csv_path (str): Path to the CSV file
            target_column (str): Name of the target column
            biomarker_type (str): Type of biomarker (e.g., 'blood', 'urine', etc.)
        """
        try:
            # Load data
            df = pd.read_csv(csv_path)
            
            # Print column names for debugging
            print("\nAvailable columns in the dataset:")
            print(df.columns.tolist())
            
            # Drop non-numeric columns except the target
            non_numeric_cols = df.select_dtypes(include=['object']).columns.tolist()
            if target_column in non_numeric_cols:
                non_numeric_cols.remove(target_column)
            if non_numeric_cols:
                print(f"Dropping non-numeric columns: {non_numeric_cols}")
                df = df.drop(columns=non_numeric_cols)
            
            # Separate features and target
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            return {
                'X_train': X_train_scaled,
                'X_test': X_test_scaled,
                'y_train': y_train,
                'y_test': y_test,
                'feature_names': X.columns.tolist()
            }
            
        except Exception as e:
            print(f"Error loading data: {str(e)}")
            return None

    def train_sklearn_models(self, data):
        """
        Train Scikit-learn models
        
        Args:
            data (dict): Dictionary containing training and testing data
        """
        # Random Forest
        rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        rf_model.fit(data['X_train'], data['y_train'])
        self.sklearn_models['random_forest'] = rf_model
        
        # Gradient Boosting
        gb_model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        gb_model.fit(data['X_train'], data['y_train'])
        self.sklearn_models['gradient_boosting'] = gb_model
        
        # Store feature importance
        self.feature_importance['random_forest'] = dict(zip(
            data['feature_names'],
            rf_model.feature_importances_
        ))

    def train_keras_model(self, data):
        """
        Train TensorFlow/Keras model
        
        Args:
            data (dict): Dictionary containing training and testing data
        """
        # Get number of features and classes
        n_features = data['X_train'].shape[1]
        n_classes = len(np.unique(data['y_train']))
        
        # Create model
        model = Sequential([
            Dense(64, activation='relu', input_shape=(n_features,)),
            Dropout(0.3),
            Dense(32, activation='relu'),
            Dropout(0.2),
            Dense(n_classes, activation='softmax')
        ])
        
        # Compile model
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Early stopping callback
        early_stopping = EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        
        # Train model
        history = model.fit(
            data['X_train'],
            data['y_train'],
            epochs=100,
            batch_size=32,
            validation_split=0.2,
            callbacks=[early_stopping],
            verbose=1
        )
        
        self.keras_models['neural_network'] = model
        return history

    def evaluate_models(self, data):
        """
        Evaluate all trained models
        
        Args:
            data (dict): Dictionary containing training and testing data
        """
        results = {}
        
        # Evaluate Scikit-learn models
        if self.model_type in ['sklearn', 'both']:
            for name, model in self.sklearn_models.items():
                y_pred = model.predict(data['X_test'])
                accuracy = accuracy_score(data['y_test'], y_pred)
                report = classification_report(data['y_test'], y_pred)
                conf_matrix = confusion_matrix(data['y_test'], y_pred)
                
                results[name] = {
                    'accuracy': accuracy,
                    'classification_report': report,
                    'confusion_matrix': conf_matrix
                }
        
        # Evaluate Keras model
        if self.model_type in ['keras', 'both']:
            for name, model in self.keras_models.items():
                loss, accuracy = model.evaluate(data['X_test'], data['y_test'])
                y_pred = np.argmax(model.predict(data['X_test']), axis=1)
                report = classification_report(data['y_test'], y_pred)
                conf_matrix = confusion_matrix(data['y_test'], y_pred)
                
                results[name] = {
                    'accuracy': accuracy,
                    'loss': loss,
                    'classification_report': report,
                    'confusion_matrix': conf_matrix
                }
        
        return results

    def save_models(self, output_dir):
        """
        Save trained models and scaler
        
        Args:
            output_dir (str): Directory to save models
        """
        os.makedirs(output_dir, exist_ok=True)
        
        # Save scaler
        joblib.dump(self.scaler, os.path.join(output_dir, 'scaler.joblib'))
        
        # Save Scikit-learn models
        if self.model_type in ['sklearn', 'both']:
            for name, model in self.sklearn_models.items():
                joblib.dump(model, os.path.join(output_dir, f'{name}_model.joblib'))
        
        # Save Keras models
        if self.model_type in ['keras', 'both']:
            for name, model in self.keras_models.items():
                model.save(os.path.join(output_dir, f'{name}_model.h5'))
        
        # Save feature importance
        if self.feature_importance:
            joblib.dump(self.feature_importance, 
                       os.path.join(output_dir, 'feature_importance.joblib'))

    def load_models(self, input_dir):
        """
        Load trained models and scaler
        
        Args:
            input_dir (str): Directory containing saved models
        """
        # Load scaler
        self.scaler = joblib.load(os.path.join(input_dir, 'scaler.joblib'))
        
        # Load Scikit-learn models
        if self.model_type in ['sklearn', 'both']:
            for model_name in ['random_forest', 'gradient_boosting']:
                model_path = os.path.join(input_dir, f'{model_name}_model.joblib')
                if os.path.exists(model_path):
                    self.sklearn_models[model_name] = joblib.load(model_path)
        
        # Load Keras models
        if self.model_type in ['keras', 'both']:
            model_path = os.path.join(input_dir, 'neural_network_model.h5')
            if os.path.exists(model_path):
                self.keras_models['neural_network'] = tf.keras.models.load_model(model_path)
        
        # Load feature importance
        importance_path = os.path.join(input_dir, 'feature_importance.joblib')
        if os.path.exists(importance_path):
            self.feature_importance = joblib.load(importance_path)

def main():
    # Initialize the analyzer
    analyzer = BiomarkerAnalyzer(model_type='both')
    
    # Load and preprocess data
    data = analyzer.load_data(
        csv_path='diabetes_data.csv',
        target_column='Diagnosis',
        biomarker_type='blood'
    )
    
    if data:
        print("\nTraining Scikit-learn models...")
        analyzer.train_sklearn_models(data)
        
        print("\nTraining Keras model...")
        history = analyzer.train_keras_model(data)
        
        print("\nEvaluating models...")
        results = analyzer.evaluate_models(data)
        
        # Print results
        for model_name, model_results in results.items():
            print(f"\nResults for {model_name}:")
            print(f"Accuracy: {model_results['accuracy']:.4f}")
            print("\nClassification Report:")
            print(model_results['classification_report'])
            print("\nConfusion Matrix:")
            print(model_results['confusion_matrix'])
        
        # Save models
        print("\nSaving models...")
        analyzer.save_models('saved_models')
        print("Models saved successfully!")

if __name__ == "__main__":
    main() 