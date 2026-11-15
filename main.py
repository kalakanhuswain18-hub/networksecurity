
from networksecurity.components.data_ingestion import DataIngestion
from networksecurity.components.data_validation import DataValidation

from networksecurity.exception.exception import NetworkSecurityException
from networksecurity.logging.logger import logging

from networksecurity.entity.config_entity import (
    DataIngestionConfig,
    TrainingPipelineConfig,
    DataValidationConfig
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

    except Exception as e:

        raise NetworkSecurityException(e, sys)
