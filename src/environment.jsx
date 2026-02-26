// // export const base_path ='/react/template'
// // export const img_path ='/react/template/'
// export const base_path = '/';
// export const img_path = '/';

// // API Base URLs
// // Local Development
// export const AUTH_BASE_URL = "http://127.0.0.1:8000/s";
// export const TECHNO_BASE_URL = "http://127.0.0.1:8000/techno";

// // Alternate configurations (for different environments)
// // export const AUTH_BASE_URL = "https://api.lgstechnohub.in/s";
// // export const TECHNO_BASE_URL = "https://api.lgstechnohub.in/techno";

// // For backward compatibility - defaults to auth base URL
// export const API_BASE_URL = AUTH_BASE_URL;


// export const base_path ='/react/template'
// export const img_path ='/react/template/'
export const base_path = '/';
export const img_path = '/';

// ===============================
// API Base URLs
// ===============================

// ✅ Local Development
// export const AUTH_BASE_URL = "https://958cp4w5-8000.inc1.devtunnels.ms/s";
// export const TECHNO_BASE_URL = "https://958cp4w5-8000.inc1.devtunnels.ms/techno";

// ===============================
// 🌐   Production / Server Options
// ===============================

// Main VPS
// export const AUTH_BASE_URL = "http://72.61.173.6:8086/auth";
// export const TECHNO_BASE_URL = "http://72.61.173.6:8086/techno";

// LG Technohub Production
export const AUTH_BASE_URL = "https://api.lgstechnohub.in/auth";
export const TECHNO_BASE_URL = "https://api.lgstechnohub.in/auth";

// PythonAnywhere
//  export const AUTH_BASE_URL = "https://technohub.pythonanywhere.com/auth";
//  export const TECHNO_BASE_URL = "https://technohub.pythonanywhere.com/auth";

// DevTunnel - Main
// export const AUTH_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/s";
// export const TECHNO_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/techno";

// DevTunnel - Farha
// export const AUTH_BASE_URL = "https://xbzp7968-7000.inc1.devtunnels.ms/auth";
// export const TECHNO_BASE_URL = "https://xbzp7968-7000.inc1.devtunnels.ms/auth";

// DevTunnel - Saba
// export const AUTH_BASE_URL = "https://958cp4w5-8000.inc1.devtunnels.ms/s";
// export const TECHNO_BASE_URL = "https://958cp4w5-8000.inc1.devtunnels.ms/techno";

// DevTunnel - Naaz
// export const AUTH_BASE_URL = "https://94f38xkg-7000.inc1.devtunnels.ms/auth";`
// export const TECHNO_BASE_URL = "https://94f38xkg-7000.inc1.devtunnels.ms/techno";


// DevTunnel - Tahoor
// export const AUTH_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/s";
// export const TECHNO_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/techno";


// ===============================
// Backward Compatibility
// ===============================
export const API_BASE_URL = AUTH_BASE_URL;

/**
 * SHARED/AUTH ENDPOINTS (use AUTH_BASE_URL at /s/)
 * ================================================
 * /login/
 * /logout/
 * /change-password/
 * /forgot-password/
 * /register/
 * /Role/
 * /SubRole/
 * /idtypes/
 * /gallery/
 * /User/
 * /Admin/
 */

/**
 * TECHNO ENDPOINTS (use TECHNO_BASE_URL at /techno/)
 * ==================================================
 * DASHBOARDS:
 *   /admin-dashboard/, /trainer-dashboard/, /student-dashboard/
 *   /sponsor-dashboard/, /recruiter-dashboard/
 *
 * USER MANAGEMENT: /approve/<id>/, /reject/<id>/
 *
 * LEARNER: /Learner/, /Learner/interviewee_student/
 *   /Learner/selected_without_batch/, /Learner/selected_with_batch/
 *   /Learner/assign_batch/, /Learner/<id>/update_selected/
 *
 * STUDENTS: /Students/, /Students/not_sponsored/
 *   /student/selected_student_assessment/
 *
 * SPONSORS: /sponsors/* (all sponsor-related endpoints)
 * RECRUITER: /recruiter/* (all recruiter-related endpoints)
 * TRAINERS: /trainers/*, /trainer/*, /Trainer/*
 * BATCHES: /batches/, /batchstatuses/
 * ASSESSMENT: /assessment/
 * INTERVIEWS: /interview-schedules/
 * ASSIGNMENTS: /assignments/
 * SUBMISSIONS: /submissions/
 * ADMIN: /admin/assignments/dashboard/, /admin/batch-performance/
 * OTHER: /classwork/, /technology/, /recruitment/, /training-center/
 * BOOKHUB: /bookhub/* (all bookhub endpoints)
 * NOTIFICATIONS: /notifications/* (all notification endpoints)
 * WHATSAPP: /whatsapp/* (all whatsapp endpoints)
 */
