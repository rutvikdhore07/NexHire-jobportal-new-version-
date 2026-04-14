import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Upload, CheckCircle, TrendingUp, AlertCircle, Target,
         Sparkles, FileText, Star, X } from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";
import Spinner from "../components/common/Spinner";

export default function AiResume() {
  const [text,     setText]     = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large — max 5MB"); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      // For plain text files read directly; PDF needs server-side parsing
      // We just take the raw text here — user can also paste manually
      setText(ev.target.result || "");
    };
    if (file.type === "text/plain") reader.readAsText(file);
    else toast("📄 PDF detected — please paste your resume text below for analysis", { icon: "ℹ️" });
  };

  const analyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      toast.error("Please paste at least 50 characters of resume content");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post("/ai/resume-analyze", { text });
      setResult(res.data.data);
    } catch (err) {
      toast.error("Analysis failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-red-500";
  const scoreRing  = (s) => s >= 80 ? "stroke-emerald-500" : s >= 60 ? "stroke-amber-500" : "stroke-red-500";

  return (
    <div className="page max-w-4xl">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Brain size={22} className="text-white"/>
          </div>
          <div>
            <h1 className="section-title">AI Resume Analyzer</h1>
            <p className="text-[var(--text-muted)] text-sm">Powered by Google Gemini • 100% Free</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-4">
          {/* File upload */}
          <label className="card p-6 border-2 border-dashed border-[var(--border)] hover:border-violet-400
                             transition-colors cursor-pointer flex flex-col items-center gap-3 group block">
            <input type="file" accept=".txt,.pdf" onChange={handleFile} className="hidden"/>
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center
                            group-hover:scale-110 transition-transform">
              <Upload size={22} className="text-violet-600"/>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--text)] text-sm">Upload Resume</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">.txt file or paste text below</p>
            </div>
            {fileName && <p className="text-xs text-violet-600 font-medium flex items-center gap-1"><FileText size={12}/>{fileName}</p>}
          </label>

          {/* Text paste */}
          <div>
            <label className="label">Or paste resume text here</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={14}
              className="input resize-none font-mono text-xs leading-relaxed"
              placeholder="Paste your resume content here...

John Doe
john@example.com | linkedin.com/in/johndoe

EXPERIENCE
Software Engineer at ABC Corp (2022–2024)
- Built React dashboard serving 50K users
- Reduced API latency by 40% using caching

SKILLS
React, Node.js, PostgreSQL, Docker, AWS

EDUCATION
B.Tech Computer Science, 2022"/>
          </div>

          {/* Word count */}
          {text && (
            <p className="text-xs text-[var(--text-muted)]">
              {text.split(/\s+/).filter(Boolean).length} words · {text.length} chars
            </p>
          )}

          <button onClick={analyze} disabled={loading || !text.trim()}
            className="btn-primary w-full justify-center py-3 text-base">
            {loading
              ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Analyzing…</>
              : <><Sparkles size={18}/>Analyze with AI</>}
          </button>
        </div>

        {/* Results */}
        <div>
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="card p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center mx-auto">
                  <Spinner size="md"/>
                </div>
                <p className="font-semibold text-[var(--text)]">Analyzing your resume…</p>
                <p className="text-sm text-[var(--text-muted)]">AI is reviewing your experience, skills, and achievements</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-5">
                {/* Score */}
                <div className="card p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="2.5"/>
                      <circle cx="18" cy="18" r="15.9" fill="none" className={scoreRing(result.score)}
                        strokeWidth="2.5" strokeDasharray={`${result.score} 100`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-black ${scoreColor(result.score)}`}>{result.score}</span>
                      <span className="text-xs text-[var(--text-muted)]">/ 100</span>
                    </div>
                  </div>
                  <p className="font-bold text-[var(--text)]">Resume Score</p>
                  {result.summary && <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{result.summary}</p>}
                </div>

                {/* Skills */}
                {result.skills?.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                      <Target size={16} className="text-blue-500"/> Skills Detected
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map(s => <span key={s} className="badge-blue">{s}</span>)}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {result.strengths?.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-500"/> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {result.strengths.map(s => (
                        <li key={s} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                          <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0"/>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {result.improvements?.length > 0 && (
                  <div className="card p-5 border-l-4 border-amber-400">
                    <h3 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                      <TrendingUp size={16} className="text-amber-500"/> Improvements
                    </h3>
                    <ul className="space-y-2">
                      {result.improvements.map(s => (
                        <li key={s} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                          <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0"/>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested roles */}
                {result.suggestedRoles?.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                      <Star size={16} className="text-violet-500"/> Suggested Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedRoles.map(r => <span key={r} className="badge-purple">{r}</span>)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!loading && !result && (
              <div className="card p-8 text-center text-[var(--text-muted)]">
                <Brain size={48} className="mx-auto mb-4 opacity-20"/>
                <p className="font-semibold mb-2">Ready to analyze</p>
                <p className="text-sm">Paste your resume text and click Analyze to get detailed AI feedback</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
