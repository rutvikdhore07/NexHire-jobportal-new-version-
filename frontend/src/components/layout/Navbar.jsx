import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Briefcase, ChevronDown, LogOut,
         User, LayoutDashboard, Newspaper, TrendingUp, BookOpen, Brain, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const AI_MENU = [
  { to: "/ai-resume", icon: Brain,    label: "Resume Analyzer", desc: "AI-powered resume scoring" },
  { to: "/ai-chat",   icon: Sparkles, label: "Career Chatbot",  desc: "Ask anything career-related" },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { dark, toggle }                  = useTheme();
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [dropOpen,   setDropOpen]         = useState(false);
  const [aiOpen,     setAiOpen]           = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); setDropOpen(false); };

  const base   = "px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors";
  const active = "px-3 py-1.5 rounded-lg text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-1">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-brand-600 flex-shrink-0 mr-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Briefcase size={15} className="text-white"/>
          </div>
          NexHire
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {[["/jobs","Jobs"],["/news","News"],["/skills","Skills"],["/courses","Courses"]].map(([to,label])=>(
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? active : base}>{label}</NavLink>
          ))}

          {/* AI dropdown */}
          <div className="relative" onMouseEnter={() => setAiOpen(true)} onMouseLeave={() => setAiOpen(false)}>
            <button className={`${base} flex items-center gap-1`}>
              <Brain size={14}/> AI Tools <ChevronDown size={12} className={`transition-transform ${aiOpen?"rotate-180":""}`}/>
            </button>
            <AnimatePresence>
              {aiOpen && (
                <motion.div initial={{ opacity:0, y:-6, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:-6 }} className="absolute left-0 top-full pt-1 w-60 z-50">
                  <div className="card shadow-2xl py-2">
                    {AI_MENU.map(({ to, icon: Icon, label, desc }) => (
                      <Link key={to} to={to} onClick={() => setAiOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-violet-600"/>
                        </div>
                        <div><p className="text-sm font-semibold text-[var(--text)]">{label}</p>
                        <p className="text-xs text-[var(--text-muted)]">{desc}</p></div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated && <NavLink to="/dashboard" className={({ isActive }) => isActive ? active : base}>Dashboard</NavLink>}
          {user?.role === "RECRUITER" && <NavLink to="/post-job" className={({ isActive }) => isActive ? active : base}>Post Job</NavLink>}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <button onClick={toggle} className="btn-ghost p-2 rounded-xl">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setDropOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-[var(--text)] max-w-[90px] truncate">{user?.name?.split(" ")[0]}</span>
                <ChevronDown size={12} className={`text-[var(--text-muted)] transition-transform ${dropOpen?"rotate-180":""}`}/>
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div initial={{ opacity:0, y:-8, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0 }} className="absolute right-0 top-12 w-52 card shadow-2xl py-1.5 z-50">
                    <Link to="/dashboard" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] font-medium">
                      <LayoutDashboard size={14}/> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] font-medium">
                      <User size={14}/> Profile
                    </Link>
                    <div className="border-t border-[var(--border)] my-1"/>
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
                      <LogOut size={14}/> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"    className="btn-secondary text-sm py-2 px-4">Sign in</Link>
              <Link to="/register" className="btn-primary  text-sm py-2 px-4">Get started</Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden btn-ghost p-2 ml-auto" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 pb-4 pt-2">
            <div className="space-y-1 mb-4">
              {[["/jobs","Jobs"],["/news","News"],["/skills","Skills"],["/courses","Courses"],["/ai-resume","AI Resume"],["/ai-chat","AI Chat"]].map(([to,l])=>(
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-brand-50 text-brand-600" : "text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                    }`}>{l}</NavLink>
              ))}
              {isAuthenticated && (
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive?"bg-brand-50 text-brand-600":"text-[var(--text-muted)] hover:bg-[var(--surface-2)]"}`}>
                  Dashboard
                </NavLink>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
              <button onClick={toggle} className="btn-ghost gap-2 text-sm">{dark ? <Sun size={15}/> : <Moon size={15}/>}{dark?"Light":"Dark"} mode</button>
              {isAuthenticated
                ? <button onClick={handleLogout} className="btn-ghost text-red-500 text-sm gap-2"><LogOut size={14}/>Sign out</button>
                : <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary text-sm">Sign in</Link>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
