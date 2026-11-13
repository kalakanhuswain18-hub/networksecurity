# Network Security – Phishing Website Detection

A Python-based network security project focused on phishing website detection using machine learning techniques and MongoDB Atlas for cloud data storage.

## Overview

This project uses a phishing website dataset containing **11,055 records and 31 features** to support the analysis and detection of potentially malicious websites.

The project includes a data ingestion pipeline that loads CSV data, processes records using Pandas, and stores them in MongoDB Atlas.

## Features

- Phishing website dataset handling
- CSV data loading using Pandas
- ETL data ingestion pipeline
- MongoDB Atlas cloud integration
- Bulk data insertion using PyMongo
- Environment-based database configuration
- Connection testing and error handling

## Technologies Used

- Python
- Pandas
- NumPy
- Scikit-learn
- MongoDB Atlas
- PyMongo
- Python-dotenv
- Jupyter Notebook

## Dataset Information

| Details | Value |
|---|---|
| Dataset | Phishing Website Dataset |
| Total Records | 11,055 |
| Total Features | 31 |
| Target Column | Result |
| Format | CSV |

## Project Structure

```text
NetworkSecurity/
│
├── networksecurity/
├── Network_Data/
│   └── phisingData.csv
├── notebook/
├── logs/
├── push_data.py
├── test_mongodb.py
├── setup.py
├── requirements.txt
├── Dockerfile
├── .gitignore
└── README.md
```

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/kalakanhuswain18-hub/networksecurity.git
```

**2. Navigate to the project**

```bash
cd networksecurity
```

**3. Create a virtual environment**

```bash
python -m venv venv
```

**4. Activate the environment**

Windows:

```bash
venv\Scripts\activate
```

**5. Install dependencies**

```bash
pip install -r requirements.txt
```

## MongoDB Configuration

Create a `.env` file in the project root directory:

```env
MONGO_DB_USERNAME=your_username
MONGO_DB_PASSWORD=your_password
MONGO_DB_CLUSTER=your_cluster.mongodb.net
```

Never upload your `.env` file or database credentials to GitHub.

## Run the Data Pipeline

```bash
python push_data.py
```

The pipeline loads the dataset and uploads records to MongoDB Atlas.

## Database Details

| Property | Value |
|---|---|
| Database | NetworkSecurity |
| Collection | network_data |
| Uploaded Documents | 11,055 |
| Storage | MongoDB Atlas |

## Future Improvements

- Implement machine learning classification models
- Perform data preprocessing and feature engineering
- Evaluate models using accuracy, precision, recall and F1-score
- Build a phishing website prediction API
- Develop a web-based monitoring dashboard

## Author

**Kalakanhu Swain**

GitHub: [@kalakanhuswain18-hub](https://github.com/kalakanhuswain18-hub)

---

⭐ If you find this project interesting, consider giving it a star!