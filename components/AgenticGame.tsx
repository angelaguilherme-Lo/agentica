"use client";

import { useEffect, useMemo, useState } from "react";
import { ELEMENTS, FAMILY_META, MISSIONS, type ElementCard, type FamilyId } from "@/lib/game-data";

type Phase = "understand" | "build" | "run" | "break" | "fix";

const PHASES: { id: Phase; label: string; verb: string }[] = [
  { id: "understand", label: "01", verb: "Understand it" },
  { id: "build", label: "02", verb: "Build it" },
  { id: "run", label: "03", verb: "Run it" },
  { id: "break", label: "04", verb: "Break it" },
  { id: "fix", label: "05", verb: "Fix it" },
];

const FAMILY_ORDER = Object.keys(FAMILY_META) as FamilyId[];

function rankFor(xp: number) {
  if (xp >= 1600) return "Agentic Systems Engineer";
  if (xp >= 1100) return "Orchestrator";
  if (xp >= 700) return "Agent Architect";
  if (xp >= 350) return "Agent Builder";
  if (xp >= 120) return "Prompt Apprentice";
  return "Observer";
}

function getElement(id: string) {
  return ELEMENTS.find((item) => item.id === id);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function scoreBuild(selected: string[], missionIndex: number) {
  const mission = MISSIONS[missionIndex];
  const must = mission.mustHave.filter((id) => selected.includes(id));
  const helpful = mission.helpful.filter((id) => selected.includes(id));
  const missing = mission.mustHave.filter((id) => !selected.includes(id));
  const excess = Math.max(0, selected.length - (mission.mustHave.length + mission.helpful.length + 2));
  const score = clamp(Math.round((must.length / mission.mustHave.length) * 75 + (helpful.length / mission.helpful.length) * 25 - excess * 2), 0, 100);
  return { score, must, helpful, missing };
}

function ComicBurst({ word }: { word: string }) {
  return (
    <svg viewBox="0 0 360 180" aria-hidden="true" className="comic-burst">
      <polygon points="178,8 207,48 258,18 265,68 330,62 293,101 348,128 285,137 296,174 232,150 213,177 181,145 143,176 127,145 62,166 76,127 14,115 72,88 28,48 93,55 99,12 146,48" />
      <text x="180" y="104" textAnchor="middle">{word}</text>
    </svg>
  );
}

function ElementTile({ item, selected, discovered, onClick }: { item: ElementCard; selected: boolean; discovered: boolean; onClick: () => void }) {
  return (
    <button
      className={`element-tile family-${item.family} ${selected ? "selected" : ""} ${discovered ? "discovered" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
      title={`${item.name}: ${item.short}`}
    >
      <span className="atomic-number">{String(item.number).padStart(2, "0")}</span>
      <strong>{item.symbol}</strong>
      <span className="element-name">{item.name}</span>
      <span className="family-tag">{FAMILY_META[item.family].tag}</span>
    </button>
  );
}

function StageRail({ phase }: { phase: Phase }) {
  const current = PHASES.findIndex((p) => p.id === phase);
  return (
    <div className="stage-rail" aria-label="Learning loop">
      {PHASES.map((stage, i) => (
        <div key={stage.id} className={`stage-chip ${i === current ? "active" : ""} ${i < current ? "done" : ""}`}>
          <span>{stage.label}</span>
          <b>{stage.verb}</b>
        </div>
      ))}
    </div>
  );
}

function MiniFlow({ ids, danger = false }: { ids: string[]; danger?: boolean }) {
  return (
    <div className={`mini-flow ${danger ? "danger" : ""}`}>
      {ids.slice(0, 8).map((id, index) => {
        const item = getElement(id);
        if (!item) return null;
        return (
          <div className="flow-node-wrap" key={id}>
            <div className={`flow-node family-${item.family}`}>
              <span>{item.symbol}</span>
              <b>{item.name}</b>
            </div>
            {index < Math.min(ids.length, 8) - 1 && <span className="flow-arrow">→</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function AgenticGame() {
  const [started, setStarted] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("understand");
  const [selected, setSelected] = useState<string[]>([]);
  const [discovered, setDiscovered] = useState<string[]>(["llm", "goal"]);
  const [inspected, setInspected] = useState<string>("llm");
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(false);
  const [toast, setToast] = useState<string>("");

  const mission = MISSIONS[missionIndex];
  const build = useMemo(() => scoreBuild(selected, missionIndex), [selected, missionIndex]);
  const inspectedElement = getElement(inspected) ?? ELEMENTS[0];
  const failureMissing = mission.breakCard.causedBy.filter((id) => !selected.includes(id));
  const riskCount = failureMissing.length;

  useEffect(() => {
    const raw = window.localStorage.getItem("agentica-save-v1");
    if (!raw) return;
    try {
      const save = JSON.parse(raw) as { xp?: number; completed?: string[]; discovered?: string[] };
      setXp(save.xp ?? 0);
      setCompleted(save.completed ?? []);
      setDiscovered(save.discovered?.length ? save.discovered : ["llm", "goal"]);
    } catch {
      // Ignore corrupt local save data.
    }
  }, []);

  useEffect(() => {
    if (!started) return;
    window.localStorage.setItem("agentica-save-v1", JSON.stringify({ xp, completed, discovered }));
  }, [xp, completed, discovered, started]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const inspectElement = (id: string) => {
    setInspected(id);
    if (!discovered.includes(id)) {
      setDiscovered((prev) => [...prev, id]);
      setXp((prev) => prev + 5);
      setToast("ELEMENT DISCOVERED +5 KE");
    }
  };

  const toggleElement = (id: string) => {
    inspectElement(id);
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const nextPhase = () => {
    if (phase === "understand") {
      setPhase("build");
      return;
    }
    if (phase === "build") {
      if (selected.length < 3) {
        setToast("BUILD NEEDS AT LEAST 3 ELEMENTS");
        return;
      }
      setPhase("run");
      return;
    }
    if (phase === "run") {
      setPhase("break");
      return;
    }
    if (phase === "break") {
      setPhase("fix");
    }
  };

  const finishMission = () => {
    const already = completed.includes(mission.id);
    const earned = Math.max(40, build.score + (riskCount === 0 ? 40 : 10));
    if (!already) {
      setXp((prev) => prev + earned);
      setCompleted((prev) => [...prev, mission.id]);
    }
    const nextIndex = (missionIndex + 1) % MISSIONS.length;
    setToast(already ? "MISSION REPLAYED" : `MISSION CLEARED +${earned} KE`);
    window.setTimeout(() => {
      setMissionIndex(nextIndex);
      setPhase("understand");
      setSelected([]);
      setInspected(MISSIONS[nextIndex].mustHave[0]);
    }, 800);
  };

  const resetSave = () => {
    window.localStorage.removeItem("agentica-save-v1");
    setXp(0);
    setCompleted([]);
    setDiscovered(["llm", "goal"]);
    setSelected([]);
    setMissionIndex(0);
    setPhase("understand");
    setToast("LAB RESET");
  };

  if (!started) {
    return (
      <main className="splash-shell">
        <div className="paper-noise" />
        <section className="splash-grid">
          <div className="splash-copy">
            <p className="eyebrow">THE AGENTIC AI PERIODIC TABLE GAME</p>
            <h1>AGENT<span>ICA</span></h1>
            <p className="splash-deck">Artificial intelligence learned to answer. Then we gave it goals, memory, tools and autonomy. That is where things got interesting.</p>
            <div className="sequence-strip" aria-label="Game sequence">
              <b>UNDERSTAND</b><i>→</i><b>BUILD</b><i>→</i><b>RUN</b><i>→</i><b>BREAK</b><i>→</i><b>FIX</b>
            </div>
            <button className="primary-cta" onClick={() => setStarted(true)}>ENTER THE LAB <span>→</span></button>
            <p className="micro-copy">32 elements · 8 missions · local progress save · no account required</p>
            <p className="micro-copy">Designed and developed by Angela Guilherme</p>
          </div>
          <div className="splash-art" aria-label="Comic illustration of an agentic AI laboratory">
            <div className="speed-lines" />
            <div className="hero-panel panel-yellow">
              <div className="robot-head">
                <span className="antenna" />
                <div className="robot-face"><i /><i /></div>
              </div>
              <span className="speech speech-one">GOAL?</span>
            </div>
            <div className="hero-panel panel-teal">
              <div className="gloved-hand">✦</div>
              <span className="speech speech-two">TOOLS!</span>
            </div>
            <div className="hero-panel panel-red">
              <ComicBurst word="RUN!" />
            </div>
            <div className="ink-caption">BUILD IT BRAVE.<br />BREAK IT SAFELY.</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <div className="paper-noise" />
      {toast && <div className="toast">{toast}</div>}

      <header className="topbar">
        <button className="brand-button" onClick={() => setStarted(false)} aria-label="Back to Agentica intro">
          <span>AGENT</span>ICA
        </button>
        <div className="player-stats">
          <span className="stat-pill"><b>{xp}</b> KE</span>
          <span className="stat-pill rank">{rankFor(xp)}</span>
          <span className="stat-pill"><b>{completed.length}</b> / {MISSIONS.length} MISSIONS</span>
        </div>
        <button className="icon-button" onClick={() => setShowLegend(!showLegend)}>{showLegend ? "CLOSE" : "FIELD GUIDE"}</button>
      </header>

      {showLegend && (
        <aside className="field-guide">
          <div>
            <p className="eyebrow">FIELD GUIDE</p>
            <h2>The eight agentic families</h2>
          </div>
          <div className="legend-grid">
            {FAMILY_ORDER.map((family) => (
              <div className={`legend-card family-${family}`} key={family}>
                <b>{FAMILY_META[family].label}</b>
                <span>{FAMILY_META[family].description}</span>
              </div>
            ))}
          </div>
          <button className="text-button" onClick={resetSave}>Reset local game progress</button>
        </aside>
      )}

      <section className="mission-header">
        <div className="mission-copy">
          <p className="eyebrow">{mission.kicker} · {completed.includes(mission.id) ? "CLEARED" : "ACTIVE"}</p>
          <h1>{mission.title}</h1>
          <p>{mission.brief}</p>
        </div>
        <div className="mission-switcher">
          {MISSIONS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => { setMissionIndex(i); setPhase("understand"); setSelected([]); setInspected(m.mustHave[0]); }}
              className={`${i === missionIndex ? "active" : ""} ${completed.includes(m.id) ? "cleared" : ""}`}
              aria-label={`Open ${m.title}`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </section>

      <StageRail phase={phase} />

      <section className="game-board">
        {phase === "understand" && (
          <>
            <section className="panel main-panel understand-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">PHASE 01 · READ THE TERRAIN</p><h2>Understand the elements before you unleash them.</h2></div>
                <p className="panel-note">Click any tile. Every new discovery earns 5 Knowledge Energy.</p>
              </div>
              <div className="periodic-table">
                {FAMILY_ORDER.map((family) => (
                  <div className="family-column" key={family}>
                    <div className={`family-header family-${family}`}><span>{FAMILY_META[family].tag}</span><b>{FAMILY_META[family].label}</b></div>
                    {ELEMENTS.filter((item) => item.family === family).map((item) => (
                      <ElementTile key={item.id} item={item} selected={false} discovered={discovered.includes(item.id)} onClick={() => inspectElement(item.id)} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
            <aside className={`panel detail-panel family-${inspectedElement.family}`}>
              <div className="element-hero">
                <span>{String(inspectedElement.number).padStart(2, "0")}</span>
                <strong>{inspectedElement.symbol}</strong>
                <em>{FAMILY_META[inspectedElement.family].label}</em>
              </div>
              <p className="eyebrow">{inspectedElement.name}</p>
              <h3>{inspectedElement.short}</h3>
              <div className="detail-section"><b>POWER</b><p>{inspectedElement.power}</p></div>
              <div className="detail-section risk"><b>WATCH OUT</b><p>{inspectedElement.risk}</p></div>
              <blockquote>“{inspectedElement.quote}”</blockquote>
              <div className="mission-objective"><b>YOUR MISSION</b><p>{mission.objective}</p></div>
              <button className="primary-cta compact" onClick={nextPhase}>I GET IT. BUILD →</button>
            </aside>
          </>
        )}

        {phase === "build" && (
          <>
            <section className="panel main-panel build-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">PHASE 02 · ARCHITECT MODE</p><h2>Build your agent from the table.</h2></div>
                <div className="score-stamp"><span>LIVE</span><b>{build.score}</b><small>ARCHITECTURE</small></div>
              </div>
              <p className="mission-scenario">{mission.scenario}</p>
              <div className="periodic-table build-table">
                {FAMILY_ORDER.map((family) => (
                  <div className="family-column" key={family}>
                    <div className={`family-header family-${family}`}><span>{FAMILY_META[family].tag}</span><b>{FAMILY_META[family].label}</b></div>
                    {ELEMENTS.filter((item) => item.family === family).map((item) => (
                      <ElementTile key={item.id} item={item} selected={selected.includes(item.id)} discovered={discovered.includes(item.id)} onClick={() => toggleElement(item.id)} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
            <aside className="panel detail-panel build-summary">
              <p className="eyebrow">AGENT REACTOR</p>
              <h3>{selected.length ? `${selected.length} elements armed.` : "The reactor is empty."}</h3>
              <p>{selected.length ? "Your architecture will be tested against the mission — including what you forgot." : "Choose at least three elements. There is no single perfect recipe."}</p>
              <div className="selected-stack">
                {selected.slice(0, 10).map((id) => {
                  const el = getElement(id)!;
                  return <button key={id} className={`selected-token family-${el.family}`} onClick={() => toggleElement(id)}><b>{el.symbol}</b><span>{el.name}</span><i>×</i></button>;
                })}
              </div>
              {selected.length > 10 && <p className="micro-copy">+ {selected.length - 10} more elements</p>}
              <button className="primary-cta compact" onClick={nextPhase}>RUN AGENT →</button>
              <button className="text-button" onClick={() => setSelected([])}>Clear build</button>
            </aside>
          </>
        )}

        {phase === "run" && (
          <section className="panel full-panel run-panel">
            <div className="comic-split">
              <div className="run-copy">
                <p className="eyebrow">PHASE 03 · LIVE SIMULATION</p>
                <h2>Your agent enters the mission.</h2>
                <p>We simulate the architecture you chose. The score is not about memorizing a recipe — it rewards coverage, evidence, control and useful supporting components.</p>
                <div className="big-score"><span>ARCHITECTURE SCORE</span><strong>{build.score}</strong><i>/100</i></div>
              </div>
              <div className="run-art"><ComicBurst word={build.score >= 75 ? "GO!" : "HMM…"} /></div>
            </div>
            <MiniFlow ids={selected} />
            <div className="run-results">
              <div className="result-card good"><b>CORE SYSTEMS ONLINE</b><strong>{build.must.length}/{mission.mustHave.length}</strong><p>{build.must.map((id) => getElement(id)?.name).join(" · ") || "None yet"}</p></div>
              <div className="result-card neutral"><b>SUPPORTING SYSTEMS</b><strong>{build.helpful.length}/{mission.helpful.length}</strong><p>{build.helpful.map((id) => getElement(id)?.name).join(" · ") || "No optional support selected"}</p></div>
              <div className="result-card warning"><b>BLIND SPOTS</b><strong>{build.missing.length}</strong><p>{build.missing.map((id) => getElement(id)?.name).join(" · ") || "No required blind spots detected"}</p></div>
            </div>
            <button className="primary-cta" onClick={nextPhase}>STRESS TEST IT →</button>
          </section>
        )}

        {phase === "break" && (
          <section className="panel full-panel break-panel">
            <div className="break-layout">
              <div className="break-art"><ComicBurst word="KRAK!" /><div className="crack-lines" /></div>
              <div className="break-copy">
                <p className="eyebrow">PHASE 04 · FAILURE INJECTION</p>
                <h2>{mission.breakCard.title}</h2>
                <p className="failure-text">{mission.breakCard.description}</p>
                <div className={`risk-meter risk-${riskCount}`}>
                  <span>BLAST RADIUS</span><div><i style={{ width: `${Math.min(100, 25 + riskCount * 25)}%` }} /></div><b>{riskCount === 0 ? "CONTAINED" : riskCount === 1 ? "ELEVATED" : riskCount === 2 ? "HIGH" : "CRITICAL"}</b>
                </div>
                <div className="diagnostic-box">
                  <b>DIAGNOSTIC</b>
                  {riskCount === 0 ? (
                    <p>Your build already contains the controls this failure normally exploits. Good architecture does not prevent every failure; it reduces how far failure can travel.</p>
                  ) : (
                    <p>The failure found {riskCount} exposed control {riskCount === 1 ? "point" : "points"}: <strong>{failureMissing.map((id) => getElement(id)?.name).join(", ")}</strong>.</p>
                  )}
                </div>
                <button className="primary-cta" onClick={nextPhase}>FIX THE DAMAGE →</button>
              </div>
            </div>
          </section>
        )}

        {phase === "fix" && (
          <section className="panel full-panel fix-panel">
            <div className="fix-header">
              <div><p className="eyebrow">PHASE 05 · ENGINEER THE RECOVERY</p><h2>Fix the system, not just the symptom.</h2><p>Add missing controls, improve your architecture, then ship the lesson.</p></div>
              <div className="score-stamp final"><span>NOW</span><b>{build.score}</b><small>SCORE</small></div>
            </div>
            <MiniFlow ids={selected} danger={riskCount > 0} />
            <div className="fix-grid">
              <div className="fix-card">
                <b>REPAIR TARGETS</b>
                {build.missing.length === 0 ? <p>Core mission coverage complete. You can still add useful supporting elements.</p> : <p>Add the missing elements that matter to the mission.</p>}
                <div className="repair-buttons">
                  {build.missing.map((id) => {
                    const el = getElement(id)!;
                    return <button key={id} className={`repair-button family-${el.family}`} onClick={() => toggleElement(id)}><b>+ {el.symbol}</b><span>{el.name}</span></button>;
                  })}
                  {!build.missing.length && mission.helpful.filter((id) => !selected.includes(id)).map((id) => {
                    const el = getElement(id)!;
                    return <button key={id} className={`repair-button family-${el.family}`} onClick={() => toggleElement(id)}><b>+ {el.symbol}</b><span>{el.name}</span></button>;
                  })}
                </div>
              </div>
              <div className="fix-card lesson-card">
                <b>WHAT THIS MISSION TAUGHT</b>
                <p><strong>Architecture is a set of trade-offs.</strong> Capability without control creates risk; control without useful capability creates bureaucracy. The goal is deliberate agency.</p>
                <p className="quote-line">“Build agents that can act — and systems that know when they should not.”</p>
              </div>
            </div>
            <button className="primary-cta" onClick={finishMission}>{completed.includes(mission.id) ? "REPLAY COMPLETE →" : "LOCK IN LEARNING + NEXT MISSION →"}</button>
          </section>
        )}
      </section>

      <footer className="game-footer">
        <span>AGENTICA · Agentic AI Periodic Table Game</span>
        <span>Designed and developed by Angela Guilherme</span>
        <span>Understand → Build → Run → Break → Fix</span>
      </footer>
    </main>
  );
}
