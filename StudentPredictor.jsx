import { useState } from "react";

const API_URL = "https://student-performances-predictor.onrender.com";

const SUPPORT_LABELS = ["None", "Low", "Moderate", "High", "Very high"];
const EDU_LABELS = [
  "None",
  "High school",
  "Some college",
  "Bachelor's",
  "Higher",
];

const GRADE_STYLES = {
  A: { bg: "#EAF3DE", color: "#3B6D11" },
  B: { bg: "#E6F1FB", color: "#185FA5" },
  C: { bg: "#FAEEDA", color: "#854F0B" },
  D: { bg: "#FAECE7", color: "#993C1D" },
  F: { bg: "#FCEBEB", color: "#A32D2D" },
};

function ToggleField({ label, field, value, onChange }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        {["No", "Yes"].map((txt, i) => (
          <button
            key={i}
            onClick={() => onChange(field, i)}
            style={{
              ...s.toggleBtn,
              background: value === i ? "#E6F1FB" : "transparent",
              color: value === i ? "#185FA5" : "var(--color-text-secondary)",
              borderColor:
                value === i ? "transparent" : "var(--color-border-tertiary)",
              fontWeight: value === i ? 500 : 400,
            }}
          >
            {txt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SliderField({ label, id, min, max, step, value, onChange, unit }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) =>
            onChange(
              id,
              step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value),
            )
          }
          style={{ flex: 1 }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            minWidth: 40,
            textAlign: "right",
            color: "var(--color-text-primary)",
          }}
        >
          {typeof value === "number" && step < 1 ? value.toFixed(1) : value}
          {unit}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        margin: "1.5rem 0 0.75rem",
      }}
    >
      {children}
    </div>
  );
}

function FactorBar({ name, pct, impact, positive }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          width: 130,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {name}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--color-background-secondary)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.round(pct)}%`,
            height: "100%",
            borderRadius: 3,
            background: positive ? "#3B6D11" : "#A32D2D",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          minWidth: 36,
          color: positive
            ? "var(--color-text-success)"
            : "var(--color-text-danger)",
        }}
      >
        {positive ? "+" : ""}
        {impact.toFixed(2)}
      </span>
    </div>
  );
}

export default function App() {
  const [inp, setInp] = useState({
    Age: 17,
    Gender: 1,
    Ethnicity: 0,
    ParentalEducation: 2,
    StudyTimeWeekly: 10,
    Absences: 5,
    Tutoring: 1,
    ParentalSupport: 2,
    Extracurricular: 0,
    Sports: 0,
    Music: 0,
    Volunteering: 0,
    GPA: 2.5,
    GradeClass: 2,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, val) => setInp((prev) => ({ ...prev, [field]: val }));

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inp),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(
        err.message.includes("fetch")
          ? "API se connect nahi ho pa raha. Render API check karein."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const gradeStyle = result ? GRADE_STYLES[result.grade] || {} : {};

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            Student performance predictor
          </h1>
          <span
            style={{
              fontSize: 11,
              background: "#E6F1FB",
              color: "#185FA5",
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            Live API
          </span>
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            margin: 0,
          }}
        >
          KNN Regressor + GaussianNB — connected to{" "}
          <code
            style={{
              fontSize: 12,
              background: "var(--color-background-secondary)",
              padding: "1px 5px",
              borderRadius: 4,
            }}
          >
            student-performances-predictor.onrender.com
          </code>
        </p>
      </div>

      {/* ── Demographics ── */}
      <SectionTitle>Demographics</SectionTitle>
      <div style={s.grid3}>
        <div style={s.field}>
          <label style={s.label}>Age</label>
          <input
            type="number"
            min={14}
            max={20}
            value={inp.Age}
            onChange={(e) => set("Age", parseInt(e.target.value))}
            style={s.input}
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Gender</label>
          <select
            value={inp.Gender}
            onChange={(e) => set("Gender", parseInt(e.target.value))}
            style={s.input}
          >
            <option value={0}>Female</option>
            <option value={1}>Male</option>
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Ethnicity</label>
          <select
            value={inp.Ethnicity}
            onChange={(e) => set("Ethnicity", parseInt(e.target.value))}
            style={s.input}
          >
            {[0, 1, 2, 3].map((v) => (
              <option key={v} value={v}>
                Group {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Family ── */}
      <SectionTitle>Family background</SectionTitle>
      <div style={s.grid2}>
        <div style={s.field}>
          <label style={s.label}>Parental education</label>
          <select
            value={inp.ParentalEducation}
            onChange={(e) => set("ParentalEducation", parseInt(e.target.value))}
            style={s.input}
          >
            {EDU_LABELS.map((l, i) => (
              <option key={i} value={i}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div style={s.field}>
          <label style={s.label}>Parental support</label>
          <select
            value={inp.ParentalSupport}
            onChange={(e) => set("ParentalSupport", parseInt(e.target.value))}
            style={s.input}
          >
            {SUPPORT_LABELS.map((l, i) => (
              <option key={i} value={i}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Academic ── */}
      <SectionTitle>Academic habits</SectionTitle>
      <div style={s.grid2}>
        <SliderField
          label="Study time (hrs/week)"
          id="StudyTimeWeekly"
          min={0}
          max={40}
          step={0.5}
          value={inp.StudyTimeWeekly}
          onChange={set}
          unit=" hrs"
        />
        <SliderField
          label="Absences (days/year)"
          id="Absences"
          min={0}
          max={30}
          step={1}
          value={inp.Absences}
          onChange={set}
          unit=" days"
        />
      </div>
      <div style={{ ...s.grid2, marginTop: 4 }}>
        <SliderField
          label="GPA (for NB classifier)"
          id="GPA"
          min={0}
          max={4}
          step={0.1}
          value={inp.GPA}
          onChange={set}
          unit=""
        />
        <div style={s.field}>
          <label style={s.label}>Grade class (for NB)</label>
          <select
            value={inp.GradeClass}
            onChange={(e) => set("GradeClass", parseInt(e.target.value))}
            style={s.input}
          >
            <option value={0}>0 — A (Excellent)</option>
            <option value={1}>1 — B (Above avg)</option>
            <option value={2}>2 — C (Average)</option>
            <option value={3}>3 — D (Below avg)</option>
            <option value={4}>4 — F (Failing)</option>
          </select>
        </div>
      </div>
      <div style={{ ...s.grid2, marginTop: 8 }}>
        <ToggleField
          label="Tutoring"
          field="Tutoring"
          value={inp.Tutoring}
          onChange={set}
        />
      </div>

      {/* ── Extracurricular ── */}
      <SectionTitle>Extracurricular activities</SectionTitle>
      <div style={s.grid2}>
        <ToggleField
          label="Extracurricular"
          field="Extracurricular"
          value={inp.Extracurricular}
          onChange={set}
        />
        <ToggleField
          label="Sports"
          field="Sports"
          value={inp.Sports}
          onChange={set}
        />
      </div>
      <div style={s.grid2}>
        <ToggleField
          label="Music"
          field="Music"
          value={inp.Music}
          onChange={set}
        />
        <ToggleField
          label="Volunteering"
          field="Volunteering"
          value={inp.Volunteering}
          onChange={set}
        />
      </div>

      {/* ── Predict Button ── */}
      <button
        onClick={handlePredict}
        disabled={loading}
        style={{
          width: "100%",
          height: 44,
          marginTop: "1.5rem",
          background: loading
            ? "var(--color-background-secondary)"
            : "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-secondary)",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Predicting..." : "Predict performance →"}
      </button>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            background: "#FCEBEB",
            border: "0.5px solid #F09595",
            borderRadius: 8,
            fontSize: 13,
            color: "#A32D2D",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* ── Result Card ── */}
      {result && !error && (
        <div
          style={{
            marginTop: "1.5rem",
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 500,
                  lineHeight: 1,
                  color: "var(--color-text-primary)",
                }}
              >
                {result.gpa.toFixed(2)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  marginTop: 4,
                }}
              >
                Predicted GPA (KNN)
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: 40,
                  fontSize: 24,
                  fontWeight: 500,
                  background: gradeStyle.bg,
                  color: gradeStyle.color,
                }}
              >
                {result.grade}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  marginTop: 4,
                }}
              >
                {result.gradeLabel} (NB)
              </div>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid var(--color-border-tertiary)",
              margin: "1rem 0",
            }}
          />

          {/* Metric cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { val: inp.StudyTimeWeekly.toFixed(1), lbl: "Study hrs/wk" },
              { val: inp.Absences, lbl: "Absences" },
              {
                val: SUPPORT_LABELS[inp.ParentalSupport],
                lbl: "Support level",
              },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-background-secondary)",
                  borderRadius: 8,
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {m.val}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    marginTop: 2,
                  }}
                >
                  {m.lbl}
                </div>
              </div>
            ))}
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid var(--color-border-tertiary)",
              margin: "1rem 0",
            }}
          />

          {/* Factor bars */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: 8,
            }}
          >
            Key factor contributions
          </div>
          <FactorBar
            name="Study time"
            pct={(inp.StudyTimeWeekly / 40) * 100}
            impact={(inp.StudyTimeWeekly / 40) * 1.8}
            positive={true}
          />
          <FactorBar
            name="Absences"
            pct={(inp.Absences / 30) * 100}
            impact={-(inp.Absences / 30) * 1.6}
            positive={false}
          />
          <FactorBar
            name="Parental support"
            pct={(inp.ParentalSupport / 4) * 100}
            impact={(inp.ParentalSupport / 4) * 0.5}
            positive={true}
          />
          <FactorBar
            name="Parental edu"
            pct={(inp.ParentalEducation / 4) * 100}
            impact={(inp.ParentalEducation / 4) * 0.35}
            positive={true}
          />
          <FactorBar
            name="Tutoring"
            pct={inp.Tutoring * 100}
            impact={inp.Tutoring * 0.25}
            positive={true}
          />

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid var(--color-border-tertiary)",
              margin: "1rem 0",
            }}
          />

          {/* Model tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "KNN Regressor (k=10)",
              "GaussianNB Classifier",
              "StandardScaler",
              "Real model prediction",
            ].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  color: "var(--color-text-secondary)",
                  background: "var(--color-background-secondary)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const s = {
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 12,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    marginBottom: 12,
  },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, color: "var(--color-text-secondary)" },
  input: {
    height: 36,
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 8,
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)",
    fontSize: 14,
    padding: "0 10px",
    outline: "none",
    width: "100%",
  },
  toggleBtn: {
    padding: "6px 16px",
    borderRadius: 8,
    border: "0.5px solid var(--color-border-tertiary)",
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.12s",
  },
};
