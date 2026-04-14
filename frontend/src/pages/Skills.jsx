import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Search, DollarSign, Briefcase, ArrowUp } from "lucide-react";
import { skillsApi } from "../services/api";
import Spinner, { EmptyState } from "../components/common/Spinner";

const CATS = ["All","Frontend","Backend","Cloud","DevOps","AI/ML","Mobile","Database","Systems","API","Full Stack"];
const DEMAND_COLOR = { High:"badge-green", Medium:"badge-yellow", Low:"badge-gray" };
const stagger = { show: { transition: { staggerChildren: 0.05 } } };
const fade = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [cat,    setCat]    = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    skillsApi.getAll(cat || undefined)
      .then(r => setSkills(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat]);

  const filtered = skills.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const hotCount = skills.filter(s => s.demandLevel === "High").length;

  return (
    <div className="page">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-600"/>
          </div>
          <h1 className="section-title">Market Skills Pulse</h1>
        </div>
        <p className="text-[var(--text-muted)] text-sm">{hotCount} skills in high demand right now</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label:"Total Skills Tracked", value: skills.length, icon: TrendingUp, color:"text-brand-600 bg-brand-50 dark:bg-brand-900/30" },
          { label:"High Demand Skills",   value: hotCount,       icon: ArrowUp,    color:"text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
          { label:"Avg Top Salary",       value: skills.length ? `₹${((skills.slice(0,5).reduce((a,s)=>a+(s.avgSalary||0),0)/5)/100000).toFixed(0)}L` : "--",
            icon: DollarSign, color:"text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={20}/></div>
            <div><p className="text-xs text-[var(--text-muted)]">{label}</p><p className="text-2xl font-extrabold text-[var(--text)]">{value}</p></div>
          </div>
        ))}
      </motion.div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search skill…" className="input pl-10 h-10 w-52"/>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c === "All" ? "" : c)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                (c==="All"&&!cat)||cat===c
                  ? "bg-brand-600 text-white border-brand-600"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400 hover:text-brand-600"
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size="lg"/></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No skills found" message="Try a different category or search term."/>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <motion.div key={s.id} variants={fade} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-[var(--text)] text-lg">{s.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.category}</p>
                </div>
                <span className={DEMAND_COLOR[s.demandLevel]||"badge-gray"}>{s.demandLevel}</span>
              </div>
              {s.description && <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed line-clamp-2">{s.description}</p>}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-[var(--surface-2)] rounded-xl p-2">
                  <p className="font-bold text-brand-600 text-sm">{s.jobCount?.toLocaleString()}</p>
                  <p className="text-[var(--text-muted)] mt-0.5 flex items-center justify-center gap-0.5"><Briefcase size={10}/> Jobs</p>
                </div>
                <div className="bg-[var(--surface-2)] rounded-xl p-2">
                  <p className="font-bold text-emerald-600 text-sm">+{s.growthPercent?.toFixed(0)}%</p>
                  <p className="text-[var(--text-muted)] mt-0.5 flex items-center justify-center gap-0.5"><TrendingUp size={10}/> Growth</p>
                </div>
                <div className="bg-[var(--surface-2)] rounded-xl p-2">
                  <p className="font-bold text-amber-600 text-sm">₹{s.avgSalary?(s.avgSalary/100000).toFixed(0)+"L":"--"}</p>
                  <p className="text-[var(--text-muted)] mt-0.5 flex items-center justify-center gap-0.5"><DollarSign size={10}/> Avg</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <motion.div className={`h-full rounded-full ${
                  s.demandLevel==="High"?"bg-emerald-500":s.demandLevel==="Medium"?"bg-amber-500":"bg-slate-400"}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((s.jobCount/20000)*100,100)}%` }}
                  transition={{ duration:1.2 }} viewport={{ once: true }}/>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
