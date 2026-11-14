
import os
import sys
import socket
from urllib.parse import quote_plus

import certifi
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient
from sklearn.model_selection import train_test_split

from networksecurity.exception.exception import NetworkSecurityException
from networksecurity.logging.logger import logging
from networksecurity.entity.config_entity import DataIngestionConfig
from networksecurity.entity.artifact_entity import DataIngestionArtifact


# ---------------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ---------------------------------------------------------

load_dotenv()


# ---------------------------------------------------------
# IPV4 WORKAROUND
# ---------------------------------------------------------

_original_getaddrinfo = socket.getaddrinfo


def ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):

    results = _original_getaddrinfo(
        host, port, family, type, proto, flags
    )

    ipv4_results = [
        result for result in results
        if result[0] == socket.AF_INET
    ]

    return ipv4_results if ipv4_results else results


socket.getaddrinfo = ipv4_getaddrinfo


# ---------------------------------------------------------
# MONGODB CONNECTION CONFIGURATION
# ---------------------------------------------------------

username = os.getenv("MONGO_DB_USERNAME")
password = os.getenv("MONGO_DB_PASSWORD")
cluster = os.getenv("MONGO_DB_CLUSTER")

if not all([username, password, cluster]):
    raise ValueError(
        "MongoDB credentials missing. Check your .env file."
    )


MONGO_DB_URL = (
    f"mongodb+srv://{quote_plus(username)}:"
    f"{quote_plus(password)}@{cluster}/"
    "?retryWrites=true&w=majority"
)


# ---------------------------------------------------------
# DATA INGESTION CLASS
# ---------------------------------------------------------

class DataIngestion:

    def __init__(self, data_ingestion_config: DataIngestionConfig):

        try:

            logging.info("Data Ingestion initialized")

            self.data_ingestion_config = data_ingestion_config

        except Exception as e:

            raise NetworkSecurityException(e, sys)


    # -----------------------------------------------------
    # EXPORT DATA FROM MONGODB
    # -----------------------------------------------------

    def export_collection_as_dataframe(self):

        try:

            logging.info("Connecting to MongoDB Atlas")

            database_name = (
                self.data_ingestion_config.database_name
            )

            collection_name = (
                self.data_ingestion_config.collection_name
            )

            mongo_client = MongoClient(
                MONGO_DB_URL,
                tls=True,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=30000,
                connectTimeoutMS=30000
            )

            try:

                mongo_client.admin.command("ping")

                logging.info("MongoDB Connected Successfully!")

                collection = mongo_client[
                    database_name
                ][
                    collection_name
                ]

                records = list(collection.find())

                if not records:
                    raise ValueError(
                        "MongoDB collection is empty"
                    )

                dataframe = pd.DataFrame(records)

            finally:

                mongo_client.close()

            if "_id" in dataframe.columns:

                dataframe.drop(
                    columns=["_id"],
                    inplace=True
                )

            logging.info(
                f"Data fetched successfully: {dataframe.shape}"
            )

            return dataframe

        except Exception as e:

            raise NetworkSecurityException(e, sys)


    # -----------------------------------------------------
    # EXPORT DATA INTO FEATURE STORE
    # -----------------------------------------------------

    def export_data_into_feature_store(
        self,
        dataframe: pd.DataFrame
    ):

        try:

            logging.info("Exporting data into feature store")

            feature_store_path = (
                self.data_ingestion_config.feature_store_file_path
            )

            os.makedirs(
                os.path.dirname(feature_store_path),
                exist_ok=True
            )

            dataframe.to_csv(
                feature_store_path,
                index=False,
                header=True
            )

            logging.info(
                f"Feature store created: {feature_store_path}"
            )

            return dataframe

        except Exception as e:

            raise NetworkSecurityException(e, sys)


    # -----------------------------------------------------
    # SPLIT DATA INTO TRAIN AND TEST
    # -----------------------------------------------------

    def split_data_as_train_test(
        self,
        dataframe: pd.DataFrame
    ):

        try:

            logging.info("Splitting data into train and test")

            train_set, test_set = train_test_split(
                dataframe,
                test_size=(
                    self.data_ingestion_config.train_test_split_ratio
                ),
                random_state=42
            )

            train_path = (
                self.data_ingestion_config.training_file_path
            )

            test_path = (
                self.data_ingestion_config.testing_file_path
            )

            os.makedirs(
                os.path.dirname(train_path),
                exist_ok=True
            )

            os.makedirs(
                os.path.dirname(test_path),
                exist_ok=True
            )

            train_set.to_csv(
                train_path,
                index=False,
                header=True
            )

            test_set.to_csv(
                test_path,
                index=False,
                header=True
            )

            logging.info(
                f"Training data saved: {train_path}"
            )

            logging.info(
                f"Testing data saved: {test_path}"
            )

            logging.info(
                f"Train shape: {train_set.shape}"
            )

            logging.info(
                f"Test shape: {test_set.shape}"
            )

            return train_path, test_path

        except Exception as e:

            raise NetworkSecurityException(e, sys)


    # -----------------------------------------------------
    # INITIATE DATA INGESTION
    # -----------------------------------------------------

    def initiate_data_ingestion(self):

        try:

            logging.info("Starting Data Ingestion")

            # Step 1: Fetch data
            dataframe = self.export_collection_as_dataframe()

            # Step 2: Feature store
            dataframe = self.export_data_into_feature_store(
                dataframe
            )

            # Step 3: Train test split
            train_path, test_path = (
                self.split_data_as_train_test(dataframe)
            )

            # Step 4: Create artifact
            data_ingestion_artifact = DataIngestionArtifact(
                trained_file_path=train_path,
                test_file_path=test_path
            )

            logging.info(
                "Data Ingestion completed successfully"
            )

            return data_ingestion_artifact

        except Exception as e:

            raise NetworkSecurityException(e, sys)
