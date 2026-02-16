// API Configuration Helper
// Determines correct base URL based on endpoint type

import { AUTH_BASE_URL, TECHNO_BASE_URL } from "@/environment";

// Auth-related endpoints that use AUTH_BASE_URL
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
];

// Techno-related endpoints that use TECHNO_BASE_URL
const TECHNO_ENDPOINTS = [
  "trainers",
  "Admin",
  "batches",
  "technology",
  "batchstatuses",
  "User",
  "Learner",
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
