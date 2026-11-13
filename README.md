# 🛡️ Network Security – Phishing Website Detection

<p align="center">
  <b>A Python-based Network Security project for phishing website data ingestion, storage, and machine learning analysis.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-blue?logo=python" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Scikit--Learn-ML-orange?logo=scikitlearn" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" />
</p>

---

## 📌 Project Overview

Network Security – Phishing Website Detection is a machine learning-oriented project designed to work with phishing website datasets and support the development of an automated phishing detection system.

The project currently includes a data ingestion pipeline that loads website security data from CSV files and stores records in MongoDB Atlas for further processing and analysis.

The dataset contains **11,055 records and 31 features** related to website URLs, SSL certificates, domain information, web traffic, and other security indicators.

## 🏗️ Project Architecture

<p align="center">
  <img src="docs/Phishing%20Detection%20ML%20Architecture.png" alt="Network Security Project Architecture" width="100%" />
</p>

## ✨ Key Features

- Phishing website dataset management
- CSV data ingestion using Pandas
- MongoDB Atlas cloud database integration
- Bulk data insertion using PyMongo
- Environment-based configuration
- MongoDB connection testing
- Modular project structure
- Logging and exception handling foundation
- Machine learning pipeline architecture

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Pandas | Data loading and manipulation |
| NumPy | Numerical operations |
| Scikit-learn | Machine learning |
| MongoDB Atlas | Cloud database |
| PyMongo | MongoDB integration |
| Python-dotenv | Environment configuration |
| Jupyter Notebook | Data exploration |
| Git & GitHub | Version control |

## 📊 Dataset Information

| Attribute | Details |
|---|---|
| Dataset Name | Phishing Website Dataset |
| Total Records | 11,055 |
| Total Features | 31 |
| File Format | CSV |
| Target Column | `Result` |
| Dataset File | `phisingData.csv` |

### Important Features

- `having_IP_Address`
- `URL_Length`
- `Shortining_Service`
- `SSLfinal_State`
- `Domain_registeration_length`
- `Request_URL`
- `URL_of_Anchor`
- `age_of_domain`
- `web_traffic`
- `Google_Index`
- `Result`

## 📁 Project Structure

```text
NetworkSecurity/
│
├── .github/
│
├── docs/
│   └── Phishing Detection ML Architecture.png
│
├── logs/
│
├── Network_Data/
│   └── phisingData.csv
│
├── networksecurity/
│   ├── cloud/
│   ├── components/
│   ├── constant/
│   ├── entity/
│   ├── exception/
│   ├── logging/
│   ├── pipeline/
│   ├── utils/
│   └── __init__.py
│
├── notebook/
│
├── venv/
│
├── .env
├── .gitignore
├── Dockerfile
├── push_data.py
├── README.md
├── requirements.txt
├── setup.py
└── test_mongodb.py
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kalakanhuswain18-hub/networksecurity.git
```

### 2. Navigate to the Project Directory

```bash
cd networksecurity
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

## 🔐 MongoDB Atlas Configuration

This project uses MongoDB Atlas for cloud-based data storage.

Create a `.env` file in the root directory:

```env
MONGO_DB_USERNAME=your_username
MONGO_DB_PASSWORD=your_password
MONGO_DB_CLUSTER=your_cluster.mongodb.net
```

**Security Note:** Never commit your `.env` file or expose database credentials publicly.

## 🚀 Running the Project

### Run Data Ingestion

```bash
python push_data.py
```

The script performs the following operations:

1. Loads the phishing website CSV dataset.
2. Establishes a connection with MongoDB Atlas.
3. Converts dataset records into MongoDB-compatible documents.
4. Inserts records into the configured collection.
5. Displays the number of successfully inserted records.

### MongoDB Database Details

| Property | Value |
|---|---|
| Database | `NetworkSecurity` |
| Collection | `network_data` |
| Uploaded Documents | 11,055 |
| Database Platform | MongoDB Atlas |

## 📈 Current Project Progress

- [x] Project structure setup
- [x] Python environment setup
- [x] MongoDB Atlas configuration
- [x] MongoDB connection testing
- [x] CSV dataset loading
- [x] Data ingestion script
- [x] Bulk data upload
- [x] 11,055 records uploaded successfully
- [x] Project architecture documentation

## 🔮 Future Enhancements

- [ ] Schema validation
- [ ] Data preprocessing and cleaning
- [ ] Feature engineering
- [ ] Train-test data splitting
- [ ] Machine learning model development
- [ ] Model evaluation and optimization
- [ ] Phishing prediction API
- [ ] Web-based monitoring dashboard
- [ ] Model tracking with MLflow
- [ ] Docker-based deployment

## 🎯 Project Goal

The primary goal is to develop a modular and scalable phishing website detection system that can analyze website-related security features and identify potentially malicious websites using machine learning.

## 👨‍💻 Author

**Kalakanhu Swain**

- GitHub: [@kalakanhuswain18-hub](https://github.com/kalakanhuswain18-hub)

---

<p align="center">
  <b>⭐ If you find this project interesting, consider giving it a star!</b>
</p>