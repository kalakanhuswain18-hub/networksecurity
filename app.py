
import os
import sys

import pandas as pd

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from uvicorn import run as app_run

from networksecurity.utils.ml_utils.model.estimator import NetworkModel
from networksecurity.utils.main_utils.utils import load_object
from networksecurity.exception.exception import NetworkSecurityException
from networksecurity.logging.logger import logging
from networksecurity.pipeline.training_pipeline import TrainingPipeline


# Initialize FastAPI
app = FastAPI(
    title="Network Security - Phishing Website Detection API",
    description="ML-powered phishing website detection system",
    version="1.0.0"
)


# CORS Configuration
# Configure your actual Vercel frontend URL before production.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Home Route
@app.get("/", tags=["Authentication"])
async def index():
    return RedirectResponse(url="/docs")


# Health Check Route
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "success": True,
        "status": "healthy",
        "message": "Network Security API is running"
    }


# Training Route
@app.get("/train", tags=["Training"])
def train_route():
    try:
        logging.info("Training pipeline started")

        train_pipeline = TrainingPipeline()
        train_pipeline.run_pipeline()

        return {
            "success": True,
            "message": "Model training completed successfully"
        }

    except Exception as e:
        logging.error(f"Training failed: {e}")

        raise HTTPException(
            status_code=500,
            detail="Model training failed"
        )


# Prediction Route
@app.post("/predict", tags=["Prediction"])
async def predict_route(file: UploadFile = File(...)):

    try:
        # Validate uploaded file
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a valid CSV file"
            )

        logging.info(f"Prediction started for file: {file.filename}")

        # Read uploaded CSV
        df = pd.read_csv(file.file)

        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="Uploaded CSV file is empty"
            )

        # Load preprocessing object
        preprocessor = load_object(
            "final_models/preprocessor.pkl"
        )

        # Load trained model
        final_model = load_object(
            "final_models/model.pkl"
        )

        # Initialize Network Model
        network_model = NetworkModel(
            preprocessor=preprocessor,
            model=final_model
        )

        # Generate Predictions
        y_pred = network_model.predict(df)

        # Add predictions to DataFrame
        df["predicted_column"] = y_pred.astype(int)

        # Count predictions
        phishing_count = int((y_pred == 1).sum())
        legitimate_count = int((y_pred == 0).sum())

        # Save prediction output
        os.makedirs("prediction_output", exist_ok=True)

        df.to_csv(
            "prediction_output/output.csv",
            index=False
        )

        # Convert DataFrame to JSON records
        predictions = df.to_dict(orient="records")

        logging.info("Prediction completed successfully")

        # Return JSON response
        return {
            "success": True,
            "message": "Prediction completed successfully",
            "total_records": len(df),
            "phishing_count": phishing_count,
            "legitimate_count": legitimate_count,
            "predictions": predictions
        }

    except HTTPException:
        raise

    except Exception as e:
        logging.error(f"Prediction failed: {e}")

        raise HTTPException(
            status_code=500,
            detail="Prediction failed. Please check the uploaded CSV format."
        )

    finally:
        await file.close()


# Run Application
if __name__ == "__main__":
    app_run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000))
    )
