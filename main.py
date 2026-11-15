
from networksecurity.components.data_ingestion import DataIngestion
from networksecurity.components.data_validation import DataValidation
from networksecurity.components.data_transformation import DataTransformation

from networksecurity.exception.exception import NetworkSecurityException
from networksecurity.logging.logger import logging

from networksecurity.entity.config_entity import (
    DataIngestionConfig,
    TrainingPipelineConfig,
    DataValidationConfig,DataTransformationConfig
)

import sys


if __name__ == '__main__':

    try:

        trainingpipelineconfig = TrainingPipelineConfig()

        # Data Ingestion Configuration
        dataingestionconfig = DataIngestionConfig(
            trainingpipelineconfig
        )

        # Data Ingestion Object
        data_ingestion = DataIngestion(
            dataingestionconfig
        )

        logging.info("Initiate The Data Ingestion")

        # Initiate Data Ingestion
        dataingestionartifact = (
            data_ingestion.initiate_data_ingestion()
        )

        logging.info("Data Ingestion Completed")

        # Data Validation Configuration
        data_validation_config = DataValidationConfig(
            trainingpipelineconfig
        )

        # Data Validation Object
        data_validation = DataValidation(
            dataingestionartifact,
            data_validation_config
        )

        logging.info("Initiate The Data Validation")

        # Initiate Data Validation
        data_validation_artifact = (
            data_validation.initiate_data_validation()
        )

        logging.info("Data Validation Completed")

        print(dataingestionartifact)
        print(data_validation_artifact)
        data_transformation_config=DataTransformationConfig(trainingpipelineconfig)
        logging.info("Data Transformation Started")
        data_transformation=DataTransformation(data_validation_artifact,data_transformation_config)
        data_transformation_artifact=data_transformation.initiate_data_transformation()
        print(data_transformation_artifact)
        logging.info("Data Transformation completed")
    except Exception as e:

        raise NetworkSecurityException(e, sys)

