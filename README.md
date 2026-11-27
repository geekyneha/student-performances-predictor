# GradeSense

## Intelligent Academic Grade Prediction Using Machine Learning

GradeSense is an academic machine-learning project that demonstrates how
student, family, and study-habit data can be used to estimate GPA and grade
category. Enter a student profile in the dashboard to request a prediction from
the Flask API.

### Project author

- **Name:** Neha Khan
- **University:** Amity University Noida

> **Academic demonstration only:** predictions are estimates for learning and
> discussion. They are not a substitute for educator judgment and must not be
> used for admissions, disciplinary, funding, or other high-stakes decisions.

## Project overview

The application has a responsive browser dashboard and a Flask REST API. When
the API starts, it loads `Student_performance_data.csv`, creates training and
test splits, scales features, and trains two scikit-learn models:

- **K-nearest neighbors regressor (KNN)** estimates GPA.
- **Gaussian Naive Bayes (GaussianNB)** predicts grade class; the API maps the
  predicted class to a letter grade and description.
- **StandardScaler** scales the input features. Each model uses a scaler fit on
  its training split.

The split is 70% training and 30% testing, using random seed `42`. On startup,
the API prints GaussianNB accuracy on the held-out test split. This is a basic
project metric, not an independent or comprehensive model evaluation.

The dashboard inputs include age, gender, ethnicity, parental education and
support, weekly study time, absences, tutoring, extracurricular activities,
current GPA, and current grade class.

## Run locally

### Requirements

- Python 3 installed
- Git installed (if cloning the repository)
- A terminal and a modern web browser
- Internet access for the first-time Python package installation

### Step 1: Get the project files

If you have not already downloaded the project, clone it and enter its folder:

```bash
git clone https://github.com/geekyneha/student-performances-predictor.git
cd student-performances-predictor
```

If you already have the project folder, open a terminal in that folder instead.
The folder should contain `app.py` and `Student_performance_data.csv`.

### Step 2: Create a Python environment and install dependencies

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

**Windows PowerShell**

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If PowerShell prevents environment activation, you can invoke the environment's
Python directly with `.\.venv\Scripts\python.exe` instead.

### Step 3: Start the prediction API

In the activated environment, from the project root, run:

```bash
python app.py
```

The API trains both models when it starts. Wait for the “Models ready” message;
then leave this terminal running. The API listens at
`http://127.0.0.1:5001`.

### Step 4: Start the dashboard

Open a **second terminal** in the project root. If you use a virtual
environment, activate it in this terminal too. Start a local static web server:

```bash
python -m http.server 8000 --directory public
```

On macOS/Linux, `python3` can be used instead of `python` if necessary. On
Windows, use `py` if `python` is not available:

```powershell
py -m http.server 8000 --directory public
```

Keep both terminals running. The standalone dashboard automatically connects to
the local API when opened on localhost.

### Step 5: Open and use GradeSense

1. Visit [http://localhost:8000](http://localhost:8000) in your browser.
2. Check that the API status indicator says it is connected.
3. Enter the student profile. Use the dropdowns, number field, sliders, and
   Yes/No activity toggles.
4. Click **Predict performance**.
5. Review the predicted GPA and letter grade, along with the entered study
   hours, absences, parental support, and displayed factor bars.
6. Change any inputs and click **Predict performance** again to request a new
   prediction.
7. To stop the local servers, focus each server terminal and press **Ctrl+C**.

### Troubleshooting

- **API offline:** confirm the Flask terminal is still running at port `5001`.
- **Port already in use:** stop the other process using the port or start the
  server on another port and update the dashboard's API URL accordingly.
- **CSV file not found:** run `python app.py` from the project root and confirm
  `Student_performance_data.csv` is present.
- **Missing Python module:** activate `.venv` and rerun
  `python -m pip install -r requirements.txt`.
- **Python command not found:** use `python3` on macOS/Linux or `py` on Windows.

## API endpoints

With the Flask API running:

| Method | Endpoint                           | Purpose                                      |
| ------ | ---------------------------------- | -------------------------------------------- |
| `GET`  | `http://127.0.0.1:5001/`           | Check API availability                       |
| `GET`  | `http://127.0.0.1:5001/model-info` | View model, feature, and dataset information |
| `POST` | `http://127.0.0.1:5001/predict`    | Request GPA and grade predictions            |

Example request body for `POST /predict`:

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

The response contains `gpa`, `gradeClass`, `grade`, and `gradeLabel`. Prediction
values depend on the request inputs and the model trained from the included
dataset.

## React component

`StudentPredictor.jsx` is an alternative dashboard component for an existing
React application. Import and render it from the app entry point:

```jsx
import StudentPredictor from "./StudentPredictor";

function App() {
  return <StudentPredictor />;
}

export default App;
```

The component's `API_URL` constant currently points to the hosted API. To use
the local Flask API, set it to `http://127.0.0.1:5001` and run the Flask server
as described above. The standalone page in `public/` automatically chooses the
local API on localhost.

## Repository contents

| File                           | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| `app.py`                       | Flask API, model training, and prediction endpoints |
| `public/index.html`            | Standalone GradeSense dashboard                     |
| `StudentPredictor.jsx`         | React version of the dashboard                      |
| `Student_performance_data.csv` | Dataset used for local model training               |
| `requirements.txt`             | Python package requirements                         |
| `vercel.json`                  | Static dashboard deployment configuration           |

The local API trains models from the CSV on each start; the saved `.joblib`
files are not needed to run it.

## Deployment

Vercel serves the static dashboard from `public/`; the Flask API remains a
separate service. To deploy the frontend, import the repository into Vercel,
select **Other** as the Framework Preset, set the Output Directory to `public`,
and leave the Build Command empty. The deployed standalone page uses the
configured hosted API.

## Limitations and responsible use

- Models are trained from the provided dataset at API startup. Historical
  patterns may not generalize to all students or educational settings.
- Demographic information is included in model inputs and can affect outputs.
  This project does not perform a fairness or bias audit.
- Displayed factor bars are illustrative and should not be interpreted as
  causal explanations.
- Use the project to explore machine learning concepts, not to make decisions
  about real students.
