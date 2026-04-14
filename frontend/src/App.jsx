import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Landing           from "./pages/Landing";
import Jobs              from "./pages/Jobs";
import JobDetail         from "./pages/JobDetail";
import Login             from "./pages/auth/Login";
import Register          from "./pages/auth/Register";
import UserDashboard     from "./pages/dashboard/UserDashboard";
import RecruiterDashboard from "./pages/dashboard/RecruiterDashboard";
import PostJob           from "./pages/PostJob";
import Profile           from "./pages/Profile";
import News              from "./pages/News";
import Skills            from "./pages/Skills";
import Courses           from "./pages/Courses";
import AiResume          from "./pages/AiResume";
import AiChat            from "./pages/AiChat";

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "RECRUITER" ? <RecruiterDashboard /> : <UserDashboard />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"             element={<Landing />} />
          <Route path="/jobs"         element={<Jobs />} />
          <Route path="/jobs/:id"     element={<JobDetail />} />
          <Route path="/news"         element={<News />} />
          <Route path="/skills"       element={<Skills />} />
          <Route path="/courses"      element={<Courses />} />
          <Route path="/ai-resume"    element={<AiResume />} />
          <Route path="/ai-chat"      element={<AiChat />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/dashboard"    element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/post-job"     element={<ProtectedRoute roles={["RECRUITER"]}><PostJob /></ProtectedRoute>} />
          <Route path="/edit-job/:id" element={<ProtectedRoute roles={["RECRUITER"]}><PostJob /></ProtectedRoute>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: {
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: "500",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}/>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
