import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Search, MapPin, Zap, Shield, TrendingUp, BookOpen,
         Newspaper, Star, Users, Briefcase, CheckCircle, ChevronRight,
         Brain, Target, Sparkles } from "lucide-react";
import { newsApi, skillsApi, coursesApi } from "../services/api";

// ── 3D Animated Sphere ─────────────────────────────────────────────────
function AnimatedSphere() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.8, 100, 100]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.45}
          speed={2.5}
          roughness={0}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

// ── Floating particles ──────────────────────────────────────────────────
function Particles() {
  return (
    <Stars radius={80} depth={40} count={600} factor={3} saturation={0.3} fade speed={1} />
  );
}

// ── Scroll-driven counter ───────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(to / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= to) { setCount(to); clearInterval(timer); }
          else setCount(start);
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const STATS  = [{ n: 10000, s: "+", label: "Active Jobs", icon: Briefcase },
                { n: 2500,  s: "+", label: "Companies",   icon: Users },
                { n: 50000, s: "+", label: "Hires Made",  icon: CheckCircle },
                { n: 98,    s: "%", label: "Satisfaction", icon: Star }];

const FEATURES = [
  { icon: Search,     color:"text-blue-500   bg-blue-50   dark:bg-blue-900/20",   title:"Smart Job Search",       desc:"Filter by salary, location, work mode, experience. Find your perfect role instantly." },
  { icon: Brain,      color:"text-violet-500 bg-violet-50 dark:bg-violet-900/20", title:"AI Resume Analyzer",     desc:"Upload your resume and get instant AI-powered feedback, skill gaps, and improvement tips." },
  { icon: Target,     color:"text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20", title:"Smart Recommendations", desc:"AI matches jobs to your skills, location, and career goals automatically." },
  { icon: Sparkles,   color:"text-amber-500  bg-amber-50  dark:bg-amber-900/20",  title:"AI Career Chatbot",      desc:"Get instant answers to career questions, interview tips, and salary negotiation advice." },
  { icon: TrendingUp, color:"text-cyan-500   bg-cyan-50   dark:bg-cyan-900/20",   title:"Market Insights",        desc:"Real-time data on trending skills, salary benchmarks, and hiring trends." },
  { icon: Shield,     color:"text-rose-500   bg-rose-50   dark:bg-rose-900/20",   title:"Verified Recruiters",    desc:"Every recruiter is verified. No spam — only genuine opportunities." },
];

const fade    = { hidden: { opacity:0, y:28 }, show: { opacity:1, y:0, transition:{ duration:0.55 } } };
const stagger = { show:{ transition:{ staggerChildren:0.1 } } };

export default function Landing() {
  const heroRef    = useRef();
  const { scrollY } = useScroll();
  const y3d        = useTransform(scrollY, [0, 400], [0, -80]);
  const opacity3d  = useTransform(scrollY, [0, 350], [1, 0]);

  const [news,    setNews]    = useState([]);
  const [skills,  setSkills]  = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    newsApi.featured().then(r => setNews(r.data.data || [])).catch(()=>{});
    skillsApi.hot().then(r => setSkills((r.data.data || []).slice(0, 8))).catch(()=>{});
    coursesApi.featured().then(r => setCourses((r.data.data || []).slice(0, 3))).catch(()=>{});
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ═══ HERO ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[var(--bg)]">
        {/* Dark gradient bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/40 to-violet-950/30 dark:from-gray-950 dark:via-blue-950/50 dark:to-violet-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-10%,rgba(59,130,246,0.18)_0%,transparent_60%)]" />
        </div>
{/* 3D Canvas — right side */}
        <motion.div style={{ y: y3d, opacity: opacity3d }}
          className="absolute right-0 top-0 w-full md:w-1/2 h-full pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <pointLight position={[-5, -5, -5]} color="#818cf8" intensity={0.8} />
            <Suspense fallback={null}>
              <AnimatedSphere />
              <Particles />
            </Suspense>
          </Canvas>
        </motion.div>
        {/* Hero text — left side */}
        <div className="relative z-10 page w-full py-28 md:py-32">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30
                         bg-blue-500/10 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Now with AI-powered features
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.07] tracking-tight text-white mb-6">
              Land your dream job
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                10× faster.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
              className="text-lg text-slate-300 max-w-xl mb-10 leading-relaxed">
              AI resume analysis, smart job matching, real-time market insights and a career chatbot —
              everything you need to go from applicant to offer.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              className="flex flex-col sm:flex-row gap-4">
              <Link to="/jobs"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white
                           font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-500/30
                           transition-all duration-200 active:scale-95">
                Browse Jobs <ArrowRight size={18} />
              </Link>
              <Link to="/ai-resume"
                className="inline-flex items-center gap-2 border border-white/20 text-white
                           hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl transition-all duration-200
                           backdrop-blur-sm active:scale-95">
                <Brain size={18} /> Analyze Resume
              </Link>
            </motion.div>

            {/* Search bar */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }}
              className="mt-12 flex gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/15 max-w-lg">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input readOnly onClick={() => window.location.href="/jobs"}
                  placeholder="Search jobs, skills, companies…"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-slate-400 text-sm outline-none cursor-pointer" />
              </div>
              <Link to="/jobs" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
                Search
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS (scroll reveal + counter) ══════════════════════════ */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="page">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ n, s, label, icon: Icon }) => (
              <motion.div key={label} variants={fade}
                className="text-center card p-6 hover:shadow-card-hover transition-all">
                <div className="text-3xl font-black text-[var(--text)] mb-1">
                  <Counter to={n} suffix={s} />
                </div>
                <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5">
                  <Icon size={13} /> {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═════════════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--surface-2)]">
        <div className="page">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
            className="text-center mb-14">
            <motion.p variants={fade} className="text-brand-600 font-bold text-xs uppercase tracking-widest mb-3">
              What makes NexHire different
            </motion.p>
            <motion.h2 variants={fade} className="section-title">
              AI-powered tools, built for job seekers
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <motion.div key={title} variants={fade} className="card-hover p-6 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}
                                 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TRENDING SKILLS preview ═══════════════════════════════════ */}
      {skills.length > 0 && (
        <section className="py-24">
          <div className="page">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-brand-600 font-bold text-xs uppercase tracking-widest mb-2">Market Pulse</p>
                <h2 className="section-title">🔥 Skills in High Demand</h2>
              </div>
              <Link to="/skills" className="btn-ghost text-sm items-center gap-1.5 hidden sm:flex">
                View all <ChevronRight size={15}/>
              </Link>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skills.map(s => (
                <motion.div key={s.id} variants={fade} className="card-hover p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[var(--text)]">{s.name}</span>
                    <span className={`badge ${s.demandLevel==="High"?"badge-green":"badge-yellow"}`}>{s.demandLevel}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">{s.category}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-600 font-semibold">+{s.growthPercent?.toFixed(0)}%</span>
                    <span className="text-[var(--text-muted)]">{s.jobCount?.toLocaleString()} jobs</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                      initial={{ width:0 }} whileInView={{ width:`${Math.min((s.jobCount/20000)*100,100)}%` }}
                      transition={{ duration:1 }} viewport={{ once:true }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ AI FEATURE HIGHLIGHT ══════════════════════════════════════ */}
      <section className="py-24 bg-[var(--surface-2)]">
        <div className="page">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <p className="text-violet-600 font-bold text-xs uppercase tracking-widest mb-3">AI Features</p>
              <h2 className="section-title mb-4">Your personal AI career coach</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-8">
                Upload your resume and get instant AI analysis. Chat with our AI for career advice.
                Get personalized job recommendations based on your profile.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Brain, title:"Resume Analyzer", desc:"Instant score + improvement tips" },
                  { icon: Sparkles, title:"Career Chatbot", desc:"24/7 AI career guidance" },
                  { icon: Target, title:"Job Match Score", desc:"See how well you fit each role" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-4 card p-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-violet-600" />
                    </div>
                    <div><p className="font-semibold text-[var(--text)] text-sm">{title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <Link to="/ai-resume" className="btn-primary">Try Resume Analyzer</Link>
                <Link to="/ai-chat" className="btn-secondary">Chat with AI</Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              className="card p-8 border-2 border-violet-200 dark:border-violet-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <div><p className="font-bold text-[var(--text)]">NexHire AI</p>
                <p className="text-xs text-emerald-600 font-medium">● Online</p></div>
              </div>
              <div className="space-y-4 mb-6">
                {[
                  { from:"user", msg:"Can you review my resume?" },
                  { from:"ai",   msg:"I'd be happy to! Your resume scores 78/100. Strong technical skills section — I'd suggest adding more quantifiable achievements to your work experience." },
                  { from:"user", msg:"What jobs should I apply for?" },
                  { from:"ai",   msg:"Based on your skills in React and Node.js, I recommend applying for Full Stack Developer, Frontend Engineer, or SDE-2 roles at mid-size startups." },
                ].map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.from==="user"?"justify-end":""}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.from==="user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-[var(--surface-2)] text-[var(--text)] rounded-bl-sm"
                    }`}>{m.msg}</div>
                  </div>
                ))}
              </div>
              <Link to="/ai-chat"
                className="w-full flex items-center justify-center gap-2 border border-[var(--border)]
                           rounded-xl py-2.5 text-sm text-[var(--text-muted)] hover:border-violet-400
                           hover:text-violet-600 transition-colors">
                <Sparkles size={14}/> Start AI Chat →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ NEWS preview ══════════════════════════════════════════════ */}
      {news.length > 0 && (
        <section className="py-24">
          <div className="page">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-brand-600 font-bold text-xs uppercase tracking-widest mb-2">Latest</p>
                <h2 className="section-title">📰 Job Market News</h2>
              </div>
              <Link to="/news" className="btn-ghost text-sm items-center gap-1.5 hidden sm:flex">
                All news <ChevronRight size={15}/>
              </Link>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
              className="grid sm:grid-cols-3 gap-6">
              {news.slice(0,3).map(a => (
                <motion.a key={a.id} variants={fade} href={a.url} target="_blank" rel="noreferrer"
                  className="card-hover group overflow-hidden block">
                  <div className="h-40 bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-900/30 dark:to-violet-900/30
                                  flex items-center justify-center">
                    <Newspaper size={36} className="text-brand-400" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-blue">{a.category}</span>
                      <span className="text-xs text-[var(--text-muted)]">{a.source}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text)] line-clamp-2 group-hover:text-brand-600 transition-colors mb-2">{a.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">{a.summary}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="page">
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={fade}
            className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-blue-600 via-violet-700 to-cyan-700 shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage:"radial-gradient(circle at 50% 0%,#fff 1px,transparent 1px)", backgroundSize:"30px 30px" }} />
            <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to supercharge your job search?
            </h2>
            <p className="relative text-blue-100 mb-8 max-w-md mx-auto">
              Join 50,000+ professionals who found their dream role through NexHire.
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-colors">
                Get started free
              </Link>
              <Link to="/ai-resume" className="border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-2xl transition-colors flex items-center gap-2">
                <Brain size={16}/> Try AI Resume Analyzer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12">
        <div className="page flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-extrabold text-xl text-brand-600">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Briefcase size={15} className="text-white"/>
            </div>
            NexHire
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-[var(--text-muted)]">
            {[["Jobs","/jobs"],["News","/news"],["Skills","/skills"],["Courses","/courses"],["AI Resume","/ai-resume"],["AI Chat","/ai-chat"]].map(([l,h])=>(
              <Link key={l} to={h} className="hover:text-[var(--text)] transition-colors">{l}</Link>
            ))}
          </div>
          <p className="text-sm text-[var(--text-muted)]">© {new Date().getFullYear()} NexHire</p>
        </div>
      </footer>
    </div>
  );
}
