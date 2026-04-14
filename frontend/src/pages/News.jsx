import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, RefreshCw } from "lucide-react";
import { newsApi } from "../services/api";
import { CardSkeleton, EmptyState, Pagination } from "../components/common/Spinner";

const CATS = ["All","Hiring","Salary","Tech","Startups","WorkTrends","Layoffs","Certifications"];
const COLORS = { Hiring:"badge-green", Salary:"badge-blue", TechNews:"badge-purple",
                 Startups:"badge-orange", WorkTrends:"badge-cyan", Layoffs:"badge-red",
                 Certifications:"badge-yellow", GlobalJobs:"badge-blue", Cybersecurity:"badge-red" };

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function News() {
  const [articles, setArticles] = useState([]);
  const [cat,  setCat]   = useState("");
  const [page, setPage]  = useState(0);
  const [meta, setMeta]  = useState({ totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    newsApi.getAll({ category: cat || undefined, page, size: 12 })
      .then(r => { const d = r.data.data; setArticles(d.content); setMeta({ totalPages: d.totalPages, totalElements: d.totalElements }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [cat]);

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
            <Newspaper size={20} className="text-brand-600" />
          </div>
          <h1 className="section-title">Job Market News</h1>
        </div>
        <p className="text-[var(--text-muted)] text-sm">
          {meta.totalElements > 0 ? `${meta.totalElements} articles` : "Latest hiring trends and tech industry updates"}
        </p>
      </motion.div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map(c => (
          <button key={c}
            onClick={() => setCat(c === "All" ? "" : c)}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all ${
              (c === "All" && !cat) || cat === c
                ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/25"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400 hover:text-brand-600"
            }`}>
            {c}
          </button>
        ))}
        <button onClick={load} className="btn-ghost ml-auto"><RefreshCw size={14}/></button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_,i) => <CardSkeleton key={i}/>)}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState icon={Newspaper} title="No articles found" message="Check back later for the latest job market news." />
      ) : (
        <>
          <motion.div initial="hidden" animate="show" variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(a => (
              <motion.a key={a.id} variants={fade} href={a.url} target="_blank" rel="noreferrer"
                className="card-hover group overflow-hidden block">
                <div className="h-44 bg-gradient-to-br from-brand-50 via-violet-50 to-cyan-50 dark:from-brand-900/20 dark:via-violet-900/20 dark:to-cyan-900/20 flex items-center justify-center relative overflow-hidden">
                  <Newspaper size={40} className="text-brand-300 dark:text-brand-700"/>
                  {a.isFeatured && (
                    <span className="absolute top-3 left-3 badge-blue text-xs">Featured</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={COLORS[a.category] || "badge-gray"}>{a.category}</span>
                    <span className="text-xs text-[var(--text-muted)]">{a.source}</span>
                    <ExternalLink size={11} className="ml-auto text-[var(--text-subtle)] group-hover:text-brand-500 transition-colors"/>
                  </div>
                  <h3 className="font-bold text-[var(--text)] text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors mb-2">
                    {a.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">{a.summary}</p>
                  <p className="text-xs text-[var(--text-subtle)] mt-3">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : ""}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
          <Pagination page={page} totalPages={meta.totalPages}
            onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}
    </div>
  );
}
