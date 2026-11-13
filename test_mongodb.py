
import socket
import certifi
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pymongo import MongoClient
import os

load_dotenv()

# Force IPv4
original_getaddrinfo = socket.getaddrinfo

def ipv4_getaddrinfo(*args, **kwargs):
    results = original_getaddrinfo(*args, **kwargs)
    ipv4 = [r for r in results if r[0] == socket.AF_INET]
    return ipv4 if ipv4 else results

socket.getaddrinfo = ipv4_getaddrinfo

username = quote_plus(os.getenv("MONGO_DB_USERNAME"))
password = quote_plus(os.getenv("MONGO_DB_PASSWORD"))
cluster = os.getenv("MONGO_DB_CLUSTER")

uri = f"mongodb+srv://{username}:{password}@{cluster}/?authSource=admin"

client = MongoClient(
    uri,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=20000
)

try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully!")

except Exception as e:
    print("Connection Failed:", repr(e))

finally:
    client.close()
