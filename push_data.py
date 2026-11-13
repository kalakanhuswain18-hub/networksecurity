
import os
import socket
import certifi
import pandas as pd

from dotenv import load_dotenv
from urllib.parse import quote_plus
from pymongo import MongoClient
from pymongo.errors import BulkWriteError

# Load environment variables
load_dotenv()


# -----------------------------------
# 1. Force IPv4 (NAT64 workaround)
# -----------------------------------

_original_getaddrinfo = socket.getaddrinfo


def ipv4_getaddrinfo(*args, **kwargs):
    results = _original_getaddrinfo(*args, **kwargs)

    ipv4_results = [
        item for item in results
        if item[0] == socket.AF_INET
    ]

    return ipv4_results if ipv4_results else results


socket.getaddrinfo = ipv4_getaddrinfo


# -----------------------------------
# 2. MongoDB Connection
# -----------------------------------

def get_mongodb_client():

    username = os.getenv("MONGO_DB_USERNAME")
    password = os.getenv("MONGO_DB_PASSWORD")
    cluster = os.getenv("MONGO_DB_CLUSTER")

    if not all([username, password, cluster]):
        raise ValueError(
            "MongoDB credentials missing in .env"
        )

    encoded_username = quote_plus(username)
    encoded_password = quote_plus(password)

    uri = (
        f"mongodb+srv://{encoded_username}:"
        f"{encoded_password}@{cluster}/"
        "?retryWrites=true&w=majority&authSource=admin"
    )

    client = MongoClient(
        uri,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=20000
    )

    # Test connection
    client.admin.command("ping")

    print("MongoDB Atlas Connected Successfully!")

    return client


# -----------------------------------
# 3. Insert Records into MongoDB
# -----------------------------------

def insert_data_mongodb(records, database, collection):

    if not records:
        print("No records available for insertion.")
        return 0

    client = None

    try:
        client = get_mongodb_client()

        db = client[database]
        collection_obj = db[collection]

        result = collection_obj.insert_many(
            records,
            ordered=False
        )

        inserted_count = len(result.inserted_ids)

        print("Data uploaded successfully!")
        print("Inserted records:", inserted_count)

        return inserted_count

    except BulkWriteError as e:

        details = e.details or {}

        inserted_count = details.get(
            "nInserted", 0
        )

        print("Bulk insertion completed with errors.")
        print("Inserted records:", inserted_count)
        print("Failed records:", len(details.get("writeErrors", [])))

        return inserted_count

    except Exception as e:

        print("MongoDB Upload Failed:", repr(e))
        raise

    finally:

        if client:
            client.close()


# -----------------------------------
# 4. Load Dataset
# -----------------------------------

def load_dataset(file_path):

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"Dataset not found: {file_path}"
        )

    print("Loading dataset...")

    df = pd.read_csv(file_path)

    print("Dataset loaded successfully!")
    print("Dataset shape:", df.shape)
    print("Columns:", list(df.columns))

    # Handle missing values for MongoDB
    df = df.astype(object).where(
        pd.notna(df), None
    )

    records = df.to_dict(orient="records")

    print("Total records:", len(records))

    return records


# -----------------------------------
# 5. Main Execution
# -----------------------------------

if __name__ == "__main__":

    print("\nStarting Network Security Data Upload\n")

    try:

        # Change this to your actual CSV filename
        DATASET_PATH = "Network_Data/phisingData.csv"

        DATABASE_NAME = "NetworkSecurity"
        COLLECTION_NAME = "network_data"

        # Load CSV records
        records = load_dataset(DATASET_PATH)

        # Upload to MongoDB
        inserted = insert_data_mongodb(
            records=records,
            database=DATABASE_NAME,
            collection=COLLECTION_NAME
        )

        print("\n--------------------------------")
        print("Upload process finished!")
        print("Inserted records:", inserted)
        print("--------------------------------")

    except Exception as e:

        print("\nProcess Failed:", repr(e))
