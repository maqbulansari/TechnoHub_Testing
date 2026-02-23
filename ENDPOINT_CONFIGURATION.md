# API Endpoint Configuration - Complete Reference

## ✅ Configuration Status: COMPLETE

Your TechnoHub Frontend now has a comprehensive, well-organized API endpoint configuration with two main base URLs.

---

## Base URLs

### Local Development
```javascript
const AUTH_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/s";
const TECHNO_BASE_URL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/techno";
```

### Production (Examples provided)
```javascript
// LG Technohub Production
const AUTH_BASE_URL = "https://api.lgctechnohub.in/s";
const TECHNO_BASE_URL = "https://api.lgctechnohub.in/techno";

// OR Local HTTP
const AUTH_BASE_URL = "http://127.0.0.1:8000/s";
const TECHNO_BASE_URL = "http://127.0.0.1:8000/techno";
```

---

## SHARED/AUTH Endpoints (use `/s/`)

| Endpoint | Purpose |
|----------|---------|
| `/login/` | User login |
| `/logout/` | User logout |
| `/register/` | User registration |
| `/change-password/` | Change user password |
| `/forgot-password/` | Forgot password request |
| `/reset-password/` | Password reset |
| `/Role/` | User roles (GET) |
| `/SubRole/` | Sub-roles (GET) |
| `/idtypes/` | ID types list |
| `/gallery/` | Gallery data |
| `/User/` | User profile/details |
| `/Admin/` | Admin endpoints |

---

## TECHNO Endpoints (use `/techno/`)

### Dashboards
```
GET /admin-dashboard/
GET /trainer-dashboard/
GET /student-dashboard/
GET /sponsor-dashboard/
GET /recruiter-dashboard/
```

### User Management
```
POST /approve/<int:user_id>/
POST /reject/<int:user_id>/
```

### Learner Management
```
GET /Learner/                              # List all learners
GET /Learner/interviewee_student/          # Interviewee students
GET /Learner/selected_without_batch/       # Selected students without batch
GET /Learner/selected_with_batch/          # Selected students with batch
POST /Learner/assign_batch/                # Assign batch to learner
PUT /Learner/<id>/update_selected/         # Update learner selection
```

### Student Management
```
GET /Students/                             # All students
GET /Students/not_sponsored/               # Non-sponsored students
GET /student/selected_student_assessment/  # Student assessment data
```

### Sponsor Management
```
GET /sponsors/                             # List sponsors
POST /sponsors/Sponser_update/             # Update sponsor info
GET /sponsors/batch_wise_data/             # Batch-wise data
GET /sponsors/available_students/          # Available students for sponsorship
GET /sponsors/sponsored_students/          # Sponsored students
POST /sponsors/select_students/            # Select students
POST /sponsors/sponsor_batch/              # Sponsor a batch
POST /sponsors/create_order/               # Create order
POST /sponsors/verify-payment/             # Verify payment
POST /sponsors/webhook/                    # Payment webhook
```

### Recruiter Management
```
GET /recruiter/                            # List recruiters
POST /recruiter/Recruiter_update/          # Update recruiter info
GET /recruiter/ready_for_recruitment/      # Ready for recruitment
POST /recruiter/select_students/           # Select students
```

### Trainer Management
```
GET /trainers/                             # List trainers
GET /trainers/single-trainer/              # Single trainer details
GET /Trainer/get_selected-students/        # Get selected students
GET /trainers/batches/                     # Trainer's batches
GET /trainers/batches/<int:batch_id>/      # Specific batch
GET /trainer/students/                     # Trainer's students
POST /Trainer/trainer_select/              # Trainer selection
```

### Batch Management
```
GET /batches/                              # All batches
GET /batchstatuses/                        # Batch statuses
POST /batches/students_in_batch/           # Students in batch
GET /batches/trainer_stats/                # Trainer statistics
POST /batches/assign-trainers/             # Assign trainers
GET /batches/center-summary/               # Center summary
POST /batches/assign_trainers_for_admin/   # Admin trainer assignment
GET /batches/people/                       # Batch people info
```

### Assessment Management
```
GET /assessment/                           # Assessment data
PUT /assessment/update/<int:assessment_id>/ # Update assessment
```

### Interview Management
```
GET /interview-schedules/                  # Interview schedules
GET /interview-schedules/users-by-role/?role=enabler&subrole=sponsor
```

### Assignment Management
```
GET /assignments/                          # All assignments
GET /assignments/batch-analytics/          # Batch analytics
```

### Submission Management
```
GET /submissions/                          # All submissions
POST /submissions/evaluate/                # Evaluate submission
```

### Admin Management
```
GET /admin/assignments/dashboard/          # Admin dashboard
GET /admin/batch-performance/              # Batch performance
```

### Proposal & Classification
```
GET /Proposer/                             # Proposers
GET /proposerstatuses/                     # Proposer statuses
```

### Common Endpoints
```
GET /classwork/                            # Classwork
GET /technology/                           # Technologies
GET /training-center/                      # Training centers
```

### Recruitment Management
```
GET /recruitment/                          # Recruitment data
GET /recruitment/requests/                 # Recruitment requests
GET /recruitment/available_students/       # Available students
POST /recruitment/<id>/assign_to_recruiter/ # Assign to recruiter
PUT /recruitment/update_status/            # Update status
POST /recruitment/send_confirmation_request/ # Send confirmation
POST /recruitment/<id>/student_reply/      # Student reply
```

### BookHub Endpoints (all sub-endpoints)
```
GET /bookhub/books/                        # All books
POST /bookhub/books/                       # Create book
GET /bookhub/comments/                     # Book comments
POST /bookhub/comments/                    # Add comment
GET /bookhub/admin/access/                 # Admin access management
... (and all other bookhub sub-endpoints)
```

### Notification Endpoints (all sub-endpoints)
```
GET /notifications/unread/                 # Unread notifications
POST /notifications/save-token/            # Save FCM token
... (and all other notification endpoints)
```

### WhatsApp Endpoints (all sub-endpoints)
```
POST /whatsapp/create-interview-group/     # Create interview group
... (and all other whatsapp endpoints)
```

---

## Implementation in Components

### Using AUTH Endpoints (after authenticated)
```javascript
import { AuthContext } from "@/contexts/authContext";
import axios from "axios";

function MyComponent() {
  const { API_BASE_URL } = useContext(AuthContext);
  
  // This will use AUTH_BASE_URL (/s/)
  const response = await axios.post(`${API_BASE_URL}/change-password/`, data);
}
```

### Using TECHNO Endpoints
```javascript
import { TECHNO_BASE_URL } from "@/environment";
import axios from "axios";

function MyComponent() {
  // This will use TECHNO_BASE_URL (/techno/)
  const response = await axios.get(`${TECHNO_BASE_URL}/batches/`);
}
```

### Using Helper Utility
```javascript
import { buildApiUrl } from "@/utils/apiConfig";
import axios from "axios";

function MyComponent() {
  // Auto-determines correct base URL
  const batchUrl = buildApiUrl("batches");        // → /techno/batches/
  const loginUrl = buildApiUrl("login");          // → /s/login/
  
  const response = await axios.get(batchUrl);
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/environment.jsx` | Added comprehensive endpoint documentation |
| `src/utils/apiConfig.js` | Complete endpoint classification for both base URLs |
| `src/contexts/authContext.jsx` | Exports AUTH_BASE_URL and TECHNO_BASE_URL |
| Multiple components | Updated to use TECHNO_BASE_URL for techno endpoints |

---

## Quick Switching Between Environments

Simply edit `src/environment.jsx`:

```javascript
// 1. Local Development
export const AUTH_BASE_URL = "http://127.0.0.1:8000/s";
export const TECHNO_BASE_URL = "http://127.0.0.1:8000/techno";

// 2. Production
export const AUTH_BASE_URL = "https://api.lgctechnohub.in/s";
export const TECHNO_BASE_URL = "https://api.lgctechnohub.in/techno";

// 3. Staging
export const AUTH_BASE_URL = "https://staging.lgctechnohub.in/s";
export const TECHNO_BASE_URL = "https://staging.lgctechnohub.in/techno";
```

---

## Notes

✅ All authentication endpoints (login, logout, register, etc.) use `/s/` path  
✅ All application endpoints (batches, trainers, notifications, etc.) use `/techno/` path  
✅ Backward compatibility maintained through API_BASE_URL export  
✅ Comprehensive documentation in environment.jsx and apiConfig.js  
✅ Helper utilities available for automatic URL selection  
✅ All major components updated to use correct base URLs  
