import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# 1. Generate Simulated Server Telemetry Data
np.random.seed(42)
num_records = 5000

data = {
    'cpu_usage_percent': np.random.uniform(10, 80, num_records),
    'ram_usage_percent': np.random.uniform(20, 90, num_records),
    'network_io_mbps': np.random.uniform(5, 100, num_records),
    'active_connections': np.random.randint(100, 5000, num_records),
    'error_rate_percent': np.random.uniform(0.0, 2.0, num_records)
}

df = pd.DataFrame(data)

# Calculate future load (This is what our AI learns to predict)
df['future_cpu_load'] = (
    (df['active_connections'] * 0.01) + 
    (df['ram_usage_percent'] * 0.5) + 
    (df['network_io_mbps'] * 0.2) + 
    np.random.normal(0, 5, num_records)
)
df['future_cpu_load'] = df['future_cpu_load'].clip(lower=0, upper=100)

# 2. Prepare Data for the AI
X = df.drop('future_cpu_load', axis=1)
y = df['future_cpu_load']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 3. Train the Random Forest Model
print("Training Cloud Load Predictor...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

accuracy = model.score(X_test_scaled, y_test)
print(f"Model trained successfully. Accuracy Score: {accuracy:.2f}")

# 4. Save the Assets for the Web Server
os.makedirs('ml_assets', exist_ok=True)
joblib.dump(model, 'ml_assets/load_model.pkl')
joblib.dump(scaler, 'ml_assets/scaler.pkl')
print("Infrastructure model saved to /ml_assets/")