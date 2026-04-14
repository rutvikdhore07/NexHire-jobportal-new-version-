import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Briefcase, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const location              = useLocation();
  const from                  = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("All fields required"); return; }
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 mb-4">
            <Briefcase size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Welcome back</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">Sign in to your NexHire account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className="input pl-10" autoComplete="email" required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={show ? "text" : "password"} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password" className="input pl-10 pr-11" autoComplete="current-password" required
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">Create one free</Link>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          Testing? Register a new account — it takes 30 seconds.
        </p>
      </div>
    </div>
  );
}
