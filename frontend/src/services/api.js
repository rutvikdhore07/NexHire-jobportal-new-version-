import API from "../api/axios";

// ─── Jobs ──────────────────────────────────────────────────────────────────
export const jobsApi = {
  search:     (p)     => API.get("/jobs", { params: p }),
  getById:    (id)    => API.get(`/jobs/${id}`),
  create:     (d)     => API.post("/jobs", d),
  update:     (id, d) => API.put(`/jobs/${id}`, d),
  delete:     (id)    => API.delete(`/jobs/${id}`),
  myPostings: (p)     => API.get("/jobs/my-postings", { params: p }),
};

// ─── Applications ──────────────────────────────────────────────────────────
export const appsApi = {
  apply:        (d)          => API.post("/applications", d),
  mine:         (p)          => API.get("/applications/me", { params: p }),
  byJob:        (id, p)      => API.get(`/applications/job/${id}`, { params: p }),
  updateStatus: (id, s, n)   => API.patch(`/applications/${id}/status`, null, { params: { status: s, notes: n } }),
  withdraw:     (id)         => API.patch(`/applications/${id}/withdraw`),
};

// ─── User ──────────────────────────────────────────────────────────────────
export const userApi = {
  me:             ()      => API.get("/users/me"),
  update:         (d)     => API.put("/users/me", d),
  stats:          ()      => API.get("/users/me/stats"),
  recruiterStats: ()      => API.get("/users/me/recruiter-stats"),
  toggleSave:     (id)    => API.post(`/users/me/saved-jobs/${id}`),
  savedJobs:      (p)     => API.get("/users/me/saved-jobs", { params: p }),
};

// ─── News ──────────────────────────────────────────────────────────────────
export const newsApi = {
  getAll:    (p) => API.get("/news", { params: p }),
  featured:  ()  => API.get("/news/featured"),
};

// ─── Skills ────────────────────────────────────────────────────────────────
export const skillsApi = {
  getAll: (category) => API.get("/skills", { params: category ? { category } : {} }),
  hot:    ()         => API.get("/skills/hot"),
};

// ─── Courses ───────────────────────────────────────────────────────────────
export const coursesApi = {
  search:   (p) => API.get("/courses", { params: p }),
  featured: ()  => API.get("/courses/featured"),
};
