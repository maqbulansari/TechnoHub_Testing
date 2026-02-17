// API Configuration Helper
// Determines correct base URL based on endpoint type

import { AUTH_BASE_URL, TECHNO_BASE_URL } from "@/environment";

// Auth-related endpoints (Shared APIs) that use AUTH_BASE_URL (/s/)
const AUTH_ENDPOINTS = [
  "login",
  "logout",
  "register",
  "change-password",
  "forgot-password",
  "reset-password",
  "login/refresh",
  "Role",
  "SubRole",
  "idtypes",
  "gallery",
  "User",
  "Admin",
];

// Techno-related endpoints that use TECHNO_BASE_URL (/techno/)
const TECHNO_ENDPOINTS = [
  // Dashboards
  "admin-dashboard",
  "trainer-dashboard",
  "student-dashboard",
  "sponsor-dashboard",
  "recruiter-dashboard",
  
  // Approval/Rejection
  "approve",
  "reject",
  
  // Learner APIs
  "Learner",
  "interviewee_student",
  "selected_without_batch",
  "selected_with_batch",
  "assign_batch",
  "update_selected",
  
  // Students APIs
  "Students",
  "not_sponsored",
  "selected_student_assessment",
  
  // Sponsors APIs
  "sponsors",
  "Sponser_update",
  "batch_wise_data",
  "available_students",
  "sponsored_students",
  "select_students",
  "sponsor_batch",
  "create_order",
  "verify-payment",
  "webhook",
  
  // Recruiter APIs
  "recruiter",
  "Recruiter_update",
  "ready_for_recruitment",
  
  // Trainers APIs
  "trainers",
  "single-trainer",
  "get_selected-students",
  "Trainer/get_selected-students",
  "trainer_select",
  "Proposer",
  "proposerstatuses",
  
  // Batches APIs
  "batches",
  "students_in_batch",
  "trainer_stats",
  "assign-trainers",
  "center-summary",
  "assign_trainers_for_admin",
  "people",
  "batchstatuses",
  
  // Assessment APIs
  "assessment",
  
  // Interview APIs
  "interview-schedules",
  "users-by-role",
  
  // Assignments APIs
  "assignments",
  "batch-analytics",
  
  // Submissions APIs
  "submissions",
  "evaluate",
  
  // Admin APIs
  "admin/assignments/dashboard",
  "admin/batch-performance",
  
  // Other APIs
  "classwork",
  "technology",
  "recruitment",
  "training-center",
  
  // Legacy/Additional
  "bookhub",
  "notifications",
  "whatsapp",
];

/**
 * Get the correct base URL for an endpoint
 * @param {string} endpoint - The endpoint path (e.g., "login", "trainers", "bookhub/comments")
 * @returns {string} - The appropriate base URL (AUTH_BASE_URL or TECHNO_BASE_URL)
 */
export const getBaseUrlForEndpoint = (endpoint) => {
  const cleanEndpoint = endpoint.split("/")[0].toLowerCase();

  if (AUTH_ENDPOINTS.some((authEp) => cleanEndpoint.includes(authEp.toLowerCase()))) {
    return AUTH_BASE_URL;
  }

  if (TECHNO_ENDPOINTS.some((technoEp) => cleanEndpoint.includes(technoEp.toLowerCase()))) {
    return TECHNO_BASE_URL;
  }

  // Default to AUTH_BASE_URL if endpoint type is unknown
  return AUTH_BASE_URL;
};

/**
 * Build a complete API URL for an endpoint
 * @param {string} endpoint - The endpoint path
 * @returns {string} - The complete API URL
 */
export const buildApiUrl = (endpoint) => {
  const baseUrl = getBaseUrlForEndpoint(endpoint);
  return `${baseUrl}/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;
};

export { AUTH_BASE_URL, TECHNO_BASE_URL };
