"use client";

import { useEffect, useMemo, useState } from "react";

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export const LETTER_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0,
};

export function percentToPoints(pct: number): number {
  if (pct >= 93) return 4.0; if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3; if (pct >= 83) return 3.0; if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3; if (pct >= 73) return 2.0; if (pct >= 70) return 1.7;
  if (pct >= 67) return 1.3; if (pct >= 63) return 1.0; if (pct >= 60) return 0.7;
  return 0.0;
}

interface Course { id: number; name: string; grade: string; credits: string; weight: "regular" | "honors" | "ap" }
let nid = 100;

const WEIGHT_BONUS = { regular: 0, honors: 0.5, ap: 1.0 };

export function standingLabel(gpa: number): string {
  if (gpa >= 3.9) return "Summa-level standing (top honours at most schools)";
  if (gpa >= 3.7) return "Dean's List territory at most colleges (typically ≥ 3.5–3.7)";
  if (gpa >= 3.5) return "Dean's List at many colleges (threshold often 3.5)";
  if (gpa >= 3.0) return "Solid standing — above the common 2.0 good-standing floor";
  if (gpa >= 2.0) return "Good standing at most schools (2.0 is the usual minimum)";
  return "Below the typical 2.0 good-standing line — academic probation risk at many schools";
}

export default function Gpa() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Course 1", grade: "A", credits: "3", weight: "regular" },
    { id: 2, name: "Course 2", grade: "B+", credits: "3", weight: "regular" },
    { id: 3, name: "Course 3", grade: "A-", credits: "4", weight: "regular" },
  ]);
  const [scale, setScale] = useState<"4.0" | "5.0">("4.0");
  const [inputMode, setInputMode] = useState<"letter" | "percent">("letter");
  const [curGpa, setCurGpa] = useState("");
  const [curCredits, setCurCredits] = useState("");
  const [targetGpa, setTargetGpa] = useState("");
  const [planCredits, setPlanCredits] = useState("15");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("frinjo-gpa-courses");
      if (saved) setCourses(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem("frinjo-gpa-courses", JSON.stringify(courses)); } catch { /* ignore */ }
  }, [courses]);

  const result = useMemo(() => {
    let pts = 0, creds = 0;
    for (const c of courses) {
      const cr = Number(c.credits);
      if (!Number.isFinite(cr) || cr <= 0) continue;
      let p = inputMode === "letter" ? LETTER_POINTS[c.grade] : undefined;
      if (inputMode === "percent") {
        const v = Number(c.grade);
        if (!Number.isFinite(v)) continue;
        p = percentToPoints(v);
      }
      if (p === undefined) continue;
      const effective = scale === "5.0" && p > 0 ? Math.min(5.0, p + WEIGHT_BONUS[c.weight]) : p;
      pts += effective * cr;
      creds += cr;
    }
    return creds > 0 ? { gpa: pts / creds, credits: creds } : null;
  }, [courses, inputMode, scale]);

  const plan = useMemo(() => {
    const cg = Number(curGpa), cc = Number(curCredits), tg = Number(targetGpa), pc = Number(planCredits);
    if (!(cg >= 0) || !(cc > 0) || !(tg > 0) || !(pc > 0)) return null;
    const needed = (tg * (cc + pc) - cg * cc) / pc;
    return needed;
  }, [curGpa, curCredits, targetGpa, planCredits]);

  function update(id: number, patch: Partial<Course>) {
    setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function addCourse() {
    setCourses((cs) => [...cs, { id: nid++, name: `Course ${cs.length + 1}`, grade: inputMode === "letter" ? "A" : "90", credits: "3", weight: "regular" }]);
  }
  function exportCsv() {
    const rows = ["course,grade,credits,weight"];
    for (const c of courses) rows.push(`"${c.name}",${c.grade},${c.credits},${c.weight}`);
    if (result) rows.push(`GPA,,${result.gpa.toFixed(2)},`);
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "gpa.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex rounded-full border border-stone-300 overflow-hidden">
              {(["letter", "percent"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setInputMode(m)}
                  className={`px-4 py-2 text-sm font-bold ${inputMode === m ? "bg-stone-900 text-white" : "bg-white text-stone-600"}`}>
                  {m === "letter" ? "Letter grades" : "% grades"}
                </button>
              ))}
            </div>
            <div className="flex rounded-full border border-stone-300 overflow-hidden">
              {(["4.0", "5.0"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setScale(s)}
                  className={`px-4 py-2 text-sm font-bold ${scale === s ? "bg-stone-900 text-white" : "bg-white text-stone-600"}`}>
                  {s} scale
                </button>
              ))}
            </div>
            <span className="text-xs text-stone-400 self-center">Courses auto-save in your browser — come back any time.</span>
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="grid gap-3 sm:grid-cols-[1fr_110px_90px_130px_40px] items-end bg-white border border-stone-200 rounded-2xl p-4">
                <div>
                  <label className="sr-only">Course name</label>
                  <input className={inputCls} value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} placeholder="Course name" />
                </div>
                <div>
                  <label className="sr-only">Grade</label>
                  {inputMode === "letter" ? (
                    <select className={inputCls} value={c.grade} onChange={(e) => update(c.id, { grade: e.target.value })}>
                      {Object.keys(LETTER_POINTS).map((g) => (<option key={g} value={g}>{g}</option>))}
                    </select>
                  ) : (
                    <input type="number" min="0" max="110" className={inputCls} value={c.grade} onChange={(e) => update(c.id, { grade: e.target.value })} placeholder="%" />
                  )}
                </div>
                <div>
                  <label className="sr-only">Credits</label>
                  <input type="number" min="0" step="any" className={inputCls} value={c.credits} onChange={(e) => update(c.id, { credits: e.target.value })} placeholder="Credits" />
                </div>
                <div>
                  <label className="sr-only">Course weight</label>
                  <select className={inputCls} value={c.weight} onChange={(e) => update(c.id, { weight: e.target.value as Course["weight"] })}>
                    <option value="regular">Regular</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap">AP / IB (+1.0)</option>
                  </select>
                </div>
                <button type="button" aria-label="Remove course" onClick={() => setCourses((cs) => cs.filter((x) => x.id !== c.id))}
                  className="w-10 h-10 rounded-full border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-300 font-bold">×</button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={addCourse} className="rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-6 py-2.5 hover:bg-orange-50 transition">+ Add course</button>
            <button type="button" onClick={exportCsv} className="rounded-full bg-stone-900 text-white font-semibold px-6 py-2.5 hover:bg-stone-800 transition">⬇ Export CSV</button>
            <button type="button" onClick={() => { setCourses([{ id: nid++, name: "Course 1", grade: inputMode === "letter" ? "A" : "90", credits: "3", weight: "regular" }]); }} className="rounded-full border border-stone-300 bg-white font-semibold px-6 py-2.5 text-stone-600 hover:border-orange-400 transition">Reset</button>
          </div>

          {result ? (
            <div className="mt-8 text-center">
              <p className="font-display text-7xl font-bold text-stone-900">{result.gpa.toFixed(2)}</p>
              <p className="mt-1 text-stone-500">GPA on a {scale} scale · {result.credits} credits</p>
              <p className="mt-2 font-semibold text-orange-800">{standingLabel(result.gpa)}</p>
              <p className="mt-2 text-xs text-stone-400">Honors/AP weighting applies only on the 5.0 weighted scale in most schools; unweighted GPA ignores it. Grade points: A 4.0, A− 3.7, B+ 3.3, B 3.0, B− 2.7, C+ 2.3, C 2.0, C− 1.7, D+ 1.3, D 1.0, D− 0.7, F 0.</p>
            </div>
          ) : (
            <p className="mt-6 text-center text-stone-400">Add at least one course with credits.</p>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Target GPA planner</h2>
          <p className="mt-1 text-stone-500 text-sm">What average do you need from here to hit your target cumulative GPA?</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <div><label className={labelCls}>Current GPA</label><input type="number" step="any" className={inputCls} value={curGpa} onChange={(e) => setCurGpa(e.target.value)} placeholder="3.20" /></div>
            <div><label className={labelCls}>Credits so far</label><input type="number" step="any" className={inputCls} value={curCredits} onChange={(e) => setCurCredits(e.target.value)} placeholder="60" /></div>
            <div><label className={labelCls}>Target GPA</label><input type="number" step="any" className={inputCls} value={targetGpa} onChange={(e) => setTargetGpa(e.target.value)} placeholder="3.50" /></div>
            <div><label className={labelCls}>Credits planned</label><input type="number" step="any" className={inputCls} value={planCredits} onChange={(e) => setPlanCredits(e.target.value)} /></div>
          </div>
          {plan !== null && (
            <p className="mt-5 font-display text-3xl font-bold text-stone-900">
              {plan > 4.0
                ? <>You would need a {plan.toFixed(2)} average — above a 4.0, so the target is not reachable in that many credits. Add more credits or lower the target.</>
                : plan < 0
                  ? <>Your target is already secured even with straight Fs in those credits — pick a higher target.</>
                  : <>You need a <span className="text-orange-600">{plan.toFixed(2)}</span> average across those {planCredits} credits.</>}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
