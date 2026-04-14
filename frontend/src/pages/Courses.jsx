import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, Clock, ExternalLink, Search, Filter } from "lucide-react";
import { coursesApi } from "../services/api";
import { CardSkeleton, EmptyState, Pagination } from "../components/common/Spinner";

const CATS   = ["All","Frontend","Backend","Full Stack","Cloud","DevOps","AI/ML","Mobile","Computer Science","System Design"];
const LEVELS = ["All","Beginner","Intermediate","Advanced"];
const PRICES = ["All","Free","Freemium","Paid"];
const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fade    = { hidden: { opacity:0, y:20 }, show: { opacity:1, y:0 } };

const GRAD = {
  Frontend: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
  Backend:  "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
  "Full Stack": "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
  Cloud:    "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
  DevOps:   "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
  "AI/ML":  "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
  default:  "from-slate-50 to-gray-50 dark:from-slate-800/30 dark:to-gray-800/30",
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [keyword,setKeyword] = useState("");
  const [cat,    setCat]    = useState("");
  const [level,  setLevel]  = useState("");
  const [price,  setPrice]  = useState("");
  const [page,   setPage]   = useState(0);
  const [meta,   setMeta]   = useState({ totalPages: 0, totalElements: 0 });
  const [loading,setLoading]= useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, size: 12,
      ...(keyword&&{keyword}), ...(cat&&{category:cat}),
      ...(level&&{level}),     ...(price&&{price}) };
    coursesApi.search(params)
      .then(r => { const d=r.data.data; setCourses(d.content); setMeta({totalPages:d.totalPages,totalElements:d.totalElements}); })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [page, keyword, cat, level, price]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [keyword, cat, level, price]);

  return (
    <div className="page">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <BookOpen size={20} className="text-amber-600"/>
          </div>
          <h1 className="section-title">Courses & Learning</h1>
        </div>
        <p className="text-[var(--text-muted)] text-sm">
          {meta.totalElements > 0 ? `${meta.totalElements} courses` : "Top courses to upskill and land your next role"}
        </p>
      </motion.div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={keyword} onChange={e=>setKeyword(e.target.value)}
            placeholder="Search courses or providers…" className="input pl-10 h-11"/>
        </div>
        <button onClick={() => setShowFilters(f=>!f)} className="btn-secondary h-11">
          <Filter size={15}/> Filters
          {[cat,level,price].filter(Boolean).length > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
              {[cat,level,price].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
          className="card p-5 mb-6 grid sm:grid-cols-3 gap-5">
          {[
            { label:"Category", opts:CATS, val:cat, set:setCat },
            { label:"Level",    opts:LEVELS, val:level, set:setLevel },
            { label:"Price",    opts:PRICES, val:price, set:setPrice },
          ].map(({ label, opts, val, set }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {opts.map(o => (
                  <button key={o} onClick={() => set(o==="All"?"":o)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                      (o==="All"&&!val)||val===o
                        ? "bg-brand-600 text-white border-brand-600"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"
                    }`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(0).map((_,i)=><CardSkeleton key={i}/>)}</div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" message="Try different search terms or filters."/>
      ) : (
        <>
          <motion.div initial="hidden" animate="show" variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <motion.a key={c.id} variants={fade} href={c.url} target="_blank" rel="noreferrer"
                className="card-hover group overflow-hidden flex flex-col block">
                <div className={`h-40 bg-gradient-to-br ${GRAD[c.category]||GRAD.default} flex items-center justify-center relative`}>
                  <BookOpen size={36} className="text-amber-400"/>
                  {c.isFeatured && <span className="absolute top-3 left-3 badge-yellow">⭐ Featured</span>}
                  <ExternalLink size={14} className="absolute top-3 right-3 text-[var(--text-subtle)] group-hover:text-brand-500 transition-colors"/>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={c.price==="Free"?"badge-green":c.price==="Freemium"?"badge-yellow":"badge-blue"}>{c.price}</span>
                    <span className="badge-gray">{c.level}</span>
                    {c.category && <span className="badge-purple">{c.category}</span>}
                  </div>
                  <h3 className="font-bold text-[var(--text)] text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors mb-1 flex-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mb-3">{c.provider}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-500 fill-amber-500"/>{c.rating?.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1"><Users size={11}/>{(c.enrolledCount/1000).toFixed(0)}K</span>
                    {c.durationHours && <span className="flex items-center gap-1"><Clock size={11}/>{c.durationHours}h</span>}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
          <Pagination page={page} totalPages={meta.totalPages}
            onChange={p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); }}/>
        </>
      )}
    </div>
  );
}
