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
        minHeight: "100vh",
        width: "100%",
        fontFamily:
          "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .predictor-shell { min-height: 100vh; background: #f5f3fc; color: #20233a; }
        .predictor-sidebar { position: fixed; inset: 0 auto 0 0; z-index: 2; display: flex; width: 248px; flex-direction: column; padding: 30px 18px; background: #17172f; color: #f8f7ff; }
        .predictor-brand { display: flex; align-items: center; gap: 12px; padding: 0 10px 34px; }
        .predictor-mark { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 13px; background: #aaa0f3; color: #17172f; font-size: 19px; font-weight: 800; }
        .predictor-nav-label { padding: 0 12px 10px; color: #8988a7; font-size: 10px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
        .predictor-nav { display: grid; gap: 6px; }
        .predictor-nav a { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; color: #c1c0d7; font-size: 13px; text-decoration: none; transition: background .18s, color .18s; }
        .predictor-nav a:hover, .predictor-nav a:first-child { background: #2b2a49; color: #fff; }
        .predictor-nav a span { width: 20px; color: #aaa0f3; text-align: center; }
        .predictor-sidebar-note { margin-top: auto; padding: 14px; border: 1px solid #353451; border-radius: 12px; color: #aaa9c3; font-size: 11px; line-height: 1.6; }
        .predictor-main { min-height: 100vh; margin-left: 248px; padding: 38px clamp(22px, 4vw, 58px) 56px; }
        .predictor-content { max-width: 1160px; margin: 0 auto; }
        .predictor-content > div:first-of-type { margin-bottom: 28px !important; }
        .predictor-content h1 { margin: 0 0 8px !important; color: #20233a !important; font-size: clamp(26px, 3vw, 34px) !important; font-weight: 700 !important; letter-spacing: -.045em; }
        .predictor-content p { color: #77788c !important; font-size: 14px !important; line-height: 1.6; }
        .predictor-badge { display: inline-flex; padding: 5px 10px; border-radius: 999px; background: #e9e5fb; color: #6656aa; font-size: 10px; font-weight: 700; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .dashboard-panel { min-width: 0; padding: 22px; border: 1px solid #eceaf3; border-radius: 16px; background: #fff; box-shadow: 0 8px 24px rgba(40, 35, 83, .045); }
        .dashboard-panel > div:first-child { margin: 0 0 18px !important; color: #292a40 !important; font-size: 14px !important; font-weight: 700 !important; letter-spacing: -.01em; }
        .dashboard-panel > div[style*="grid"] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 14px !important; margin-bottom: 14px !important; }
        #predictor-demographics > div[style*="grid"] { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .dashboard-panel > div[style*="grid"]:last-child { margin-bottom: 0 !important; }
        .dashboard-panel label { color: #686a80 !important; font-size: 11px !important; font-weight: 600 !important; }
        .dashboard-panel input[type="number"], .dashboard-panel select { width: 100%; height: 42px !important; padding: 0 12px !important; border: 1px solid #e5e3ee !important; border-radius: 9px !important; outline: none; background: #fbfaff !important; color: #25263b !important; font-size: 13px !important; }
        .dashboard-panel input[type="number"]:focus, .dashboard-panel select:focus { border-color: #9584e1 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(149,132,225,.15); }
        .dashboard-panel input[type="range"] { accent-color: #8978dc; }
        .dashboard-panel button { border-radius: 8px !important; font-weight: 600 !important; }
        .dashboard-panel button:hover { filter: brightness(.97); }
        .predictor-main > div > button { height: 50px !important; margin-top: 18px !important; border: 0 !important; border-radius: 12px !important; background: #51458d !important; color: #fff !important; font-weight: 700 !important; box-shadow: 0 7px 16px rgba(81,69,141,.2); }
        .predictor-main > div > button:hover { background: #403775 !important; }
        .predictor-result { padding: 22px !important; border: 1px solid #eceaf3 !important; border-radius: 16px !important; background: #fff !important; box-shadow: 0 8px 24px rgba(40, 35, 83, .045); }
        .predictor-result hr { border-top-color: #efedf5 !important; }
        .predictor-result > div[style*="grid"] > div { border: 1px solid #efedf6; border-radius: 12px !important; background: #faf9fd !important; }
        @media (max-width: 900px) { .predictor-sidebar { width: 210px; } .predictor-main { margin-left: 210px; padding-inline: 25px; } .dashboard-panel { padding: 18px; } #predictor-demographics > div[style*="grid"] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
        @media (max-width: 700px) { .predictor-sidebar { position: static; width: 100%; padding: 13px 18px; } .predictor-brand { padding: 0 2px 12px; } .predictor-mark { width: 34px; height: 34px; } .predictor-nav-label, .predictor-sidebar-note { display: none; } .predictor-nav { display: flex; gap: 5px; overflow-x: auto; } .predictor-nav a { flex: 0 0 auto; padding: 9px 11px; font-size: 11px; } .predictor-main { margin-left: 0; padding: 26px 18px 40px; } }
        @media (max-width: 520px) { .dashboard-grid { grid-template-columns: 1fr; gap: 12px; } .dashboard-panel { padding: 17px; border-radius: 13px; } .dashboard-panel > div[style*="grid"] { gap: 11px !important; } .predictor-main { padding-inline: 14px; } }
        @media (max-width: 360px) { .dashboard-panel > div[style*="grid"] { grid-template-columns: 1fr !important; } }
      `}</style>
      <div className="predictor-shell">
        <aside className="predictor-sidebar">
          <div className="predictor-brand">
            <span className="predictor-mark">G</span>
            <span>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>
                GradeSense
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  color: "#aaa9c3",
                  fontSize: 11,
                }}
              >
                Academic insights
              </span>
            </span>
          </div>
          <div className="predictor-nav-label">Workspace</div>
          <nav className="predictor-nav" aria-label="Dashboard sections">
            <a href="#predictor-overview">
              <span>⌂</span>Overview
            </a>
            <a href="#predictor-demographics">
              <span>◉</span>Student profile
            </a>
            <a href="#predictor-academic">
              <span>▤</span>Academic habits
            </a>
            <a href="#predictor-activities">
              <span>✳</span>Activities
            </a>
          </nav>
          <div className="predictor-sidebar-note">
            Academic insights, made clearer.
            <br />
            Predictions are generated from your student profile.
          </div>
        </aside>
        <main className="predictor-main">
          <div className="predictor-content">
            {/* Header */}
            <div id="predictor-overview" style={{ marginBottom: "2rem" }}>
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
                  Intelligent Academic Grade Prediction Using Machine Learning
                </h1>
                <span className="predictor-badge">Live API</span>
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

            <div className="dashboard-grid">
              {/* ── Demographics ── */}
              <section className="dashboard-panel" id="predictor-demographics">
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
                      onChange={(e) =>
                        set("Ethnicity", parseInt(e.target.value))
                      }
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
              </section>

              {/* ── Family ── */}
              <section className="dashboard-panel">
                <SectionTitle>Family background</SectionTitle>
                <div style={s.grid2}>
                  <div style={s.field}>
                    <label style={s.label}>Parental education</label>
                    <select
                      value={inp.ParentalEducation}
                      onChange={(e) =>
                        set("ParentalEducation", parseInt(e.target.value))
                      }
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
                      onChange={(e) =>
                        set("ParentalSupport", parseInt(e.target.value))
                      }
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
              </section>

              {/* ── Academic ── */}
              <section className="dashboard-panel" id="predictor-academic">
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
                      onChange={(e) =>
                        set("GradeClass", parseInt(e.target.value))
                      }
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
              </section>

              {/* ── Extracurricular ── */}
              <section className="dashboard-panel" id="predictor-activities">
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
              </section>
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
                className="predictor-result"
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
                    {
                      val: inp.StudyTimeWeekly.toFixed(1),
                      lbl: "Study hrs/wk",
                    },
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
        </main>
      </div>
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
