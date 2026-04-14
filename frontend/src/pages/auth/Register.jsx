import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Briefcase, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [params]  = useSearchParams();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: params.get("role") || "USER",
  });
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 mb-4">
            <Briefcase size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Create your account</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">Join NexHire — it's completely free</p>
        </div>

        <div className="card p-8">
          {/* Role toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[var(--border)] mb-6">
            {[{ value: "USER", label: "Job Seeker" }, { value: "RECRUITER", label: "Recruiter" }].map(({ value, label }) => (
              <button key={value} type="button" onClick={() => set("role", value)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  form.role === value
                    ? "bg-brand-600 text-white"
                    : "text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="John Doe" className="input pl-10" required minLength={2} />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com" className="input pl-10" required autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type={show ? "text" : "password"} value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Min. 6 characters" className="input pl-10 pr-11" required minLength={6} />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Must be at least 6 characters</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : `Create ${form.role === "RECRUITER" ? "Recruiter" : ""} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
