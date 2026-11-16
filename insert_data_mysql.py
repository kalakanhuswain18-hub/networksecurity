
import os
import pandas as pd
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

try:
    # Read CSV
    df = pd.read_csv("Network_Data/phisingData.csv")

    # Connect to MySQL
    connection = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )

    cursor = connection.cursor()

    columns = df.columns.tolist()

    column_names = ", ".join(f"`{col}`" for col in columns)
    placeholders = ", ".join(["%s"] * len(columns))

    query = f"""
        INSERT INTO network_data ({column_names})
        VALUES ({placeholders})
    """

    data = [
        tuple(None if pd.isna(value) else int(value) for value in row)
        for row in df.itertuples(index=False, name=None)
    ]

    cursor.executemany(query, data)
    connection.commit()

    print("Data inserted successfully!")
    print("Total records inserted:", cursor.rowcount)

    cursor.close()
    connection.close()

except Exception as e:
    print("Error:", e)
