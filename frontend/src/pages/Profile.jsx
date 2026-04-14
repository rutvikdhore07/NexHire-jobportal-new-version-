import { useState, useEffect } from "react";
import { User, MapPin, Phone, Link as LinkIcon, Github, Linkedin, FileText, Save } from "lucide-react";
import { userApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "", phone: "", bio: "", location: "", skills: "",
    resumeUrl: "", linkedinUrl: "", githubUrl: "", portfolioUrl: "",
  });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    userApi.me().then(res => {
      const u = res.data.data;
      setForm({
        name: u.name || "", phone: u.phone || "", bio: u.bio || "",
        location: u.location || "", skills: u.skills || "",
        resumeUrl: u.resumeUrl || "", linkedinUrl: u.linkedinUrl || "",
        githubUrl: u.githubUrl || "", portfolioUrl: u.portfolioUrl || "",
      });
    }).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.update(form);
      updateUser(res.data.data);
      toast.success("Profile updated!");
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>
  );

  const profileScore = [form.name, form.phone, form.bio, form.location, form.skills, form.resumeUrl]
    .filter(Boolean).length;
  const pct = Math.round((profileScore / 6) * 100);

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text)]">Your Profile</h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">Keep your profile updated to improve your chances</p>
      </div>

      {/* Profile completeness */}
      <div className="card p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-extrabold text-brand-600">{pct}%</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--text)]">Profile Completeness</p>
          <div className="mt-1.5 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {pct < 100 && <p className="text-xs text-[var(--text-muted)] hidden sm:block">Complete your profile to stand out</p>}
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {/* Basic */}
        <Section title="Basic Information">
          <Field label="Full Name *">
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input className="input pl-10" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Your full name" />
            </div>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input className="input pl-10" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 9876543210" />
              </div>
            </Field>
            <Field label="Location">
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input className="input pl-10" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Bangalore, India" />
              </div>
            </Field>
          </div>
          <Field label="Bio">
            <textarea className="input resize-none" rows={3} value={form.bio}
              onChange={e => set("bio", e.target.value)} placeholder="A short intro about yourself…" />
          </Field>
        </Section>

        {/* Skills */}
        <Section title="Skills & Experience">
          <Field label="Skills">
            <input className="input" value={form.skills} onChange={e => set("skills", e.target.value)}
              placeholder="React, Node.js, Python, SQL (comma-separated)" />
            <p className="text-xs text-[var(--text-muted)] mt-1">Used for job matching — be specific</p>
          </Field>
          <Field label="Resume URL">
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input className="input pl-10" value={form.resumeUrl} onChange={e => set("resumeUrl", e.target.value)}
                placeholder="https://drive.google.com/your-resume" type="url" />
            </div>
          </Field>
        </Section>

        {/* Links */}
        <Section title="Online Presence">
          {[
            { key: "linkedinUrl", icon: Linkedin, label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
            { key: "githubUrl",   icon: Github,   label: "GitHub",   placeholder: "https://github.com/yourname" },
            { key: "portfolioUrl",icon: LinkIcon,  label: "Portfolio",placeholder: "https://yourportfolio.com" },
          ].map(({ key, icon: Icon, label, placeholder }) => (
            <Field key={key} label={label}>
              <div className="relative">
                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input className="input pl-10" value={form[key]} onChange={e => set(key, e.target.value)}
                  placeholder={placeholder} type="url" />
              </div>
            </Field>
          ))}
        </Section>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="btn-primary px-8">
            {saving
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving…</span>
              : <><Save size={15}/>Save Profile</>}
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
function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
