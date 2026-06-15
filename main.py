from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

#Api
app = FastAPI(title="Nodex AutoScale API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load('ml_assets/load_model.pkl')
scaler = joblib.load('ml_assets/scaler.pkl')


class ServerMetrics(BaseModel):
    cpu_usage_percent: float
    ram_usage_percent: float
    network_io_mbps: float
    active_connections: int
    error_rate_percent: float


@app.post("/predict")
def predict_load(metrics: ServerMetrics):
    
    input_data = np.array([[
        metrics.cpu_usage_percent,
        metrics.ram_usage_percent,
        metrics.network_io_mbps,
        metrics.active_connections,
        metrics.error_rate_percent
    ]])
    
    
    scaled_data = scaler.transform(input_data)
    

    prediction = model.predict(scaled_data)[0]
    
   
    return {
        "predicted_cpu_load": round(prediction, 2),
        "trigger_scale_up": bool(prediction > 80.0) # If prediction > 80%, tell the system to deploy more servers
    }