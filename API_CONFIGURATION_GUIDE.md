# API Base URL Configuration Summary

## Changes Made

Your TechnoHub Frontend project has been successfully configured to use two separate API base URLs:

### 1. **Environment Configuration** ([src/environment.jsx](src/environment.jsx))
```javascript
// Auth endpoints (login, logout, register, etc.)
export const AUTH_BASE_URL = "http://127.0.0.1:8000/s";

// Other application endpoints (batches, trainers, notifications, etc.)
export const TECHNO_BASE_URL = "http://127.0.0.1:8000/techno";

// Backward compatibility
export const API_BASE_URL = AUTH_BASE_URL;
```

### 2. **Auth Context** ([src/contexts/authContext.jsx](src/contexts/authContext.jsx))
- Imports both `AUTH_BASE_URL` and `TECHNO_BASE_URL` from environment
- Exports both URLs for use across the application
- Updated endpoints to use appropriate base URLs:
  - Auth endpoints (login, register, logout, SubRole, etc.) → Use `AUTH_BASE_URL`
  - Techno endpoints (trainers, batches, User) → Use `TECHNO_BASE_URL`

### 3. **Files Updated to Use TECHNO_BASE_URL**

The following components have been updated to use `TECHNO_BASE_URL` for techno endpoints:

| File | Updated Endpoints |
|------|-------------------|
| [src/components/Admission_dashboard/Admission_table.jsx](src/components/Admission_dashboard/Admission_table.jsx) | `/Learner/` |
| [src/contexts/NotificationContext.jsx](src/contexts/NotificationContext.jsx) | `/notifications/unread/` |
| [src/components/Trainer_dashboard/TrainerProfile.jsx](src/components/Trainer_dashboard/TrainerProfile.jsx) | `/trainers/` |
| [src/components/Batches/CreateBatches.jsx](src/components/Batches/CreateBatches.jsx) | `/technology/`, `/trainers/`, `/batchstatuses/`, `/batches/` |
| [src/components/BookHub/CommentInput.jsx](src/components/BookHub/CommentInput.jsx) | `/bookhub/comments/` |
| [src/components/BookHub/BookDetail.jsx](src/components/BookHub/BookDetail.jsx) | All `/bookhub/` endpoints |
| [src/components/BookHub/AdminAccessManager.jsx](src/components/BookHub/AdminAccessManager.jsx) | `/bookhub/admin/access/` |
| [src/components/BookHub/BookhubHome.jsx](src/components/BookHub/BookhubHome.jsx) | `/bookhub/books/` |
| [src/components/BookHub/CreateBook.jsx](src/components/BookHub/CreateBook.jsx) | `/bookhub/books/` |
| [src/hooks/useComments.js](src/hooks/useComments.js) | All `/bookhub/comments/` endpoints |

### 4. **Utility Function** ([src/utils/apiConfig.js](src/utils/apiConfig.js))
Created a helper utility with functions to automatically determine the correct base URL based on endpoint type:
- `getBaseUrlForEndpoint(endpoint)` - Returns appropriate base URL
- `buildApiUrl(endpoint)` - Builds complete API URL

## Endpoint Classification

### Auth Endpoints (use AUTH_BASE_URL: http://127.0.0.1:8000/s/)
- `/login/`
- `/logout/`
- `/register/`
- `/change-password/`
- `/forgot-password/`
- `/reset-password/`
- `/login/refresh/`
- `/Role/`
- `/SubRole/`
- `/idtypes/`

### Techno Endpoints (use TECHNO_BASE_URL: http://127.0.0.1:8000/techno/)
- `/trainers/`
- `/Admin/`
- `/batches/`
- `/technology/`
- `/batchstatuses/`
- `/User/`
- `/Learner/`
- `/bookhub/` (all sub-endpoints)
- `/notifications/` (all sub-endpoints)
- `/whatsapp/` (all sub-endpoints)

## How to Switch Environments

Simply update the base URLs in [src/environment.jsx](src/environment.jsx):

```javascript
// For production
export const AUTH_BASE_URL = "https://api.lgstechnohub.in/s";
export const TECHNO_BASE_URL = "https://api.lgstechnohub.in/techno";

// For staging
export const AUTH_BASE_URL = "https://staging-api.lgstechnohub.in/s";
export const TECHNO_BASE_URL = "https://staging-api.lgstechnohub.in/techno";
```

All API calls throughout the application will automatically use the configured URLs.

## Notes

- The configuration maintains backward compatibility through `API_BASE_URL` export which defaults to `AUTH_BASE_URL`
- All context providers (AuthContext, NotificationContext) export both `AUTH_BASE_URL` and `TECHNO_BASE_URL`
- Files that were not modified (such as register.jsx, changePassword.jsx, resetPassword.jsx) continue to work as they use auth-related endpoints which are handled correctly
