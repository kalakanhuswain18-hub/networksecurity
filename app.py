
import os
import sys

import pandas as pd

from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import Response
from starlette.responses import RedirectResponse
from uvicorn import run as app_run

from networksecurity.utils.ml_utils.model.estimator import NetworkModel
from networksecurity.utils.main_utils.utils import load_object
from networksecurity.exception.exception import NetworkSecurityException
from networksecurity.logging.logger import logging
from networksecurity.pipeline.training_pipeline import TrainingPipeline


# Initialize FastAPI
app = FastAPI()

# CORS Configuration
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Jinja2 Templates
templates = Jinja2Templates(directory="./templates")


# Home Route
@app.get("/", tags=["authentication"])
async def index():
    return RedirectResponse(url="/docs")


# Training Route
@app.get("/train")
def train_route():
    try:
        train_pipeline = TrainingPipeline()
        train_pipeline.run_pipeline()

        return Response("Training is successful")

    except Exception as e:
        logging.error(f"Training failed: {e}")
        raise NetworkSecurityException(e, sys)


# Prediction Route
@app.post("/predict")
async def predict_route(
    request: Request,
    file: UploadFile = File(...)
):
    try:
        # Read uploaded CSV file
        df = pd.read_csv(file.file)

        # Load preprocessing object and trained model
        preprocessor = load_object(
            "final_models/preprocessor.pkl"
        )

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
        df["predicted_column"] = y_pred

        # Create output directory
        os.makedirs("prediction_output", exist_ok=True)

        # Save prediction output
        df.to_csv(
            "prediction_output/output.csv",
            index=False
        )

        # Convert DataFrame into HTML table
        table_html = df.to_html(
            classes="table table-striped",
            index=False
        )

        # Return HTML Response
        return templates.TemplateResponse(
            request=request,
            name="table.html",
            context={
                "table": table_html
            }
        )

    except Exception as e:
        logging.error(f"Prediction failed: {e}")
        raise NetworkSecurityException(e, sys)

    finally:
        file.file.close()


# Run Application
if __name__ == "__main__":
    app_run(
        app,
        host="127.0.0.1",
        port=8000
    )
