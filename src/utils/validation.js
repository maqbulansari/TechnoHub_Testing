/**
 * Shared validation constants and regex patterns
 * Used across all forms for consistent production-grade validation
 */

// ── Character Limits ──
export const LIMITS = {
    FIRST_NAME: 50,
    LAST_NAME: 50,
    EMAIL: 254,
    PASSWORD: 128,
    MOBILE: 10,
    IDENTITY: 30,
    ADDRESS: 500,
    QUALIFICATION: 100,
    PROFESSION: 100,
    SOURCE: 200,
    REMARKS: 200,
    POLL_TITLE: 100,
    ACCESS_REASON: 300,
    SEARCH_QUERY: 100,
    BATCH_NAME: 100,
    BOOK_TITLE: 200,
};

// ── Regex Patterns ──
export const PATTERNS = {
    /** Letters, spaces, hyphens, apostrophes */
    NAME: /^[A-Za-z\s'-]+$/,
    /** RFC 5322 simplified email */
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    /** Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char */
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    /** Exactly 10 digits */
    MOBILE: /^[0-9]{10}$/,
    /** Digits only (for onChange filtering) */
    DIGITS_ONLY: /^[0-9]*$/,
    /** Letters and spaces only */
    LETTERS_ONLY: /^[A-Za-z\s]+$/,
    /** Alphanumeric with common ID chars */
    IDENTITY: /^[A-Za-z0-9\s\-/]+$/,
};

// ── Validation Messages ──
export const MESSAGES = {
    REQUIRED: (field) => `${field} is required`,
    MIN_LENGTH: (field, len) => `${field} must be at least ${len} characters`,
    MAX_LENGTH: (field, len) => `${field} cannot exceed ${len} characters`,
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_MOBILE: "Please enter a valid 10-digit mobile number",
    INVALID_NAME: "Only letters, spaces, hyphens and apostrophes are allowed",
    INVALID_PASSWORD:
        "Password must be 8+ characters with uppercase, lowercase, number & special character",
    INVALID_LETTERS_ONLY: "Only letters and spaces are allowed",
};

/**
 * Sort an array of objects alphabetically by a given key
 * @param {Array} arr - Array to sort
 * @param {string} key - Object key to sort by
 * @returns {Array} Sorted copy of the array
 */
export const sortAlphabetically = (arr, key = "label") => {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => {
        const valA = (a[key] || "").toString().toLowerCase();
        const valB = (b[key] || "").toString().toLowerCase();
        return valA.localeCompare(valB);
    });
};
