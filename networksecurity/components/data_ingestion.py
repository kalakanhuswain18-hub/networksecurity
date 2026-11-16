
import os
import sys

import mysql.connector
import pandas as pd
from dotenv import load_dotenv
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
# MYSQL CONNECTION CONFIGURATION
# ---------------------------------------------------------

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")


# ---------------------------------------------------------
# DATA INGESTION CLASS
# ---------------------------------------------------------

class DataIngestion:

    def __init__(self, data_ingestion_config: DataIngestionConfig):

        try:
            logging.info("Data Ingestion initialized")

            self.data_ingestion_config = data_ingestion_config

        except Exception as e:
            raise NetworkSecurityException(e, sys) from e


    # -----------------------------------------------------
    # EXPORT DATA FROM MYSQL
    # -----------------------------------------------------

    def export_collection_as_dataframe(self):

        connection = None
        cursor = None

        try:

            logging.info("Connecting to MySQL database")

            if not all([
                MYSQL_HOST,
                MYSQL_USER,
                MYSQL_PASSWORD,
                MYSQL_DATABASE
            ]):
                raise ValueError(
                    "MySQL credentials missing. Check your .env file."
                )

            connection = mysql.connector.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                database=MYSQL_DATABASE
            )

            logging.info("MySQL Connected Successfully!")

            cursor = connection.cursor()

            cursor.execute("SELECT * FROM network_data")

            records = cursor.fetchall()

            columns = [column[0] for column in cursor.description]

            if not records:
                raise ValueError("MySQL table is empty")

            dataframe = pd.DataFrame(
                records,
                columns=columns
            )

            # Remove MySQL auto-increment ID
            if "id" in dataframe.columns:
                dataframe.drop(
                    columns=["id"],
                    inplace=True
                )

            logging.info(
                f"Data fetched successfully: {dataframe.shape}"
            )

            return dataframe

        except Exception as e:

            raise NetworkSecurityException(e, sys) from e

        finally:

            if cursor is not None:
                cursor.close()

            if connection is not None and connection.is_connected():
                connection.close()


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

            raise NetworkSecurityException(e, sys) from e


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

            logging.info(f"Training data saved: {train_path}")
            logging.info(f"Testing data saved: {test_path}")

            logging.info(f"Train shape: {train_set.shape}")
            logging.info(f"Test shape: {test_set.shape}")

            return train_path, test_path

        except Exception as e:

            raise NetworkSecurityException(e, sys) from e


    # -----------------------------------------------------
    # INITIATE DATA INGESTION
    # -----------------------------------------------------

    def initiate_data_ingestion(self):

        try:

            logging.info("Starting Data Ingestion")

            # Step 1: Fetch data from MySQL
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

            raise NetworkSecurityException(e, sys) from e
