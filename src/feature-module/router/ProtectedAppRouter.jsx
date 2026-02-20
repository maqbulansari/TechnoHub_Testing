/**
 * Complete Protected Router Implementation
 * 
 * This router implements all subrole-based access control for the TechnoHub application.
 * Each route is wrapped with ProtectedRoute to ensure proper access control.
 * 
 * Subroles:
 * - STUDENT: Student dashboard and learning materials
 * - TRAINER: Batch management and assessment
 * - CO_TRAINER: Co-trainer dashboard and assessment
 * - RECRUITER: Recruitment management
 * - SPONSOR: Sponsored students management
 * - INTERVIEWEE: Interview participation
 * - ADMISSION_MANAGER: Admission process management
 * - BOOKHUB_MANAGER: Book/resource management
 * - ADMIN: Full system access
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/PrivateRoute/Private";
import Defaultlayout from "@/components/Defaultlayout";

// Public Components
import { Landing_page } from "@/components/Landing_Page/Landing_page";
import Login from "@/feature-module/auth/login/login-3";
import Register3 from "@/feature-module/auth/register/register-3";
import ForgotPassword from "@/feature-module/auth/forgotPassword/forgotPassword";
import ResetPassword from "@/feature-module/auth/resetPassword/resetPassword";
import { TermAndConditions } from "@/components/Landing_Page/TermAndConditions";

// Student Components
import StudentsProfile from "@/components/Student_dashboard/StudentsProfile";
import StudentsBatches from "@/components/Student_dashboard/StudentsBatches";
import AllStudent from "@/components/Student_dashboard/AllStudent";
import { StudentAssignment } from "@/components/Assignments/StudentAssignment";
import { StuRecuitment } from "@/components/RecruitmentDashboard/StuRecuitment";

// Trainer Components
import TrainerProfile from "@/components/Trainer_dashboard/TrainerProfile";
import TrainerBatch from "@/components/Trainer_dashboard/TrainerBatch";
import TrainerBatchDetail from "@/components/Trainer_dashboard/TrainerBatchDetail";
import AllTrainer from "@/components/Trainer_dashboard/AllTrainer";
import AssignBatchForTrainer from "@/components/Trainer_dashboard/AssignBatchForTrainer";

// Admission Components
import AdmissionTable from "@/components/Admission_dashboard/Admission_table";
import InterviewCandidate from "@/components/Admission_dashboard/InterviewCandidate";
import AllIntervieweesInformation from "@/components/Admission_dashboard/AllIntervieweesInformation";
import AssignBatch from "@/components/Admission_dashboard/AssignBatch";
import AssignTrainerForInterview from "@/components/Admission_dashboard/AssignTrainerForInterview";
import SelectedTrainerForInterview from "@/components/Admission_dashboard/SelectedTrainerForInterview";

// Assessment Components
import AssessmentTable from "@/components/Assessment_dashboard/AssessmentTable";
import AssessmentSelectedStudents from "@/components/Assessment_dashboard/AssessmentSelectedStudents";
import AssessmentCandidte from "@/components/Assessment_dashboard/AssessmentCandidte";
import StudentInformation from "@/components/Assessment_dashboard/StudentInformation";

// Assignment Components
import { CreateAssignments } from "@/components/Assignments/CreateAssignments";
import AllAssignments from "@/components/Assignments/AllAssignments";
import AssignmentComments from "@/components/Assignments/AssignmentComments";

// Batch Components
import { CreateBatches } from "@/components/Batches/CreateBatches";
import { AllBatches } from "@/components/Batches/AllBatches";
import { EditBatch } from "@/components/Batches/EditBatch";
import Courses from "@/components/Batches/Courses";

// Recruitment Components
import { RecruitmentDashboard } from "@/components/RecruitmentDashboard/RecruitmentDashboard";
import RecruitmentProfile from "@/components/RecruitmentDashboard/RecruitmentProfile";
import { RecruiterTable } from "@/components/RecruitmentDashboard/RecruiterTable";
import { RecruiterHire } from "@/components/RecruitmentDashboard/RecruiterHire";
import RecruitmentAssignment from "@/components/RecruitmentDashboard/RecruitmentAssignment";
import RecruitmentApprovalTable from "@/components/RecruitmentDashboard/RecruitmentAdminAskStu";

// Sponsor Components
import { Students_SponserDashboard } from "@/components/Sponser_Dashboard/Students_SponserDashboard";
import Sponsor_Profile from "@/components/Sponser_Dashboard/SponsorProfile";
import { SponsorTable } from "@/components/Sponser_Dashboard/SponsorTable";
import { SponsoredStudents } from "@/components/Sponser_Dashboard/SponsoredStudents";

// Interviewee Components
import { Interviewee } from "@/components/Interview/Interviewee";

// BookHub Components
import { BookhubHome } from "@/components/BookHub/BookhubHome";
import BookDetail from "@/components/BookHub/BookDetail";
import CreateBook from "@/components/BookHub/CreateBook";
import AdminAccessManager from "@/components/BookHub/AdminAccessManager";

// Admin Components
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";
import { AdminProfile } from "@/components/AdminDashboard/AdminProfile";

// Other Components
import Notifications from "@/components/Notifications";
import { ChangePassword } from "@/feature-module/auth/changePassword/ChangePassword";
import { Forbidden } from "@/components/Forbidden/Forbidden";
import AllResources from "@/components/recource-menagement/AllResources";

/**
 * ProtectedAppRouter Component
 * 
 * Main router with all protected routes organized by subrole.
 * Uses ProtectedRoute wrapper for access control.
 */
export default function ProtectedAppRouter() {
  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES (No authentication required)
          ============================================ */}
      <Route path="/" element={<Landing_page />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register3 />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<TermAndConditions />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* ============================================
          STUDENT ROUTES (allowedSubroles: STUDENT)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["STUDENT"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Students_profile" element={<StudentsProfile />} />
        <Route path="/Students_batches" element={<StudentsBatches />} />
        <Route path="/Admission_table" element={<AdmissionTable />} />
        <Route path="/StuRecuitment" element={<StuRecuitment />} />
        <Route path="/StudentAssignment" element={<StudentAssignment />} />
      </Route>

      {/* ============================================
          TRAINER ROUTES (allowedSubroles: TRAINER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["TRAINER"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Trainer_profile" element={<TrainerProfile />} />
        <Route path="/Trainer_batch" element={<TrainerBatch />} />
        <Route
          path="/TrainerBatchDetail/:batchId"
          element={<TrainerBatchDetail />}
        />
        <Route path="/AssessmentTable" element={<AssessmentTable />} />
        <Route path="/AssignBatch" element={<AssignBatch />} />
        <Route
          path="/CreateAssignments/:batchId"
          element={<CreateAssignments />}
        />
        <Route
          path="/AllAssignments/:batchId"
          element={<AllAssignments />}
        />
      </Route>

      {/* ============================================
          CO-TRAINER ROUTES (allowedSubroles: CO_TRAINER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["CO_TRAINER"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Trainer_profile" element={<TrainerProfile />} />
        <Route path="/Trainer_batch" element={<TrainerBatch />} />
        <Route
          path="/TrainerBatchDetail/:batchId"
          element={<TrainerBatchDetail />}
        />
        <Route path="/AssessmentTable" element={<AssessmentTable />} />
        <Route
          path="/AssessmentCandidte/:id"
          element={<AssessmentCandidte />}
        />
      </Route>

      {/* ============================================
          RECRUITER ROUTES (allowedSubroles: RECRUITER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["RECRUITER"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Recruitment_Profile" element={<RecruitmentProfile />} />
        <Route
          path="/ReadyToRecruitDashboard"
          element={<RecruitmentDashboard />}
        />
        <Route path="/RecruiterHire" element={<RecruiterHire />} />
      </Route>

      {/* ============================================
          SPONSOR ROUTES (allowedSubroles: SPONSOR)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["SPONSOR"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Sponsor_Profile" element={<Sponsor_Profile />} />
        <Route
          path="/Students_SponserDashboard"
          element={<Students_SponserDashboard />}
        />
        <Route path="/Sponsored_Students" element={<SponsoredStudents />} />
      </Route>

      {/* ============================================
          INTERVIEWEE ROUTES (allowedSubroles: INTERVIEWEE)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["INTERVIEWEE"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Interviewee" element={<Interviewee />} />
        <Route
          path="/interview-candidate/:id"
          element={<InterviewCandidate />}
        />
      </Route>

      {/* ============================================
          ADMISSION MANAGER ROUTES (allowedSubroles: ADMISSION_MANAGER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["ADMISSION_MANAGER"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Admission_table" element={<AdmissionTable />} />
        <Route
          path="/AssignTrainerForInterview"
          element={<AssignTrainerForInterview />}
        />
        <Route
          path="/SelectedTrainerForInterview"
          element={<SelectedTrainerForInterview />}
        />
        <Route
          path="/interview-candidate/:id"
          element={<InterviewCandidate />}
        />
        <Route
          path="/AllIntervieweesInformation"
          element={<AllIntervieweesInformation />}
        />
      </Route>

      {/* ============================================
          BOOKHUB MANAGER ROUTES (allowedSubroles: BOOKHUB_MANAGER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedSubroles={["BOOKHUB_MANAGER"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/bookhub" element={<BookhubHome />} />
        <Route path="/bookhub/CreateBook" element={<CreateBook />} />
        <Route path="/bookhub/book/:bookId" element={<BookDetail />} />
        <Route path="/AdminAccessManager" element={<AdminAccessManager />} />
      </Route>

      {/* ============================================
          ASSESSMENT ROUTES (ADMIN, TRAINER, CO_TRAINER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
            allowedSubroles={["TRAINER", "CO_TRAINER"]}
          >
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/AssessmentTable" element={<AssessmentTable />} />
        <Route
          path="/AssessmentSelectedStudent"
          element={<AssessmentSelectedStudents />}
        />
        <Route
          path="/AssessmentCandidte/:id"
          element={<AssessmentCandidte />}
        />
        <Route path="/StudentInformation" element={<StudentInformation />} />
      </Route>

      {/* ============================================
          BATCH MANAGEMENT ROUTES (ADMIN, TRAINER)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
            allowedSubroles={["TRAINER"]}
          >
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/CreateBatches" element={<CreateBatches />} />
        <Route path="/AllBatches" element={<AllBatches />} />
        <Route path="/EditBatch/:batchId" element={<EditBatch />} />
      </Route>

      {/* ============================================
          ADMIN ROUTES (allowedRoles: ADMIN)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Dashboard */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/Admin_Profile" element={<AdminProfile />} />

        {/* Student Management */}
        <Route path="/AllStudent" element={<AllStudent />} />

        {/* Trainer Management */}
        <Route path="/AllTrainer" element={<AllTrainer />} />
        <Route
          path="/AssignBatchForTrainer"
          element={<AssignBatchForTrainer />}
        />

        {/* Recruiter Management */}
        <Route path="/RecuriterTable" element={<RecruiterTable />} />
        <Route
          path="/RecruitmentApprovalTable"
          element={<RecruitmentApprovalTable />}
        />
        <Route path="/RecruitmentAssignment" element={<RecruitmentAssignment />} />

        {/* Sponsor Management */}
        <Route path="/Sponsor_Table" element={<SponsorTable />} />
        <Route path="/Sponsored_Students" element={<SponsoredStudents />} />

        {/* Assessment Management */}
        <Route path="/AssessmentTable" element={<AssessmentTable />} />
        <Route
          path="/AssessmentSelectedStudent"
          element={<AssessmentSelectedStudents />}
        />

        {/* Admission Management */}
        <Route path="/Admission_table" element={<AdmissionTable />} />
        <Route
          path="/AssignTrainerForInterview"
          element={<AssignTrainerForInterview />}
        />
        <Route
          path="/SelectedTrainerForInterview"
          element={<SelectedTrainerForInterview />}
        />

        {/* Batch Management */}
        <Route path="/CreateBatches" element={<CreateBatches />} />
        <Route path="/AllBatches" element={<AllBatches />} />
        <Route path="/EditBatch/:batchId" element={<EditBatch />} />
        <Route path="/Courses" element={<Courses />} />

        {/* BookHub Management */}
        <Route path="/bookhub" element={<BookhubHome />} />
        <Route path="/bookhub/CreateBook" element={<CreateBook />} />
        <Route path="/bookhub/book/:bookId" element={<BookDetail />} />
        <Route path="/AdminAccessManager" element={<AdminAccessManager />} />

        {/* Resources */}
        <Route path="/AllResorces" element={<AllResources />} />
      </Route>

      {/* ============================================
          SESSION ROUTES (All authenticated users)
          ============================================ */}
      <Route
        element={
          <ProtectedRoute>
            <Defaultlayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/bookhub/book/:bookId" element={<BookDetail />} />
        <Route
          path="/AssignmentComments/:assignmentId"
          element={<AssignmentComments />}
        />
      </Route>

      {/* ============================================
          FALLBACK ROUTES
          ============================================ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
