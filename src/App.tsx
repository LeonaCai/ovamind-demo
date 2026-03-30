import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Dna,
  FileText,
  HeartPulse,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Microscope,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type RiskInput = {
  age: number;
  amh: number;
  fsh: number;
  lh: number;
  e2: number;
  irregularCycles: boolean;
  familyHistory: boolean;
  autoimmuneHistory: boolean;
  geneticSignal: boolean;
};

type Contributor = {
  name: string;
  value: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function calculateRisk(input: RiskInput) {
  let score = 8;

  if (input.age >= 35) score += 14;
  else if (input.age >= 30) score += 8;

  if (input.amh < 0.5) score += 24;
  else if (input.amh < 1.0) score += 16;
  else if (input.amh < 1.5) score += 8;

  if (input.fsh >= 25) score += 28;
  else if (input.fsh >= 15) score += 18;
  else if (input.fsh >= 10) score += 10;

  if (input.lh >= 12) score += 6;
  if (input.e2 < 50) score += 10;
  if (input.irregularCycles) score += 14;
  if (input.familyHistory) score += 9;
  if (input.autoimmuneHistory) score += 10;
  if (input.geneticSignal) score += 14;

  const risk = clamp(score, 1, 97);

  const contributors: Contributor[] = [
    { name: "Low AMH", value: input.amh < 1.0 ? 92 : input.amh < 1.5 ? 68 : 28 },
    { name: "Elevated FSH", value: input.fsh >= 25 ? 96 : input.fsh >= 15 ? 75 : input.fsh >= 10 ? 52 : 18 },
    { name: "Cycle irregularity", value: input.irregularCycles ? 78 : 20 },
    { name: "Genetic signal", value: input.geneticSignal ? 71 : 16 },
    { name: "Autoimmune history", value: input.autoimmuneHistory ? 64 : 15 },
    { name: "Family history", value: input.familyHistory ? 58 : 14 },
  ].sort((a, b) => b.value - a.value);

  const tier = risk >= 70 ? "High" : risk >= 40 ? "Moderate" : "Low";

  const summary =
    tier === "High"
      ? "This profile shows a high-risk pattern consistent with early ovarian dysfunction and warrants timely specialist evaluation."
      : tier === "Moderate"
      ? "This profile shows a moderate-risk pattern. Follow-up endocrine evaluation and closer longitudinal monitoring are advisable."
      : "This profile does not currently show a strong high-risk pattern, but periodic monitoring remains valuable if symptoms persist.";

  const nextSteps = [
    risk >= 40 ? "Repeat hormone testing and longitudinal trend monitoring." : "Routine follow-up and symptom tracking.",
    input.geneticSignal || input.familyHistory
      ? "Consider genetic counseling or targeted variant review."
      : "Review menstrual and reproductive history in more detail.",
    input.autoimmuneHistory
      ? "Evaluate endocrine or autoimmune comorbidities."
      : "Discuss fertility preservation timing if clinically indicated.",
  ];

  return { risk, tier, contributors, summary, nextSteps };
}

const presets = {
  low: {
    age: 28,
    amh: 1.8,
    fsh: 8.4,
    lh: 7.3,
    e2: 96,
    irregularCycles: false,
    familyHistory: false,
    autoimmuneHistory: false,
    geneticSignal: false,
  },
  medium: {
    age: 32,
    amh: 0.9,
    fsh: 13.8,
    lh: 10.2,
    e2: 61,
    irregularCycles: true,
    familyHistory: true,
    autoimmuneHistory: false,
    geneticSignal: false,
  },
  high: {
    age: 36,
    amh: 0.3,
    fsh: 28.2,
    lh: 14.7,
    e2: 39,
    irregularCycles: true,
    familyHistory: true,
    autoimmuneHistory: true,
    geneticSignal: true,
  },
};

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function MetricCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mini-card">
      <div className="mini-title">
        {icon}
        <span>{title}</span>
      </div>
      <div className="mini-subtitle">{subtitle}</div>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState<RiskInput>(presets.medium);
  const [lastRun, setLastRun] = useState<RiskInput>(presets.medium);
  const [tab, setTab] = useState<"demo" | "workflow" | "innovation" | "report">("demo");

  const result = useMemo(() => calculateRisk(lastRun), [lastRun]);

  const report = `OvaMind AI – prototype decision support summary

Estimated risk tier: ${result.tier}
Risk score: ${result.risk}/100

Model-style explanation:
${result.summary}

Top contributors:
1. ${result.contributors[0].name}
2. ${result.contributors[1].name}
3. ${result.contributors[2].name}

Recommended next steps:
- ${result.nextSteps[0]}
- ${result.nextSteps[1]}
- ${result.nextSteps[2]}

Note: This is a visual product demo designed to illustrate workflow, interpretability, and user experience. It is not a diagnostic system.`;

  return (
    <div className="page-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-grid" />

      <main className="container">
        <motion.section
          className="hero-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass hero-card">
            <div className="hero-head">
              <div className="hero-icon">
                <ShieldPlus size={28} />
              </div>
              <div>
                <div className="badge">Interactive Demo</div>
                <h1>OvaMind AI</h1>
                <p className="hero-text">
                  An AI-inspired early risk stratification and decision-support experience for
                  premature ovarian insufficiency, designed to turn fragmented clinical signals
                  into an interpretable product vision.
                </p>
              </div>
            </div>

            <div className="metrics-grid">
              <MetricCard
                title="Multi-modal input"
                subtitle="Clinical history, hormone markers, family background, genomics-ready signals."
                icon={<Activity size={16} />}
              />
              <MetricCard
                title="Interpretable output"
                subtitle="Risk score, key contributors, and next-step recommendations."
                icon={<Brain size={16} />}
              />
              <MetricCard
                title="Selection-ready"
                subtitle="Built to look like a product, not just a lab prototype."
                icon={<Sparkles size={16} />}
              />
            </div>
          </div>

          <div className="glass side-card">
            <h3>Why this stands out</h3>
            <div className="side-list">
              <div>Not just a model idea — a visible product experience.</div>
              <div>Built around POI burden, early recognition, and decision support.</div>
              <div>Clear path from structured inputs to risk stratification to clinical summary.</div>
              <div>Future-ready for genomics and OpenClaw/LLM explanation layers.</div>
            </div>
          </div>
        </motion.section>

        <section className="tabs-wrap">
          <div className="tabs">
            {["demo", "workflow", "innovation", "report"].map((item) => (
              <button
                key={item}
                className={`tab-btn ${tab === item ? "active" : ""}`}
                onClick={() => setTab(item as typeof tab)}
              >
                {item === "demo" && "Live Demo"}
                {item === "workflow" && "Workflow"}
                {item === "innovation" && "Innovation"}
                {item === "report" && "Generated Report"}
              </button>
            ))}
          </div>

          {tab === "demo" && (
            <div className="demo-grid">
              <div className="glass form-card">
                <div className="section-head">
                  <div className="section-title">
                    <Microscope size={18} />
                    <span>Input patient profile</span>
                  </div>
                  <p>A realistic MVP-style interface for structured POI risk evaluation</p>
                </div>

                <div className="preset-row">
                  <button className="secondary-btn" onClick={() => setInput(presets.low)}>
                    Preset: Low-risk pattern
                  </button>
                  <button className="secondary-btn" onClick={() => setInput(presets.medium)}>
                    Preset: Monitoring case
                  </button>
                  <button className="secondary-btn" onClick={() => setInput(presets.high)}>
                    Preset: High-risk pattern
                  </button>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Age</label>
                    <input
                      type="number"
                      value={input.age}
                      onChange={(e) => setInput({ ...input, age: Number(e.target.value) })}
                    />
                  </div>
                  <div className="field">
                    <label>AMH (ng/mL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={input.amh}
                      onChange={(e) => setInput({ ...input, amh: Number(e.target.value) })}
                    />
                  </div>
                  <div className="field">
                    <label>FSH (IU/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={input.fsh}
                      onChange={(e) => setInput({ ...input, fsh: Number(e.target.value) })}
                    />
                  </div>
                  <div className="field">
                    <label>LH (IU/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={input.lh}
                      onChange={(e) => setInput({ ...input, lh: Number(e.target.value) })}
                    />
                  </div>
                  <div className="field">
                    <label>E2 (pg/mL)</label>
                    <input
                      type="number"
                      step="1"
                      value={input.e2}
                      onChange={(e) => setInput({ ...input, e2: Number(e.target.value) })}
                    />
                  </div>
                  <div className="field full">
                    <label>Clinical note</label>
                    <textarea
                      readOnly
                      value={
                        input.irregularCycles
                          ? "Irregular cycles reported."
                          : "No clear irregular-cycle signal entered."
                      }
                    />
                  </div>
                </div>

                <div className="toggle-grid">
                  {[
                    [
                      "Irregular cycles",
                      input.irregularCycles,
                      () => setInput({ ...input, irregularCycles: !input.irregularCycles }),
                    ],
                    [
                      "Family history",
                      input.familyHistory,
                      () => setInput({ ...input, familyHistory: !input.familyHistory }),
                    ],
                    [
                      "Autoimmune history",
                      input.autoimmuneHistory,
                      () => setInput({ ...input, autoimmuneHistory: !input.autoimmuneHistory }),
                    ],
                    [
                      "Potential genetic signal",
                      input.geneticSignal,
                      () => setInput({ ...input, geneticSignal: !input.geneticSignal }),
                    ],
                  ].map(([label, value, onClick], idx) => (
                    <button
                      key={idx}
                      className={`toggle-box ${value ? "toggle-on" : ""}`}
                      onClick={onClick as () => void}
                    >
                      <div>{label as string}</div>
                      {value ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    </button>
                  ))}
                </div>

                <button className="primary-btn" onClick={() => setLastRun(input)}>
                  Run OvaMind assessment <ArrowRight size={16} />
                </button>
              </div>

              <div className="results-column">
                <motion.div
                  key={result.risk}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="glass result-card"
                >
                  <div className="section-head">
                    <div className="section-title">
                      <Stethoscope size={18} />
                      <span>Model-style output</span>
                    </div>
                    <p>Prototype output for demonstration only</p>
                  </div>

                  <div className="result-grid">
                    <div className="score-panel">
                      <div className="muted">Risk score</div>
                      <div className="score-number">{result.risk}</div>
                      <div className={`risk-pill risk-${result.tier.toLowerCase()}`}>
                        {result.tier} risk
                      </div>
                      <ProgressBar value={result.risk} />
                    </div>

                    <div className="explain-panel">
                      <div className="text-panel">
                        <div className="muted">Interpretation</div>
                        <p>{result.summary}</p>
                      </div>

                      <div className="text-panel">
                        <div className="muted">Top contributors</div>
                        <div className="contrib-list">
                          {result.contributors.slice(0, 4).map((item) => (
                            <div key={item.name}>
                              <div className="contrib-row">
                                <span>{item.name}</span>
                                <span>{item.value}%</span>
                              </div>
                              <ProgressBar value={item.value} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="info-grid">
                  <div className="glass info-card">
                    <div className="section-title">
                      <HeartPulse size={18} />
                      <span>Next-step support</span>
                    </div>
                    <div className="simple-list">
                      {result.nextSteps.map((step, i) => (
                        <div key={i}>{step}</div>
                      ))}
                    </div>
                  </div>

                  <div className="glass info-card">
                    <div className="section-title">
                      <Sparkles size={18} />
                      <span>Demo value</span>
                    </div>
                    <div className="simple-list">
                      <div>Designed to show what the future product feels like.</div>
                      <div>
                        Helps reviewers instantly understand clinical relevance and translational
                        potential.
                      </div>
                      <div>
                        No real training required for the showcase — the interface itself carries
                        the story.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "workflow" && (
            <div>
              <div className="three-grid">
                <div className="glass card-block">
                  <Activity size={24} />
                  <h3>1. Structured input</h3>
                  <p>
                    Age, hormonal measurements, menstrual pattern, family history, autoimmune
                    context, and genomics-ready signals.
                  </p>
                </div>
                <div className="glass card-block">
                  <Microscope size={24} />
                  <h3>2. Risk engine</h3>
                  <p>
                    A model layer converts weak, fragmented early signals into a unified risk
                    estimate and ranked contributors.
                  </p>
                </div>
                <div className="glass card-block">
                  <FileText size={24} />
                  <h3>3. Decision support</h3>
                  <p>
                    The system returns risk category, explanation, and clinician-friendly follow-up
                    suggestions in natural language.
                  </p>
                </div>
              </div>

              <div className="glass pipeline-card">
                <div className="pipeline-grid">
                  {[
                    "Clinical data",
                    "Hormones",
                    "Genomics-ready signals",
                    "Risk stratification",
                    "Explainable support",
                  ].map((label, i) => (
                    <div key={label} className="pipeline-node">
                      <div className="pipeline-index">{i + 1}</div>
                      <div>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "innovation" && (
            <div className="two-grid">
              <div className="glass info-card">
                <div className="section-title">
                  <Dna size={18} />
                  <span>Innovation pillars</span>
                </div>
                <div className="simple-list">
                  <div>
                    <strong>From single markers to integrated reasoning:</strong> combines
                    fragmented signals rather than relying on one hormone alone.
                  </div>
                  <div>
                    <strong>Early risk stratification:</strong> focused on pre-diagnostic
                    opportunity, not only late-stage recognition.
                  </div>
                  <div>
                    <strong>Genomics pathway:</strong> naturally extensible to variant
                    interpretation and candidate-gene features.
                  </div>
                  <div>
                    <strong>Explainable product layer:</strong> clinician-friendly explanations and
                    next-step guidance make the system selection-ready.
                  </div>
                </div>
              </div>

              <div className="glass info-card">
                <div className="section-title">
                  <Brain size={18} />
                  <span>Target users</span>
                </div>
                <div className="user-grid">
                  <div className="user-box">
                    <h4>Primary users</h4>
                    <ul>
                      <li>Gynecologists</li>
                      <li>Reproductive endocrinologists</li>
                      <li>Fertility clinics</li>
                      <li>Women’s health clinics</li>
                    </ul>
                  </div>
                  <div className="user-box">
                    <h4>Secondary beneficiaries</h4>
                    <ul>
                      <li>Women at elevated risk</li>
                      <li>Patients needing earlier referral</li>
                      <li>Clinicians in lower-resource settings</li>
                      <li>Future translational genomics workflows</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "report" && (
            <div className="two-grid-report">
              <div className="glass info-card">
                <div className="section-title">
                  <Sparkles size={18} />
                  <span>Use in a selection setting</span>
                </div>
                <div className="simple-list">
                  <div>
                    “This is a product-style prototype for <strong>OvaMind AI</strong>, designed to
                    illustrate how early POI risk stratification could look in practice.”
                  </div>
                  <div>
                    “Even without a finalized trained model, the demo already shows the full
                    translational arc: structured inputs, interpretable risk output, and actionable
                    decision support.”
                  </div>
                  <div>
                    “The long-term roadmap extends from clinical MVP to genomics-enhanced
                    prediction and, later, to LLM/OpenClaw-style reporting.”
                  </div>
                </div>
              </div>

              <div className="glass info-card">
                <div className="section-title">
                  <FileText size={18} />
                  <span>Auto-generated summary</span>
                </div>
                <textarea className="report-box" readOnly value={report} />
              </div>
            </div>
          )}
        </section>

        <footer className="footer-note">
          Prototype note: this interface is intentionally built as a polished showcase. It
          simulates the workflow and explanation style of the proposed product, while avoiding
          claims of clinical deployment or diagnostic validity.
        </footer>
      </main>
    </div>
  );
}