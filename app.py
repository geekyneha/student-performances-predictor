from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # React frontend ko allow karta hai

# ── Model Training (server start hote hi ek baar chalega) ──────────────────
print("📚 Model training ho raha hai...")

df = pd.read_csv('Student_performance_data.csv')

# KNN Regressor — GPA predict karta hai
x_reg = df.drop(['StudentID', 'GPA'], axis=1)
y_reg = df['GPA']

x_reg_train, x_reg_test, y_reg_train, y_reg_test = train_test_split(
    x_reg, y_reg, test_size=0.3, random_state=42
)

sc = StandardScaler()
x_reg_train_sc = sc.fit_transform(x_reg_train)
x_reg_test_sc  = sc.transform(x_reg_test)

knn = KNeighborsRegressor(n_neighbors=10)
knn.fit(x_reg_train_sc, y_reg_train)

# GaussianNB Classifier — GradeClass predict karta hai
x_cls = df.drop(['StudentID', 'GradeClass'], axis=1)
y_cls = df['GradeClass']

x_cls_train, x_cls_test, y_cls_train, y_cls_test = train_test_split(
    x_cls, y_cls, test_size=0.3, random_state=42
)

sc2 = StandardScaler()
x_cls_train_sc = sc2.fit_transform(x_cls_train)
x_cls_test_sc  = sc2.transform(x_cls_test)

nb = GaussianNB()
nb.fit(x_cls_train_sc, y_cls_train)

nb_acc = accuracy_score(y_cls_test, nb.predict(x_cls_test_sc))
print(f"✅ Models ready! NB Accuracy: {nb_acc:.2%}")

# Grade labels
GRADE_MAP = {
    0.0: {"grade": "A", "label": "Excellent"},
    1.0: {"grade": "B", "label": "Above average"},
    2.0: {"grade": "C", "label": "Average"},
    3.0: {"grade": "D", "label": "Below average"},
    4.0: {"grade": "F", "label": "Failing"},
}

# ── Routes ──────────────────────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({"status": "ok", "message": "Student Performance API is running!"})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # KNN ke liye features (GradeClass included, GPA excluded)
        reg_features = [[
            data['Age'],
            data['Gender'],
            data['Ethnicity'],
            data['ParentalEducation'],
            data['StudyTimeWeekly'],
            data['Absences'],
            data['Tutoring'],
            data['ParentalSupport'],
            data['Extracurricular'],
            data['Sports'],
            data['Music'],
            data['Volunteering'],
            data['GradeClass'],   # KNN model mein yeh tha
        ]]

        # NB ke liye features (GPA included, GradeClass excluded)
        cls_features = [[
            data['Age'],
            data['Gender'],
            data['Ethnicity'],
            data['ParentalEducation'],
            data['StudyTimeWeekly'],
            data['Absences'],
            data['Tutoring'],
            data['ParentalSupport'],
            data['Extracurricular'],
            data['Sports'],
            data['Music'],
            data['Volunteering'],
            data['GPA'],          # NB model mein yeh tha
        ]]

        # Predictions
        reg_scaled = sc.transform(reg_features)
        gpa = float(knn.predict(reg_scaled)[0])
        gpa = round(max(0.0, min(4.0, gpa)), 2)

        cls_scaled = sc2.transform(cls_features)
        grade_class = float(nb.predict(cls_scaled)[0])

        grade_info = GRADE_MAP.get(grade_class, {"grade": "?", "label": "Unknown"})

        return jsonify({
            "gpa": gpa,
            "gradeClass": grade_class,
            "grade": grade_info["grade"],
            "gradeLabel": grade_info["label"],
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        "knn": {"n_neighbors": 10, "type": "KNeighborsRegressor", "target": "GPA"},
        "nb":  {"type": "GaussianNB", "accuracy": round(nb_acc, 4), "target": "GradeClass"},
        "scaler": "StandardScaler",
        "dataset_size": len(df),
        "features": list(x_reg.columns),
    })


if __name__ == '__main__':
    app.run(debug=False, port=5001)
