# 🧠 Mental Health Prediction

A machine learning web application that predicts a **mental health score** based on demographic information, academic background, social media usage, lifestyle habits, sleep, physical activity, and stress level.

The project uses a **Random Forest Regression** model with a preprocessing pipeline and provides predictions through a **FastAPI REST API**. A responsive **Next.js frontend** can be used to collect user information and display the prediction.

> **Disclaimer:** This project is developed for educational and demonstration purposes. The prediction is not a medical diagnosis or a substitute for professional mental health advice.

---

## 🚀 Features

- 🤖 Machine Learning-based mental health score prediction
- 🌲 Random Forest Regression model
- 🔄 Automated preprocessing pipeline
- ⚡ FastAPI backend
- 🎨 Responsive Next.js frontend
- ✅ Input validation using Pydantic
- 📊 Interactive prediction result
- 🌐 REST API endpoint for predictions
- 🔐 CORS support for frontend-backend communication
- 📱 Responsive UI for desktop, tablet, and mobile

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │    Next.js Frontend │
                    │                     │
                    │  User Input Form    │
                    └──────────┬──────────┘
                               │
                               │ POST /predict
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend  │
                    │                     │
                    │ Input Validation    │
                    │ Data Preparation    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ ML Preprocessing    │
                    │ Pipeline            │
                    │                     │
                    │ Encoding + Scaling  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Random Forest       │
                    │ Regressor           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Predicted Mental    │
                    │ Health Score        │
                    └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Random Forest Regression

### Backend

- FastAPI
- Pydantic
- Uvicorn

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## 📁 Project Structure

A typical project structure is:

```text
Mental_health_Prediction/
│
├── main.py
├── Mental_health_model.pkl
├── requirements.txt
├── README.md
│
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── public/
    ├── package.json
    └── ...
```

---

# 🤖 Machine Learning Model

The project uses a **Random Forest Regressor** to predict the mental health score.

The saved model contains the required preprocessing and machine learning pipeline.

The model takes information such as:

- Age
- Gender
- Country
- Academic level
- Most used social media platform
- Purpose of social media usage
- Average daily usage hours
- Daily unlocks
- Study hours
- Physical activity hours
- Sleep hours per night
- Stress level

and produces:

```text
Predicted Mental Health Score
```

---

# 📋 Input Features

The FastAPI backend accepts the following fields.

| Field | Type | Description |
|---|---|---|
| `age` | Integer | User's age |
| `gender` | String | Male, Female, or Other |
| `country` | String | User's country |
| `academic_level` | String | Undergraduate, Graduate, or High School |
| `most_used_platform` | String | Most frequently used social media platform |
| `purpose_of_use` | String | Main purpose of social media usage |
| `avg_daily_usage_hours` | Float | Average social media usage per day |
| `daily_unlocks` | Integer | Number of daily device/app unlocks |
| `study_hours` | Float | Daily study hours |
| `physical_activity_hours` | Float | Daily physical activity hours |
| `sleep_hours_per_night` | Float | Average sleep per night |
| `stress_level` | String | Low, Medium, High, or Very High |

---

# ⚙️ Backend Setup

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd Mental_health_Prediction
```

---

## 2. Create a virtual environment

### Windows

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

You should see:

```text
(.venv)
```

in your terminal.

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

If you don't have a `requirements.txt` yet:

```bash
python -m pip install fastapi uvicorn pandas numpy joblib scikit-learn
```

---

## ⚠️ Scikit-learn Version

The saved model was created using **scikit-learn 1.7.2**.

To avoid model persistence compatibility warnings, use:

```bash
python -m pip install scikit-learn==1.7.2
```

It is recommended to keep the same scikit-learn version used when the model was trained.

---

# ▶️ Run the FastAPI Backend

Start the development server:

```bash
python -m uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

You can use Swagger UI to test the `/predict` endpoint without the frontend.

---

# 🔮 Prediction API

## Endpoint

```http
POST /predict
```

Full local URL:

```text
http://127.0.0.1:8000/predict
```

---

## Request Body

Example:

```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 6,
  "daily_unlocks": 50,
  "study_hours": 4,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```

---

## Response

Example:

```json
{
  "predicted_mental_health_score": 6.42
}
```

The prediction is returned as a numerical mental health score generated by the machine learning model.

---

# 🔗 Frontend Integration

The Next.js frontend communicates with the FastAPI backend through the `/predict` endpoint.

Recommended environment variable:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend sends:

```text
User Input
    ↓
POST /predict
    ↓
FastAPI
    ↓
ML Model
    ↓
Prediction
    ↓
Frontend Result
```

For production deployment, replace the local API URL with the deployed FastAPI backend URL.

---

# ✅ Input Validation

The backend validates incoming data using Pydantic.

### Age

```text
10 - 100
```

### Average Daily Usage

```text
0 - 24 hours
```

### Study Hours

```text
0 - 24 hours
```

### Physical Activity

```text
0 - 2 hours
```

### Sleep

```text
0 - 24 hours
```

### Daily Unlocks

```text
0 or greater
```

Categorical fields also accept only predefined values.

This prevents invalid data from being passed to the machine learning model.

---

# 🌍 Country Handling

The backend groups countries into the main supported country categories:

```text
Other
India
USA
Canada
Australia
UK
Germany
Turkey
Mexico
France
```

If a country is not included in the predefined list, it is internally grouped as:

```text
Other
```

The frontend can therefore provide a broader country selection while the backend handles the grouping.

---

# 🔒 Privacy

The application should not collect or store unnecessary personal information.

The prediction request contains only the information required by the machine learning model.

This project is intended as an educational machine learning application and should not be used to make medical decisions.

---

# ⚠️ Important Disclaimer

This application provides a **machine learning prediction**, not a medical diagnosis.

The predicted score should not be interpreted as a clinical assessment.

If someone is experiencing mental health difficulties or concerns, they should seek help from a qualified mental health professional.

---

# 🧪 Testing the API with cURL

After starting the backend, you can test the prediction API using:

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 6,
  "daily_unlocks": 50,
  "study_hours": 4,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}'
```

---

# 🧑‍💻 Development

Start the FastAPI backend:

```bash
python -m uvicorn main:app --reload
```

Start the Next.js frontend:

```bash
npm run dev
```

Then open the frontend URL shown by Next.js.

---

# 📌 Future Improvements

Possible improvements include:

- Model performance comparison
- Better model evaluation and tuning
- Explainable ML
- Feature importance visualization
- Prediction history
- User authentication
- Database integration
- Production deployment
- Automated testing
- CI/CD
- Improved model monitoring

---

# 🎯 Project Purpose

This project demonstrates how a machine learning model can be integrated into a real-world web application.

It covers the complete workflow:

```text
Dataset
   ↓
Data Preprocessing
   ↓
Exploratory Data Analysis
   ↓
Feature Engineering
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Model Persistence
   ↓
FastAPI Backend
   ↓
Next.js Frontend
   ↓
Interactive Prediction
```

The main goal is to demonstrate the integration of **Machine Learning + Backend API + Modern Frontend** into a complete application.

---

## 👩‍💻 Author

**Gaganpreet Kaur**

B.Tech Computer Science & Engineering

---

## ⭐ If you found this project useful

Consider giving the repository a ⭐ and exploring the code to understand how the machine learning model is integrated with FastAPI and the frontend.