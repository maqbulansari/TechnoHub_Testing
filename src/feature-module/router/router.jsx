// import React, { useContext, useEffect } from "react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import { authRoutes, publicRoutes } from "./router.link";
// import { Student } from "./student_routes";
// import Feature from "../feature";
// import AuthFeature from "../authFeature";
// import Login from "../auth/login/login-3";
// import Register3 from "../auth/register/register-3";
// import StudentFeature from "../studentFeature";
// import Defaultlayout from "../../components/Defaultlayout";
// import { all_routes } from "./all_routes";
// import StudentsProfile from "../../components/Student_dashboard/StudentsProfile";
// import { Landing_page } from "../../components/Landing_Page/Landing_page";
// import StudentsBatches from "../../components/Student_dashboard/StudentsBatches";
// import TrainerProfile from "../../components/Trainer_dashboard/TrainerProfile";
// import { Students_SponserDashboard } from "../../components/Sponser_Dashboard/Students_SponserDashboard";
// import { RecruitmentDashboard } from "../../components/RecruitmentDashboard/RecruitmentDashboard";
// import Sponsor_Profile from "../../components/Sponser_Dashboard/SponsorProfile";
// import AdmissionTable from "../../components/Admission_dashboard/Admission_table";
// import InterviewCandidate from "../../components/Admission_dashboard/InterviewCandidate";
// import AllIntervieweesInformation from "../../components/Admission_dashboard/AllIntervieweesInformation";
// import TrainerBatch from "../../components/Trainer_dashboard/TrainerBatch";
// import TrainerBatchDetail from "../../components/Trainer_dashboard/TrainerBatchDetail";
// import AssessmentTable from "../../components/Assessment_dashboard/AssessmentTable";
// import AssessmentCandidte from "../../components/Assessment_dashboard/AssessmentCandidte";
// import { Forbidden } from "../../components/Forbidden/Forbidden";
// import RecruitmentProfile from "../../components/RecruitmentDashboard/RecruitmentProfile";
// import Register from "../auth/register/register";
// import { ProtectedRoute } from "../../components/PrivateRoute/Private";
// import { RoleProtectedRoute } from "../../components/PrivateRoute/RoleProtectedRoute";
// import { Interviewee } from "../../components/Interview/Interviewee";
// import AssignBatch from "../../components/Admission_dashboard/AssignBatch";
// import StudentInformation from "../../components/Assessment_dashboard/StudentInformation";
// import AllTrainer from "../../components/Trainer_dashboard/AllTrainer";
// import AllStudent from "../../components/Student_dashboard/AllStudent";
// import AssignBatchForTrainer from "../../components/Trainer_dashboard/AssignBatchForTrainer";
// import { RecruiterTable } from "../../components/RecruitmentDashboard/RecruiterTable";
// import { SponsorTable } from "../../components/Sponser_Dashboard/SponsorTable";
// import { SponsoredStudents } from "../../components/Sponser_Dashboard/SponsoredStudents";
// import ForgotPassword from "../auth/forgotPassword/forgotPassword";
// import ResetPassword from "../auth/resetPassword/resetPassword";
// import { ChangePassword } from "../auth/changePassword/ChangePassword";
// import AssessmentSelectedStudents from "../../components/Assessment_dashboard/AssessmentSelectedStudents";
// import AssignTrainerForInterview from "@/components/Admission_dashboard/AssignTrainerForInterview";
// import SelectedTrainerForInterview from "@/components/Admission_dashboard/SelectedTrainerForInterview";
// import { CreateBatches } from "@/components/Batches/CreateBatches";
// import { AllBatches } from "@/components/Batches/AllBatches";
// import { EditBatch } from "@/components/Batches/EditBatch";
// import { CreateAssignments } from "@/components/Assignments/CreateAssignments";
// import AllAssignments from "@/components/Assignments/AllAssignments";
// import { StudentAssignment } from "@/components/Assignments/StudentAssignment";
// import AssignmentComments from "@/components/Assignments/AssignmentComments";
// import Notifications from "@/components/Notifications";
// import { getFCMToken } from "@/firebase/notificationsHelper";
// import { AuthContext } from "@/contexts/authContext";
// import axios from "axios";
// import { TermAndConditions } from "@/components/Landing_Page/TermAndConditions";
// import { BookhubHome } from "@/components/BookHub/BookhubHome";
// import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";
// import { AdminProfile } from "@/components/AdminDashboard/AdminProfile";
// import AdminAccessManager from "@/components/BookHub/AdminAccessManager";
// import BookDetail from "@/components/BookHub/BookDetail";
// import CreateBook from "@/components/BookHub/CreateBook";
// import  Courses from "@/components/Batches/Courses";
// import RecruitmentApprovalTable from "@/components/RecruitmentDashboard/RecruitmentAdminAskStu";
// import { StuRecuitment } from "@/components/RecruitmentDashboard/StuRecuitment";
// import { RecruiterHire } from "@/components/RecruitmentDashboard/RecruiterHire";
// import RecruitmentAssignment from "@/components/RecruitmentDashboard/RecruitmentAssignment";



// const ALLRoutes = () => {
//   const routes = all_routes;
//   const { API_BASE_URL, accessToken } = useContext(AuthContext);

//   useEffect(() => {
//     if (!accessToken) return;

//     const isTokenSaved = localStorage.getItem("fcm_token");
//     if (isTokenSaved) {
//       console.log("FCM token already saved on backend");
//       return;
//     }

//     getFCMToken().then((token) => {
//       if (!token) return;

//       axios
//         .post(
//           `${API_BASE_URL}/notifications/save-token/`,
//           { token },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             },
//           }
//         )
//         .then(() => {
//           localStorage.setItem("fcm_token", "true");
//         })
//         .catch(console.error);
//     });
//   }, [accessToken]);


//   return (<Routes>
//     {/* Public routes */}
//     <Route path="/" element={<Defaultlayout />}>
//       <Route index element={<Landing_page />} />
//       <Route path={routes.login3} element={<Login />} />
//       <Route path={routes.register3} element={<Register3 />} />
//       <Route path={routes.register} element={<Register />} />
//       <Route path={routes.forgotPassword} element={<ForgotPassword />} />
//       <Route path={routes.resetPassword} element={<ResetPassword />} />
//       <Route path="/terms" element={<TermAndConditions />} />
//       <Route path="/Bookhub" element={<BookhubHome />} />
//       <Route path="/Courses" element={<Courses />} />
//       <Route path="/bookhub/book/:bookId" element={<BookDetail />} />

//     </Route>

//     {/* Public routes */}
//     <Route path="/Bookhub" element={<Defaultlayout />}>
//       <Route path="Home" element={<BookhubHome />} />
      
//     </Route>     

//     <Route element={<ProtectedRoute />}>
//       <Route path="/" element={<Defaultlayout />}>
//         <Route path={routes.changePassword} element={<ChangePassword />} />

//         {/* Student Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["STUDENT"]} />}>
//           <Route path="/Students_profile" element={<StudentsProfile />} />
//           <Route path="/Students_batches" element={<StudentsBatches />} />
//           <Route path="/StudentAssignment" element={<StudentAssignment />} />
//           <Route path="/AssignmentComments/:assignmentId" element={<AssignmentComments />} />
//           <Route path="/StuRecuitment" element={<StuRecuitment />} />
//         </Route>

//         {/* Trainer Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["TRAINER"]} />}>
//           <Route path="/Trainer_profile" element={<TrainerProfile />} />
//           <Route path="/Trainer_batch" element={<TrainerBatch />} />
//           <Route path="/TrainerBatchDetail/:batchId" element={<TrainerBatchDetail />} />
//           <Route path="/AssignBatchForTrainer" element={<AssignBatchForTrainer />} />
//           <Route path="/CreateAssignments/:batchId" element={<CreateAssignments />} />
//           <Route path="/AllAssignments/:batchId" element={<AllAssignments />} />
//         </Route>

//         {/* Admission Officer Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["ADMISSION_OFFICER"]} />}>
//           <Route path="/Admission_table" element={<AdmissionTable />} />
//           <Route path="/interview-candidate/:id" element={<InterviewCandidate />} />
//           <Route path="/AllIntervieweesInformation" element={<AllIntervieweesInformation />} />
//           <Route path="/AssignBatch" element={<AssignBatch />} />
//           <Route path="/AssignTrainerForInterview" element={<AssignTrainerForInterview />} />
//           <Route path="/SelectedTrainerForInterview" element={<SelectedTrainerForInterview />} />
//         </Route>

//         {/* Assessment Officer Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["ASSESSMENT_OFFICER"]} />}>
//           <Route path="/AssessmentTable" element={<AssessmentTable />} />
//           <Route path="/AssessmentSelectedStudent" element={<AssessmentSelectedStudents />} />
//           <Route path="/AssessmentCandidte/:id" element={<AssessmentCandidte />} />
//           <Route path="/StudentInformation" element={<StudentInformation />} />
//         </Route>

//         {/* Sponsor Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["SPONSOR"]} />}>
//           <Route path="/Students_SponserDashboard" element={<Students_SponserDashboard />} />
//           <Route path="/Sponsor_Profile" element={<Sponsor_Profile />} />
//           <Route path="/Sponsor_Table" element={<SponsorTable />} />
//           <Route path="/Sponsored_Students" element={<SponsoredStudents />} />
//         </Route>

//         {/* Recruiter Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["RECRUITER"]} />}>
//           <Route path="/ReadyToRecruitDashboard" element={<RecruitmentDashboard />} />
//           <Route path="/RecuriterTable" element={<RecruiterTable />} />
//           <Route path="/Recruitment_Profile" element={<RecruitmentProfile />} />
//           <Route path="/RecruiterHire" element={<RecruiterHire />} />
//           <Route path="/RecruitmentAssignment" element={<RecruitmentAssignment />} />
//         </Route>

//         {/* Admin Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
//           <Route path="/adminDashboard" element={<AdminDashboard />} />
//           <Route path="/Admin_Profile" element={<AdminProfile />} />
//           <Route path="/AdminAccessManager" element={<AdminAccessManager />} />
//           <Route path="/AllTrainer" element={<AllTrainer />} />
//           <Route path="/AllStudent" element={<AllStudent />} />
//           <Route path="/CreateBatches" element={<CreateBatches />} />
//           <Route path="/AllBatches" element={<AllBatches />} />
//           <Route path="/EditBatch/:batchId" element={<EditBatch />} />
//           <Route path="/RecruitmentApprovalTable" element={<RecruitmentApprovalTable />} />
//            <Route path="/RecruitmentAssignment" element={<RecruitmentAssignment />} />
//           <Route path="/bookhub/CreateBook" element={<CreateBook />} />
//         </Route>

//         {/* Interviewee Routes */}
//         <Route element={<RoleProtectedRoute allowedRoles={["INTERVIEWEE"]} />}>
//           <Route path="/Interviewee" element={<Interviewee />} />
//         </Route>

//         {/* Common Protected Routes (All authenticated users) */}
//         <Route path="/Notifications" element={<Notifications />} />
//         <Route path="/bookhub/book/:bookId" element={<BookDetail />} />
//       </Route>
//     </Route>

//     {/* Feature-based route groups */}
//     <Route element={<Feature />}>
//       {publicRoutes.map((route, idx) => (<Route path={route.path} element={route.element} key={idx} />))}
//     </Route>

//     <Route element={<ProtectedRoute />}>
//       <Route element={<AuthFeature />}>
//         {authRoutes.map((route, idx) => (<Route path={route.path} element={route.element} key={idx} />))}
//       </Route>
//     </Route>

//     <Route element={<ProtectedRoute />}>
//       <Route element={<StudentFeature />}>
//         {Student.map((route, idx) => (<Route path={route.path} element={route.element} key={idx} />))}
//       </Route>
//     </Route>

//     {/* Fallback routes */}
//     <Route path="/forbidden" element={<Forbidden />} />
//     <Route path="*" element={<Navigate to="/" replace />} />
//   </Routes>);

// };
// export default ALLRoutes;
import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { authRoutes, publicRoutes } from "./router.link";
import { Student } from "./student_routes";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login/login-3";
import Register3 from "../auth/register/register-3";
import StudentFeature from "../studentFeature";
import Defaultlayout from "../../components/Defaultlayout";
import { all_routes } from "./all_routes";
import StudentsProfile from "../../components/Student_dashboard/StudentsProfile";
import { Landing_page } from "../../components/Landing_Page/Landing_page";
import StudentsBatches from "../../components/Student_dashboard/StudentsBatches";
import TrainerProfile from "../../components/Trainer_dashboard/TrainerProfile";
import { Students_SponserDashboard } from "../../components/Sponser_Dashboard/Students_SponserDashboard";
import { RecruitmentDashboard } from "../../components/RecruitmentDashboard/RecruitmentDashboard";
import Sponsor_Profile from "../../components/Sponser_Dashboard/SponsorProfile";
import AdmissionTable from "../../components/Admission_dashboard/Admission_table";
import InterviewCandidate from "../../components/Admission_dashboard/InterviewCandidate";
import AllIntervieweesInformation from "../../components/Admission_dashboard/AllIntervieweesInformation";
import TrainerBatch from "../../components/Trainer_dashboard/TrainerBatch";
import TrainerBatchDetail from "../../components/Trainer_dashboard/TrainerBatchDetail";
import AssessmentTable from "../../components/Assessment_dashboard/AssessmentTable";
import AssessmentCandidte from "../../components/Assessment_dashboard/AssessmentCandidte";
import { Forbidden } from "../../components/Forbidden/Forbidden";
import RecruitmentProfile from "../../components/RecruitmentDashboard/RecruitmentProfile";
import Register from "../auth/register/register";
import { ProtectedRoute } from "../../components/PrivateRoute/Private";
import { Interviewee } from "../../components/Interview/Interviewee";
import AssignBatch from "../../components/Admission_dashboard/AssignBatch";
import StudentInformation from "../../components/Assessment_dashboard/StudentInformation";
import AllTrainer from "../../components/Trainer_dashboard/AllTrainer";
import AllStudent from "../../components/Student_dashboard/AllStudent";
import AssignBatchForTrainer from "../../components/Trainer_dashboard/AssignBatchForTrainer";
import { RecruiterTable } from "../../components/RecruitmentDashboard/RecruiterTable";
import { SponsorTable } from "../../components/Sponser_Dashboard/SponsorTable";
import { SponsoredStudents } from "../../components/Sponser_Dashboard/SponsoredStudents";
import ForgotPassword from "../auth/forgotPassword/forgotPassword";
import ResetPassword from "../auth/resetPassword/resetPassword";
import { ChangePassword } from "../auth/changePassword/ChangePassword";
import AssessmentSelectedStudents from "../../components/Assessment_dashboard/AssessmentSelectedStudents";
import AssignTrainerForInterview from "@/components/Admission_dashboard/AssignTrainerForInterview";
import SelectedTrainerForInterview from "@/components/Admission_dashboard/SelectedTrainerForInterview";
import { CreateBatches } from "@/components/Batches/CreateBatches";
import { AllBatches } from "@/components/Batches/AllBatches";
import { EditBatch } from "@/components/Batches/EditBatch";
import { CreateAssignments } from "@/components/Assignments/CreateAssignments";
import AllAssignments from "@/components/Assignments/AllAssignments";
import { StudentAssignment } from "@/components/Assignments/StudentAssignment";
import AssignmentComments from "@/components/Assignments/AssignmentComments";
import Notifications from "@/components/Notifications";
import { getFCMToken } from "@/firebase/notificationsHelper";
import { AuthContext } from "@/contexts/authContext";
import axios from "axios";
import { TermAndConditions } from "@/components/Landing_Page/TermAndConditions";
import { BookhubHome } from "@/components/BookHub/BookhubHome";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";
import { AdminProfile } from "@/components/AdminDashboard/AdminProfile";
import AdminAccessManager from "@/components/BookHub/AdminAccessManager";
import BookDetail from "@/components/BookHub/BookDetail";
import CreateBook from "@/components/BookHub/CreateBook";
import  Courses from "@/components/Batches/Courses";
import RecruitmentApprovalTable from "@/components/RecruitmentDashboard/RecruitmentAdminAskStu";
import { StuRecuitment } from "@/components/RecruitmentDashboard/StuRecuitment";
import { RecruiterHire } from "@/components/RecruitmentDashboard/RecruiterHire";
import RecruitmentAssignment from "@/components/RecruitmentDashboard/RecruitmentAssignment";
import { AllResources } from "@/components/recource-menagement/AllResources";
import { AUTH_BASE_URL } from "@/environment";



const ALLRoutes = () => {
  const routes = all_routes;
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    if (!accessToken) return;

    const isTokenSaved = localStorage.getItem("fcm_token");
    if (isTokenSaved) {
      console.log("FCM token already saved on backend");
      return;
    }

    getFCMToken().then((token) => {
      if (!token) return;

      axios
        .post(
          `${AUTH_BASE_URL}/notifications/save-token/`,
          { token },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        )
        .then(() => {
          localStorage.setItem("fcm_token", "true");
        })
        .catch(console.error);
    });
  }, [accessToken]);


  return (<Routes>
    {/* Public routes */}
    <Route path="/" element={<Defaultlayout />}>
      <Route index element={<Landing_page />} />
      <Route path={routes.login3} element={<Login />} />
      <Route path={routes.register3} element={<Register3 />} />
      <Route path={routes.register} element={<Register />} />
      <Route path={routes.forgotPassword} element={<ForgotPassword />} />
      <Route path={routes.resetPassword} element={<ResetPassword />} />
      <Route path="/terms" element={<TermAndConditions />} />
      <Route path="/Bookhub" element={<BookhubHome />} />
      <Route path="/Courses" element={<Courses />} />
      <Route path="/bookhub/book/:bookId" element={<BookDetail />} />

    </Route>

    {/* Public routes */}
    <Route path="/Bookhub" element={<Defaultlayout />}>
      <Route path="Home" element={<BookhubHome />} />
      
    </Route>     

    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Defaultlayout />}>
        <Route path={routes.changePassword} element={<ChangePassword />} />
        <Route path="/Students_SponserDashboard" element={<Students_SponserDashboard />} />
        <Route path="/Interviewee" element={<Interviewee />} />
        <Route path="/ReadyToRecruitDashboard" element={<RecruitmentDashboard />} />
        <Route path="/Students_profile" element={<StudentsProfile />} />
        <Route path="/Recruitment_Profile" element={<RecruitmentProfile />} />
        <Route path="/Sponsor_Profile" element={<Sponsor_Profile />} />
        <Route path="/Students_batches" element={<StudentsBatches />} />
        <Route path="/Trainer_profile" element={<TrainerProfile />} />
        <Route path="/Admission_table" element={<AdmissionTable />} />
        <Route path="/interview-candidate/:id" element={<InterviewCandidate />} />
        <Route path="/AllIntervieweesInformation" element={<AllIntervieweesInformation />} />
        <Route path="/Trainer_batch" element={<TrainerBatch />} />
        <Route path="/TrainerBatchDetail/:batchId" element={<TrainerBatchDetail />} />
        <Route path="/AssessmentTable" element={<AssessmentTable />} />
        <Route path="/AssessmentSelectedStudent" element={<AssessmentSelectedStudents />} />
        <Route path="/AssessmentCandidte/:id" element={<AssessmentCandidte />} />
        <Route path="/AssignBatch" element={<AssignBatch />} />
        <Route path="/StudentInformation" element={<StudentInformation />} />
        <Route path="/AllTrainer" element={<AllTrainer />} />
        <Route path="/AllStudent" element={<AllStudent />} />
        <Route path="/AssignBatchForTrainer" element={<AssignBatchForTrainer />} />
        <Route path="/StudentInformation" element={<StudentInformation />} />
        <Route path="/RecuriterTable" element={<RecruiterTable />} />
        <Route path="/Sponsor_Table" element={<SponsorTable />} />
        <Route path="/Sponsored_Students" element={<SponsoredStudents />} />
        <Route path="/AssignTrainerForInterview" element={<AssignTrainerForInterview />} />
        <Route path="/SelectedTrainerForInterview" element={<SelectedTrainerForInterview />} />
        <Route path="/CreateBatches" element={<CreateBatches />} />
        <Route path="/AllBatches" element={<AllBatches />} />
        <Route path="/EditBatch/:batchId" element={<EditBatch />} />
        <Route path="/CreateAssignments/:batchId" element={<CreateAssignments />} />
        <Route path="/AllAssignments/:batchId" element={<AllAssignments />} />
        <Route path="/StudentAssignment" element={<StudentAssignment />} />
        <Route path="/AssignmentComments/:assignmentId" element={<AssignmentComments />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/Admin_Profile" element={<AdminProfile />} />
        <Route path="/AdminAccessManager" element={<AdminAccessManager />} />
         <Route path="/bookhub/book/:bookId" element={<BookDetail />} />
         <Route path="/bookhub/CreateBook" element={<CreateBook />} />
         <Route path="/RecruitmentApprovalTable" element={<RecruitmentApprovalTable />} />
         <Route path="/StuRecuitment" element={<StuRecuitment />} />
         <Route path="/RecruiterHire" element={<RecruiterHire />} />
         <Route path="/RecruitmentAssignment" element={<RecruitmentAssignment />} />
         <Route path="/AllResorces" element={<AllResources />} />
      </Route>

    </Route>

    {/* Feature-based route groups */}
    <Route element={<Feature />}>
      {publicRoutes.map((route, idx) => (<Route path={route.path} element={route.element} key={idx} />))}
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<AuthFeature />}>
        {authRoutes.map((route, idx) => (<Route path={route.path} element={route.element} key={idx} />))}
      </Route>
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<StudentFeature />}>
        {Student.map((route, idx) => (<Route path={route.path} element={route.element} key={idx} />))}
      </Route>
    </Route>

    {/* Fallback routes */}
    <Route path="/forbidden" element={<Forbidden />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>);

};
export default ALLRoutes;