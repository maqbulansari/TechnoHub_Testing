import React from "react";
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
const ALLRoutes = () => {
    const routes = all_routes;
    return (<Routes>
      {/* Public routes */}
      <Route path="/" element={<Defaultlayout />}>
        <Route index element={<Landing_page />}/>
        <Route path={routes.login3} element={<Login />}/>
        <Route path={routes.register3} element={<Register3 />}/>
        <Route path={routes.register} element={<Register />}/>
        <Route path={routes.forgotPassword} element={<ForgotPassword />}/>
        <Route path={routes.resetPassword} element={<ResetPassword />}/>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Defaultlayout />}>
          <Route path={routes.changePassword} element={<ChangePassword />}/>

          <Route path="/Students_SponserDashboard" element={<Students_SponserDashboard />}/>
          <Route path="/Interviewee" element={<Interviewee />}/>
          <Route path="/ReadyToRecruitDashboard" element={<RecruitmentDashboard />}/>
          <Route path="/Students_profile" element={<StudentsProfile />}/>
          <Route path="/Recruitment_Profile" element={<RecruitmentProfile />}/>
          <Route path="/Sponsor_Profile" element={<Sponsor_Profile />}/>
          <Route path="/Students_batches" element={<StudentsBatches />}/>
          <Route path="/Trainer_profile" element={<TrainerProfile />}/>
          <Route path="/Admission_table" element={<AdmissionTable />}/>
          <Route path="/interview-candidate/:id" element={<InterviewCandidate />}/>
          <Route path="/AllIntervieweesInformation" element={<AllIntervieweesInformation />}/>
          <Route path="/Trainer_batch" element={<TrainerBatch />}/>
          <Route path="/TrainerBatchDetail/:batchId" element={<TrainerBatchDetail />}/>
          <Route path="/AssessmentTable" element={<AssessmentTable />}/>
          <Route path="/AssessmentSelectedStudent" element={<AssessmentSelectedStudents />}/>
          <Route path="/AssessmentCandidte/:id" element={<AssessmentCandidte />}/>
          <Route path="/AssignBatch" element={<AssignBatch />}/> 
          <Route path="/StudentInformation" element={<StudentInformation />}/> 
          <Route path="/AllTrainer" element={<AllTrainer />}/> 
          <Route path="/AllStudent" element={<AllStudent />}/> 
          <Route path="/AssignBatchForTrainer" element={<AssignBatchForTrainer />}/> 
          <Route path="/StudentInformation" element={<StudentInformation />}/>
          <Route path="/RecuriterTable" element={<RecruiterTable />}/>
          <Route path="/Sponsor_Table" element={<SponsorTable />}/>
          <Route path="/Sponsored_Students" element={<SponsoredStudents />}/>
          <Route path="/AssignTrainerForInterview" element={<AssignTrainerForInterview />}/>
          <Route path="/SelectedTrainerForInterview" element={<SelectedTrainerForInterview />}/>
        </Route>
      </Route>

      {/* Feature-based route groups */}
      <Route element={<Feature />}>
        {publicRoutes.map((route, idx) => (<Route path={route.path} element={route.element} key={idx}/>))}
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (<Route path={route.path} element={route.element} key={idx}/>))}
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<StudentFeature />}>
          {Student.map((route, idx) => (<Route path={route.path} element={route.element} key={idx}/>))}
        </Route>
      </Route>

      {/* Fallback routes */}
      <Route path="/forbidden" element={<Forbidden />}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>);
};
export default ALLRoutes;
