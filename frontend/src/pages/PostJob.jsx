import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { jobsApi } from "../services/api";
import toast from "react-hot-toast";

const FIELD = (label, key, type = "text", opts = {}) => ({ label, key, type, ...opts });

export default function PostJob() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const isEdit         = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", company: "", location: "", description: "",
    skillsRequired: "", jobType: "FULL_TIME", workMode: "HYBRID",
    experienceLevel: "MID", industry: "", salaryMin: "", salaryMax: "",
    openings: 1, applicationDeadline: "",
  });

  useEffect(() => {
    if (isEdit) {
      jobsApi.getById(id).then(r => {
        const j = r.data.data;
        setForm({
          title: j.title, company: j.company, location: j.location,
          description: j.description, skillsRequired: j.skillsRequired || "",
          jobType: j.jobType || "FULL_TIME", workMode: j.workMode || "HYBRID",
          experienceLevel: j.experienceLevel || "MID", industry: j.industry || "",
          salaryMin: j.salaryMin || "", salaryMax: j.salaryMax || "",
          openings: j.openings || 1, applicationDeadline: j.applicationDeadline || "",
        });
      }).catch(() => navigate("/dashboard"));
    }
  }, [id, isEdit, navigate]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      openings: Number(form.openings),
      applicationDeadline: form.applicationDeadline || null,
    };
    try {
      if (isEdit) await jobsApi.update(id, payload);
      else        await jobsApi.create(payload);
      toast.success(isEdit ? "Job updated!" : "Job posted successfully!");
      navigate("/dashboard");
    } catch { /* interceptor */ }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
          <Briefcase size={20} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">{isEdit ? "Edit Job" : "Post a New Job"}</h1>
          <p className="text-[var(--text-muted)] text-sm">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {/* Basic Info */}
        <Section title="Basic Information">
          <Field label="Job Title *" required>
            <input className="input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Senior Frontend Engineer" required maxLength={200} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company *" required>
              <input className="input" value={form.company} onChange={e => set("company", e.target.value)} placeholder="Company name" required />
            </Field>
            <Field label="Location *" required>
              <input className="input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Bangalore / Remote" required />
            </Field>
          </div>
          <Field label="Industry">
            <input className="input" value={form.industry} onChange={e => set("industry", e.target.value)} placeholder="e.g. Technology, Finance" />
          </Field>
        </Section>

        {/* Job Details */}
        <Section title="Job Details">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Job Type">
              <select className="input" value={form.jobType} onChange={e => set("jobType", e.target.value)}>
                {["FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP"].map(t => <option key={t} value={t}>{t.replace("_"," ")}</option>)}
              </select>
            </Field>
            <Field label="Work Mode">
              <select className="input" value={form.workMode} onChange={e => set("workMode", e.target.value)}>
                {["REMOTE","HYBRID","ON_SITE"].map(m => <option key={m} value={m}>{m.replace("_"," ")}</option>)}
              </select>
            </Field>
            <Field label="Experience Level">
              <select className="input" value={form.experienceLevel} onChange={e => set("experienceLevel", e.target.value)}>
                {["ENTRY","MID","SENIOR","LEAD"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Min Salary (₹/yr)">
              <input type="number" className="input" value={form.salaryMin} onChange={e => set("salaryMin", e.target.value)} placeholder="e.g. 600000" min={0} />
            </Field>
            <Field label="Max Salary (₹/yr)">
              <input type="number" className="input" value={form.salaryMax} onChange={e => set("salaryMax", e.target.value)} placeholder="e.g. 1500000" min={0} />
            </Field>
            <Field label="Openings">
              <input type="number" className="input" value={form.openings} onChange={e => set("openings", e.target.value)} min={1} max={999} />
            </Field>
          </div>
          <Field label="Application Deadline">
            <input type="date" className="input" value={form.applicationDeadline} onChange={e => set("applicationDeadline", e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </Field>
        </Section>

        {/* Description */}
        <Section title="Description & Requirements">
          <Field label="Job Description *" required>
            <textarea className="input resize-none" rows={7} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe the role, responsibilities, what success looks like…" required />
          </Field>
          <Field label="Required Skills">
            <input className="input" value={form.skillsRequired}
              onChange={e => set("skillsRequired", e.target.value)}
              placeholder="e.g. React, Node.js, PostgreSQL (comma-separated)" />
            <p className="text-xs text-[var(--text-muted)] mt-1">Separate skills with commas</p>
          </Field>
        </Section>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => navigate("/dashboard")} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving…</span>
              : isEdit ? "Update Job" : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-bold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}
