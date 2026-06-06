import "./App.css";
import { useState, useEffect, createContext, useContext } from "react";

// ─── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─── Constants ───────────────────────────────────────────────────────────────
const DOMAINS = [
  { id: "saas", label: "SaaS", icon: "⬡", color: "#6EE7F7" },
  { id: "ai", label: "AI & Automation", icon: "◈", color: "#A78BFA" },
  { id: "edtech", label: "EdTech", icon: "◉", color: "#FCD34D" },
  { id: "healthtech", label: "HealthTech", icon: "✦", color: "#6EE7B7" },
  { id: "fintech", label: "FinTech", icon: "◆", color: "#FCA5A5" },
  { id: "ecommerce", label: "E-Commerce", icon: "▣", color: "#FDBA74" },
  { id: "agritech", label: "AgriTech", icon: "❋", color: "#86EFAC" },
  { id: "greentech", label: "GreenTech", icon: "◍", color: "#67E8F9" },
  { id: "logistics", label: "Logistics", icon: "⬢", color: "#C4B5FD" },
  { id: "media", label: "Media & Content", icon: "◐", color: "#F9A8D4" },
  { id: "travel", label: "Travel & Tourism", icon: "◈", color: "#93C5FD" },
  { id: "foodtech", label: "FoodTech", icon: "✿", color: "#FDE68A" },
];

const QUESTIONS = [
  // Skills (1–8)
  { id: 1, category: "Skills", text: "How comfortable are you with writing code or building software?", options: ["Not at all", "Basic understanding", "Proficient", "Expert-level"] },
  { id: 2, category: "Skills", text: "How strong are your data analysis or research skills?", options: ["Weak", "Developing", "Solid", "Advanced"] },
  { id: 3, category: "Skills", text: "How would you rate your sales & marketing ability?", options: ["Minimal", "Learning", "Comfortable", "My strength"] },
  { id: 4, category: "Skills", text: "Do you have experience managing projects or teams?", options: ["None", "Some", "Regular", "Extensive"] },
  { id: 5, category: "Skills", text: "How strong is your financial/business modelling skill?", options: ["Weak", "Basic", "Good", "Expert"] },
  { id: 6, category: "Skills", text: "Rate your design or UX thinking ability:", options: ["None", "Basic taste", "Good eye", "Designer-level"] },
  { id: 7, category: "Skills", text: "How well can you communicate complex ideas clearly?", options: ["Struggle", "Getting better", "Comfortable", "Very strong"] },
  { id: 8, category: "Skills", text: "Do you have domain expertise in a specific industry?", options: ["No", "General knowledge", "Moderate depth", "Deep expertise"] },

  // Interests (9–16)
  { id: 9, category: "Interests", text: "Which area excites you most right now?", options: ["AI / Tech", "Health / Wellness", "Education", "Finance"] },
  { id: 10, category: "Interests", text: "Are you passionate about sustainability and climate?", options: ["Not really", "Mildly", "Quite a lot", "It's my mission"] },
  { id: 11, category: "Interests", text: "How interested are you in consumer behaviour & shopping?", options: ["Low", "Some", "High", "Obsessed"] },
  { id: 12, category: "Interests", text: "Do you enjoy creating content, media, or storytelling?", options: ["No", "Occasionally", "Often", "Always"] },
  { id: 13, category: "Interests", text: "How drawn are you to food, agriculture, or rural challenges?", options: ["Not at all", "A little", "Moderately", "Deeply"] },
  { id: 14, category: "Interests", text: "Are you excited by travel, hospitality, or tourism experiences?", options: ["Not much", "Somewhat", "A lot", "Passionate about it"] },
  { id: 15, category: "Interests", text: "How interested are you in logistics, supply chains, or delivery?", options: ["Disinterested", "Neutral", "Curious", "Very interested"] },
  { id: 16, category: "Interests", text: "Does automating repetitive tasks with AI excite you?", options: ["Not really", "A bit", "Definitely", "It's my thing"] },

  // Personality (17–23)
  { id: 17, category: "Personality", text: "How do you handle uncertainty and risk?", options: ["Avoid it", "Cautious", "Calculated risk", "Love the thrill"] },
  { id: 18, category: "Personality", text: "Are you more of a builder or a connector?", options: ["Pure builder", "Mostly builder", "Mostly connector", "Pure connector"] },
  { id: 19, category: "Personality", text: "How patient are you with long feedback loops?", options: ["Very impatient", "Somewhat", "Patient", "Very patient"] },
  { id: 20, category: "Personality", text: "Do you prefer working alone or with a team?", options: ["Solo", "Mostly solo", "Mostly team", "Large team"] },
  { id: 21, category: "Personality", text: "How do you approach problem-solving?", options: ["Intuition", "Trial & error", "Systematic", "Research-driven"] },
  { id: 22, category: "Personality", text: "How resilient are you after failures?", options: ["It hits hard", "I recover slowly", "I bounce back", "Failures fuel me"] },
  { id: 23, category: "Personality", text: "What motivates you most?", options: ["Money", "Impact", "Recognition", "Learning"] },

  // Resources (24–30)
  { id: 24, category: "Resources", text: "What is your current savings runway?", options: ["< 3 months", "3–6 months", "6–12 months", "12+ months"] },
  { id: 25, category: "Resources", text: "Do you have access to co-founders or a core team?", options: ["None", "Maybe one person", "1–2 confirmed", "Team ready"] },
  { id: 26, category: "Resources", text: "How large is your relevant professional network?", options: ["Very small", "Small but targeted", "Decent", "Strong network"] },
  { id: 27, category: "Resources", text: "Do you have access to early customers or pilot users?", options: ["No", "A few contacts", "A small group", "Yes, ready to test"] },
  { id: 28, category: "Resources", text: "What is your time commitment?", options: ["< 10 hrs/week", "10–20 hrs/week", "20–40 hrs/week", "Full-time"] },
  { id: 29, category: "Resources", text: "Do you have mentors or advisors in the startup space?", options: ["None", "One", "A couple", "Strong advisory board"] },
  { id: 30, category: "Resources", text: "Have you validated any startup idea with real users before?", options: ["Never", "Thought experiments", "One attempt", "Multiple validations"] },
];

// ─── Scoring Engine ───────────────────────────────────────────────────────────
function computeScores(answers) {
  const scores = Object.fromEntries(DOMAINS.map(d => [d.id, 0]));

  const add = (domain, pts) => { scores[domain] += pts; };

  // Q1 – coding skill
  const q1 = answers[0] ?? 0;
  if (q1 >= 2) { add("saas", 8 + q1 * 4); add("ai", 6 + q1 * 3); }
  if (q1 === 1) { add("ecommerce", 4); add("media", 3); }

  // Q2 – data analysis
  const q2 = answers[1] ?? 0;
  add("ai", q2 * 5); add("fintech", q2 * 4); add("healthtech", q2 * 3);

  // Q3 – sales & marketing
  const q3 = answers[2] ?? 0;
  add("ecommerce", q3 * 5); add("media", q3 * 4); add("edtech", q3 * 3); add("travel", q3 * 2);

  // Q4 – project management
  const q4 = answers[3] ?? 0;
  add("logistics", q4 * 4); add("saas", q4 * 3); add("fintech", q4 * 2);

  // Q5 – financial skill
  const q5 = answers[4] ?? 0;
  add("fintech", q5 * 6); add("saas", q5 * 3);

  // Q6 – design
  const q6 = answers[5] ?? 0;
  add("media", q6 * 4); add("edtech", q6 * 3); add("saas", q6 * 2); add("travel", q6 * 2);

  // Q9 – area excitement
  const q9 = answers[8] ?? 0;
  if (q9 === 0) { add("ai", 10); add("saas", 8); }
  if (q9 === 1) { add("healthtech", 12); }
  if (q9 === 2) { add("edtech", 12); }
  if (q9 === 3) { add("fintech", 12); }

  // Q10 – sustainability
  const q10 = answers[9] ?? 0;
  add("greentech", q10 * 8); add("agritech", q10 * 5);

  // Q11 – consumer/shopping
  const q11 = answers[10] ?? 0;
  add("ecommerce", q11 * 6); add("foodtech", q11 * 3);

  // Q12 – content creation
  const q12 = answers[11] ?? 0;
  add("media", q12 * 8); add("edtech", q12 * 4);

  // Q13 – food/agri
  const q13 = answers[12] ?? 0;
  add("agritech", q13 * 8); add("foodtech", q13 * 6);

  // Q14 – travel
  const q14 = answers[13] ?? 0;
  add("travel", q14 * 9);

  // Q15 – logistics
  const q15 = answers[14] ?? 0;
  add("logistics", q15 * 9);

  // Q16 – AI automation
  const q16 = answers[15] ?? 0;
  add("ai", q16 * 8); add("saas", q16 * 4);

  // Q17 – risk tolerance → readiness modifier (stored separately)
  // Q24 – runway
  const q24 = answers[23] ?? 0;
  add("saas", q24 * 3); add("ai", q24 * 2);

  // Q28 – time commitment
  const q28 = answers[27] ?? 0;
  Object.keys(scores).forEach(k => add(k, q28 * 2));

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.round((v / total) * 100)])
  );

  // Readiness score
  const readiness = Math.min(100, Math.round(
    ((answers[3] ?? 0) * 5 + (answers[23] ?? 0) * 8 + (answers[24] ?? 0) * 6 +
      (answers[27] ?? 0) * 7 + (answers[28] ?? 0) * 6 + (answers[29] ?? 0) * 5) / 1.2
  ));

  const sorted = Object.entries(pct).sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3).map(([id, pct]) => ({ ...DOMAINS.find(d => d.id === id), pct }));

  // Strengths & gaps
  const skillScore = ((answers[0] ?? 0) + (answers[1] ?? 0) + (answers[5] ?? 0)) / 3;
  const resourceScore = ((answers[23] ?? 0) + (answers[24] ?? 0) + (answers[27] ?? 0)) / 3;

  const strengths = [];
  const gaps = [];
  if (skillScore > 1.5) strengths.push("Technical proficiency"); else gaps.push("Technical skills");
  if ((answers[2] ?? 0) > 1.5) strengths.push("Sales & marketing"); else gaps.push("Go-to-market skills");
  if (resourceScore > 1.5) strengths.push("Resource readiness"); else gaps.push("Resource base");
  if ((answers[21] ?? 0) > 1.5) strengths.push("Resilience & grit"); else gaps.push("Risk resilience");
  if ((answers[6] ?? 0) > 1.5) strengths.push("Communication"); else gaps.push("Communication");

  // Personality type
  const riskPref = answers[16] ?? 0;
  const teamPref = answers[19] ?? 0;
  let personality = "The Methodical Architect";
  if (riskPref >= 2 && teamPref <= 1) personality = "The Lone Visionary";
  else if (riskPref >= 2 && teamPref >= 2) personality = "The Catalyst Leader";
  else if (riskPref <= 1 && teamPref >= 2) personality = "The Collaborative Builder";

  return { top3, readiness, strengths, gaps, personality };
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function HomePage({ onStart }) {
  const [themeMode, setThemeMode] = useState("system");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme = themeMode === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : themeMode;
      root.dataset.theme = effectiveTheme;
      root.dataset.themeMode = themeMode;
    };

    applyTheme();

    if (themeMode === "system") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [themeMode]);

  return (
    <div className="home-page">
      <div className="home-orb orb-1" />
      <div className="home-orb orb-2" />

      <header className="home-header">
        <nav className="home-nav">
          <div className="home-theme-switch">
            <button
              type="button"
              className={`theme-mode-btn ${themeMode === "light" ? "active" : ""}`}
              onClick={() => setThemeMode("light")}
              title="Light mode"
              aria-label="Light mode"
            >
              ☀️
            </button>
            <button
              type="button"
              className={`theme-mode-btn ${themeMode === "dark" ? "active" : ""}`}
              onClick={() => setThemeMode("dark")}
              title="Dark mode"
              aria-label="Dark mode"
            >
              🌙
            </button>
            <button
              type="button"
              className={`theme-mode-btn ${themeMode === "system" ? "active" : ""}`}
              onClick={() => setThemeMode("system")}
              title="System mode"
              aria-label="System mode"
            >
              💻
            </button>
          </div>
          <a href="#domains">Domains</a>
        </nav>
      </header>

      <main className="home-hero">
        <div className="hero-eyebrow">AI-Powered Startup Intelligence</div>
        <h1 className="hero-title">
          Find your<br />
          <span className="title-accent">startup domain.</span>
        </h1>
        <p className="hero-sub">
          AI Startup Advisor helps students and aspiring entrepreneurs discover
          the startup domain best suited to their skills, interests, and mindset.
        </p>
        <button className="btn-primary" onClick={onStart}>
          Begin
          <span className="btn-arrow">→</span>
        </button>
        <div className="hero-stats">
          <div className="stat"><span>30</span>Questions</div>
          <div className="stat-div" />
          <div className="stat"><span>12</span>Domains</div>
          <div className="stat-div" />
          <div className="stat"><span>AI</span>Analysis</div>
        </div>
      </main>

      <section className="domains-strip" id="domains">
        {DOMAINS.map(d => (
          <div key={d.id} className="domain-chip" style={{ "--chip-color": d.color }}>
            <span className="chip-icon">{d.icon}</span>
            {d.label}
          </div>
        ))}
      </section>
    </div>
  );
}

function AssessmentPage({ onComplete, onHome }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(30).fill(null));
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const q = QUESTIONS[current];
  const categories = ["Skills", "Interests", "Personality", "Resources"];
  const catIndex = categories.indexOf(q.category);
  const progress = ((current) / QUESTIONS.length) * 100;

  const choose = (idx) => {
    if (animating) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setAnimating(true);
        setTimeout(() => {
          setCurrent(c => c + 1);
          setSelected(null);
          setAnimating(false);
        }, 300);
      } else {
        onComplete(next);
      }
    }, 400);
  };

  const goBack = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setSelected(answers[current - 1]);
    }
  };

  return (
    <div className="assess-page">
      <div className="assess-top">
        <div className="assess-top-left">
          <button className="btn-ghost small" onClick={onHome}>Home</button>
        </div>
        <div className="assess-top-right">
          <button className="back-btn" onClick={goBack} disabled={current === 0}>← Back</button>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="q-counter">{current + 1} / {QUESTIONS.length}</span>
        </div>
      </div>

      <div className="cat-tabs">
        {categories.map((c, i) => (
          <div key={c} className={`cat-tab ${i === catIndex ? "active" : ""} ${i < catIndex ? "done" : ""}`}>
            {i < catIndex ? "✓" : c}
          </div>
        ))}
      </div>

      <div className={`question-card ${animating ? "slide-out" : "slide-in"}`}>
        <div className="q-category">{q.category}</div>
        <h2 className="q-text">{q.text}</h2>
        <div className="options-grid">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${selected === i ? "selected" : ""}`}
              onClick={() => choose(i)}
            >
              <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultPage({ answers, onRestart }) {
  const result = computeScores(answers);
  const readinessColor = "#3B82F6";

  return (
    <div className="result-page">
      <div className="result-bg-orb" />

      <div className="result-header">
        <h2>Your Startup Profile</h2>
        <button className="btn-ghost small" onClick={onRestart}>Retake</button>
      </div>

      {/* Readiness Score */}
      <section className="card readiness-card">
        <div className="readiness-ring" style={{ "--pct": result.readiness, "--clr": readinessColor }}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" className="ring-bg" />
            <circle cx="60" cy="60" r="50" className="ring-fill"
              style={{ strokeDashoffset: `${314 - (314 * result.readiness) / 100}` }} />
          </svg>
          <div className="ring-label">
            <span className="ring-num">{result.readiness}</span>
            <span className="ring-sub">Readiness</span>
          </div>
        </div>
        <div className="readiness-meta">
          <div className="personality-badge">{result.personality}</div>
          <p className="readiness-desc">
            Your startup readiness score reflects your skills, resources, network, and commitment level.
          </p>
        </div>
      </section>

      {/* Top 3 Domains */}
      <section className="card domains-card">
        <h3 className="card-title">Top Matched Domains</h3>
        <div className="domain-results">
          {result.top3.map((d, i) => (
            <div key={d.id} className="domain-result-item" style={{ "--dc": d.color }}>
              <div className="domain-rank">#{i + 1}</div>
              <div className="domain-info">
                <span className="domain-icon-lg">{d.icon}</span>
                <span className="domain-label">{d.label}</span>
              </div>
              <div className="domain-pct-bar">
                <div className="pct-fill" style={{ width: `${d.pct}%`, background: d.color }} />
              </div>
              <span className="domain-pct-num">{d.pct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths & Gaps */}
      <section className="card sg-card">
        <div className="sg-col">
          <h3 className="card-title">✦ Strengths</h3>
          <ul className="sg-list strengths">
            {result.strengths.map(s => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div className="sg-divider" />
        <div className="sg-col">
          <h3 className="card-title">◌ Areas to Grow</h3>
          <ul className="sg-list gaps">
            {result.gaps.map(g => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </section>

      <div className="result-footer">
        <button className="btn-primary" onClick={onRestart}>Take Assessment Again</button>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | assess | result
  const [answers, setAnswers] = useState([]);

  const handleComplete = (ans) => {
    setAnswers(ans);
    setPage("result");
  };

  return (
    <AppContext.Provider value={{}}>
      <div className="app-shell">
        {page === "home" && <HomePage onStart={() => setPage("assess")} />}
        {page === "assess" && <AssessmentPage onComplete={handleComplete} onHome={() => setPage("home")} />}
        {page === "result" && <ResultPage answers={answers} onRestart={() => setPage("home")} />}
      </div>
    </AppContext.Provider>
  );
}
