import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import JobCard from "../components/common/JobCard";
import { CardSkeleton, EmptyState, Pagination } from "../components/common/Spinner";
import { jobsApi } from "../services/api";
import { useDebounce } from "../hooks";
import toast from "react-hot-toast";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const WORK_MODES = ["REMOTE", "HYBRID", "ON_SITE"];
const EXP_LEVELS = ["ENTRY", "MID", "SENIOR", "LEAD"];

export default function Jobs() {
  const [jobs,     setJobs]     = useState([]);
  const [meta,     setMeta]     = useState({ totalPages: 0, totalElements: 0 });
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(0);
  const [sideOpen, setSideOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "", location: "", jobType: "", workMode: "", experienceLevel: "", salaryMin: "", salaryMax: "",
  });

  const debouncedKeyword  = useDebounce(filters.keyword,  500);
  const debouncedLocation = useDebounce(filters.location, 500);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page, size: 12,
        ...(debouncedKeyword  && { keyword:        debouncedKeyword }),
        ...(debouncedLocation && { location:        debouncedLocation }),
        ...(filters.jobType   && { jobType:          filters.jobType }),
        ...(filters.workMode  && { workMode:         filters.workMode }),
        ...(filters.experienceLevel && { experienceLevel: filters.experienceLevel }),
        ...(filters.salaryMin && { salaryMin: Number(filters.salaryMin) }),
        ...(filters.salaryMax && { salaryMax: Number(filters.salaryMax) }),
      };
      const res = await jobsApi.search(params);
      const data = res.data.data;
      setJobs(data.content);
      setMeta({ totalPages: data.totalPages, totalElements: data.totalElements });
    } catch { toast.error("Failed to load jobs"); }
    finally { setLoading(false); }
  }, [page, debouncedKeyword, debouncedLocation, filters.jobType, filters.workMode, filters.experienceLevel, filters.salaryMin, filters.salaryMax]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(0); }, [debouncedKeyword, debouncedLocation]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const clearFilters = () => setFilters({ keyword: "", location: "", jobType: "", workMode: "", experienceLevel: "", salaryMin: "", salaryMax: "" });
  const activeFilterCount = Object.values(filters).filter(v => v !== "" && v !== filters.keyword).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text)] mb-1">Browse Jobs</h1>
        <p className="text-[var(--text-muted)] text-sm">
          {meta.totalElements > 0 ? `${meta.totalElements.toLocaleString()} opportunities found` : "Searching…"}
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={filters.keyword} onChange={e => setFilter("keyword", e.target.value)}
            placeholder="Job title, company, or skills…" className="input pl-11 h-11" />
          {filters.keyword && (
            <button onClick={() => setFilter("keyword", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]">
              <X size={15} />
            </button>
          )}
        </div>
        <div className="relative hidden sm:block">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={filters.location} onChange={e => setFilter("location", e.target.value)}
            placeholder="Location…" className="input pl-10 h-11 w-44" />
        </div>
        <button onClick={() => setSideOpen(o => !o)}
          className={`btn-secondary h-11 relative ${activeFilterCount > 0 ? "border-brand-500 text-brand-600" : ""}`}>
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="btn-ghost h-11 text-red-500 hover:text-red-600">
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        {sideOpen && (
          <aside className="w-60 flex-shrink-0 animate-slide-in">
            <div className="card p-5 sticky top-20 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[var(--text)] text-sm">Filters</h3>
                <button onClick={() => setSideOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                  <X size={15} />
                </button>
              </div>

              <FilterSection label="Job Type">
                {JOB_TYPES.map(t => (
                  <FilterChip key={t} label={t.replace("_", " ")} active={filters.jobType === t}
                    onClick={() => setFilter("jobType", filters.jobType === t ? "" : t)} />
                ))}
              </FilterSection>

              <FilterSection label="Work Mode">
                {WORK_MODES.map(m => (
                  <FilterChip key={m} label={m.replace("_", " ")} active={filters.workMode === m}
                    onClick={() => setFilter("workMode", filters.workMode === m ? "" : m)} />
                ))}
              </FilterSection>

              <FilterSection label="Experience">
                {EXP_LEVELS.map(l => (
                  <FilterChip key={l} label={l} active={filters.experienceLevel === l}
                    onClick={() => setFilter("experienceLevel", filters.experienceLevel === l ? "" : l)} />
                ))}
              </FilterSection>

              <FilterSection label="Salary (₹ LPA)">
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.salaryMin}
                    onChange={e => setFilter("salaryMin", e.target.value)}
                    className="input py-1.5 px-3 text-xs w-1/2" min={0} />
                  <input type="number" placeholder="Max" value={filters.salaryMax}
                    onChange={e => setFilter("salaryMax", e.target.value)}
                    className="input py-1.5 px-3 text-xs w-1/2" min={0} />
                </div>
              </FilterSection>
            </div>
          </aside>
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState title="No jobs found" message="Try adjusting your filters or search term." />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map(job => <JobCard key={job.id} job={job} onSaveToggle={fetch} />)}
              </div>
              <Pagination page={page} totalPages={meta.totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
        active
          ? "bg-brand-600 text-white border-brand-600"
          : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400 hover:text-brand-600"
      }`}>
      {label}
    </button>
  );
}
