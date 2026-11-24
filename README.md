# 🎓 Student Performance Predictor

A full-stack machine learning project that predicts student performance (GPA and grade) using a Flask backend and React frontend.

---

## 📂 Project Structure

- `app.py` → Flask API (Backend)
- `StudentPredictor.jsx` → React Component (Frontend)
- `requirements.txt` → Python Dependencies
- `Student_performance_data.csv` → Dataset
- `knn_model.joblib` → Trained ML Model
- `scaler.joblib` → Data Scaler

---

## ⚙️ Setup Guide

### 🔹 Step 1 — Run Backend (Flask API)

```bash
# Install dependencies
pip install -r requirements.txt

# Make sure dataset is in same folder
# Student_performance_data.csv

# Run server
python app.py
```

Server will start at:
👉 http://localhost:5000

---

### 🔹 API Testing

You can test using Browser or Postman:

```
GET  http://localhost:5000/
GET  http://localhost:5000/model-info
POST http://localhost:5000/predict
```

---

## 🔹 Step 2 — Frontend Setup (React)

### Option A — Existing React Project

```bash
# Copy component into src/
import StudentPredictor from './StudentPredictor';
```

---

### Option B — Create New React App

```bash
npx create-react-app student-app
cd student-app
cp ../StudentPredictor.jsx src/
```

Update `App.js`:

```javascript
import StudentPredictor from "./StudentPredictor";

function App() {
  return <StudentPredictor />;
}

export default App;
```

Run app:

```bash
npm start
```

---

## 📡 API Example

### 🔸 POST `/predict`

#### Request:

```json
{
  "Age": 17,
  "Gender": 1,
  "Ethnicity": 0,
  "ParentalEducation": 2,
  "StudyTimeWeekly": 15,
  "Absences": 5,
  "Tutoring": 1,
  "ParentalSupport": 3,
  "Extracurricular": 0,
  "Sports": 0,
  "Music": 1,
  "Volunteering": 0,
  "GPA": 2.5,
  "GradeClass": 2
}
```

#### Response:

```json
{
  "gpa": 3.12,
  "gradeClass": 1.0,
  "grade": "B",
  "gradeLabel": "Above average"
}
```

---

## ☁️ Deployment (Render - Free)

1. Push project to GitHub
2. Go to Render.com → New Web Service
3. Start command:

   ```bash
   python app.py
   ```

4. Update API URL in frontend:

   ```javascript
   const API_URL = "https://your-app.onrender.com";
   ```

---

## 🚀 Features

- Machine Learning Model (KNN)
- Real-time Prediction API
- React UI Integration
- Scalable Deployment Ready
