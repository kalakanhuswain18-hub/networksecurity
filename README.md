
# 🛡️ Network Security – Phishing Website Detection

<p align="center">
  <b>A Machine Learning-based phishing website detection system built using Python, MySQL, and Scikit-learn.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-blue?logo=python" />
  <img src="https://img.shields.io/badge/MySQL-Database-blue?logo=mysql" />
  <img src="https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-orange?logo=scikitlearn" />
  <img src="https://img.shields.io/badge/Status-Deployed-brightgreen" />
</p>
<br/>
<br/>


<p align="center">
  <a href="https://networksecurity-seven.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_LIVE_DEMO-OPEN_PROJECT-brightgreen?style=for-the-badge" />
  </a>
</p>

---

## 📌 Project Overview

Network Security – Phishing Website Detection is a machine learning project designed to identify potentially malicious websites using website-related security features.

The project implements an end-to-end machine learning pipeline that retrieves phishing website data from a MySQL database, validates and transforms the dataset, and trains multiple classification models.

The dataset contains **11,055 records and 31 features** related to URL characteristics, SSL certificates, domain information, web traffic, and other website security indicators.

## 🏗️ Project Architecture

<p align="center">
  <img src="docs/MySQL%20Phishing%20Detection%20Pipeline.png" alt="MySQL-based Network Security Project Architecture" width="100%" />
</p>

## ✨ Key Features

- MySQL database integration
- CSV dataset ingestion using Pandas
- Automated data ingestion pipeline
- Data validation and schema checking
- Data drift detection
- Data preprocessing and transformation
- Missing value handling using KNN Imputer
- Train-test data splitting
- Multiple machine learning model training
- Model evaluation using classification metrics
- Model serialization using Pickle
- Modular project architecture
- Logging and exception handling

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Pandas | Data loading and manipulation |
| NumPy | Numerical operations |
| Scikit-learn | Machine learning and preprocessing |
| MySQL | Relational database |
| mysql-connector-python | MySQL integration |
| Python-dotenv | Environment configuration |
| PyYAML | Schema and configuration management |
| Git & GitHub | Version control |
| Jupyter Notebook | Data exploration |

## 📊 Dataset Information

| Attribute | Details |
|---|---|
| Dataset Name | Phishing Website Dataset |
| Total Records | 11,055 |
| Total Features | 31 |
| File Format | CSV |
| Target Column | `Result` |
| Dataset File | `phisingData.csv` |
| Database | `NetworkSecurity` |
| Table | `network_data` |

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
├── data_schema/
│   └── schema.yaml
│
├── docs/
│   └── Phishing Detection ML Architecture.png
│
├── Network_Data/
│   └── phisingData.csv
│
├── networksecurity/
│   ├── components/
│   │   ├── data_ingestion.py
│   │   ├── data_validation.py
│   │   ├── data_transformation.py
│   │   └── model_trainer.py
│   │
│   ├── constant/
│   ├── entity/
│   ├── exception/
│   ├── logging/
│   ├── pipeline/
│   └── utils/
│       └── ml_utils/
│
├── insert_data_mysql.py
├── test_mysql.py
├── main.py
├── requirements.txt
├── setup.py
├── Dockerfile
├── .gitignore
└── README.md
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

## 🗄️ MySQL Database Configuration

This project uses MySQL as its relational database to store phishing website records.

### 1. Create Database

Open MySQL Workbench and execute:

```sql
CREATE DATABASE NetworkSecurity;
```

### 2. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=NetworkSecurity
```

Replace `your_mysql_password` with your actual MySQL password.

**Security Note:** Never commit your `.env` file or expose database credentials publicly.

### 3. Database Details

| Property | Value |
|---|---|
| Database | `NetworkSecurity` |
| Table | `network_data` |
| Database Platform | MySQL |
| Total Records | 11,055 |

## 🚀 Running the Project

### Step 1: Insert Dataset into MySQL

Upload the phishing dataset into MySQL:

```bash
python insert_data_mysql.py
```

### Step 2: Test MySQL Connection

```bash
python test_mysql.py
```

Expected output:

```text
MySQL Connected Successfully!
```

### Step 3: Run the Machine Learning Pipeline

```bash
python main.py
```

The pipeline performs the following operations:

1. Connects to the MySQL database.
2. Retrieves records from the `network_data` table.
3. Splits the dataset into training and testing sets.
4. Validates the dataset using the defined schema.
5. Generates a data drift report.
6. Handles missing values and transforms features.
7. Trains multiple machine learning classification models.
8. Evaluates trained models.
9. Saves the trained model and preprocessing object.

## 🤖 Machine Learning Models

The model training component evaluates the following classification algorithms:

- Random Forest Classifier
- Decision Tree Classifier
- Gradient Boosting Classifier
- Logistic Regression
- AdaBoost Classifier

### Model Evaluation Metrics

Models are evaluated using:

- F1 Score
- Precision
- Recall

The best-performing model is selected through the model evaluation process.

## 📦 Pipeline Artifacts

The pipeline generates artifacts for different stages of execution:

```text
Artifacts/
│
└── <timestamp>/
    │
    ├── data_ingestion/
    │   └── ingested/
    │       ├── train.csv
    │       └── test.csv
    │
    ├── data_validation/
    │   ├── validated/
    │   └── drift_report/
    │
    ├── data_transformation/
    │   ├── preprocessor.pkl
    │   ├── train.npy
    │   └── test.npy
    │
    └── model_trainer/
        └── trained_model/
            └── model.pkl
```

Generated artifacts are stored locally and excluded from Git version control.

## 📈 Current Project Progress

- [x] Project structure setup
- [x] Python environment setup
- [x] MySQL database configuration
- [x] MySQL connection testing
- [x] CSV dataset loading
- [x] 11,055 records inserted into MySQL
- [x] MySQL-based data ingestion
- [x] Data validation
- [x] Data drift detection
- [x] Data transformation
- [x] Train-test splitting
- [x] Multiple model training
- [x] Model evaluation
- [x] Model serialization

## 🔮 Future Enhancements

- [ ] Advanced feature engineering
- [ ] Hyperparameter optimization
- [ ] Model performance monitoring
- [ ] Phishing prediction API using FastAPI
- [ ] Web-based monitoring dashboard
- [ ] Model tracking with MLflow
- [ ] Docker-based deployment
- [ ] Cloud deployment

## 🎯 Project Goal

The primary goal is to develop a modular and scalable phishing website detection system that analyzes website-related security features and classifies websites as legitimate or phishing using machine learning.

## 👨‍💻 Author

**Kalakanhu Swain**

- GitHub: [@kalakanhuswain18-hub](https://github.com/kalakanhuswain18-hub)

---

<p align="center">
  <b>⭐ If you find this project interesting, consider giving it a star!</b>
</p>
