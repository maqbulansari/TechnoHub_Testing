import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";


export const SponsorContext = createContext();

const SponsorDashboardProvider = ({ children }) => {
  const [usersDataToSponsor, setUserDataToSponsor] = useState([]);
  const [batchName, setBatchName] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [readyForRecruitment, setReadyForRecruitment] = useState([]);
  const [sponsorProfileDetails, setSponsorProfileDetails] = useState([]);
  const [recruiterProfileDetails, setRecruiterProfileDetails] = useState([]);
  const { API_BASE_URL, userLoggedIN, accessToken, role, responseSubrole } = useContext(AuthContext);
  const [batchSummary, setBatchSummary] = useState([]);
  const [dataFetched, setDataFetched] = useState({});
  const [batchSummaryFetched, setBatchSummaryFetched] = useState(false);


  const GET_ALL_STUDENTS_TO_SPONSER = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/sponsors/available_students/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

        }
      );           
      if (response.status == 200) {
        setUserDataToSponsor(response.data.students_to_sponsor);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GET_BATCH = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/batches/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status == 200) {
        setBatchName(response.data);
        setBatchId(response.data.batch_id);
      }
    } catch (error) {
      console.log("batch error", error);
    }
  };

  const GET_READY_FOR_RECRUITMENT = async () => {
    console.log(accessToken);
    try {
      const response = await axios.get(

        `${API_BASE_URL}/recruiter/ready_for_recruitment/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
console.log(response);


      
      if (response.status === 200) {
        setReadyForRecruitment(response.data.technologies_usage);
      }
    } catch (error) {
      console.log("readytorecruit error", error);
    }
  };

  const FetchSponsor = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sponsors/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setSponsorProfileDetails(response.data);
      }
    } catch (error) {
      console.log("sponsor error", error);
    }
  };
  const FetchRecuiter = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recruiter/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (response.status === 200) {
        // Ensure we always set an array
        const data = Array.isArray(response.data) 
          ? response.data 
          : [response.data];
        setRecruiterProfileDetails(data);
      }
    } catch (error) {
      console.error("Recruiter fetch error:", error.response?.data || error.message);
      setRecruiterProfileDetails([]); // Reset to empty array on error
    }
  };

  const fetchAllData = async () => {
    if (userLoggedIN && accessToken) {
      try {
        await Promise.all([
          GET_ALL_STUDENTS_TO_SPONSER(),
          GET_BATCH(),
          GET_READY_FOR_RECRUITMENT(),
          FetchSponsor(),
          FetchRecuiter()
        ]);
      } catch (error) {
        console.log("Error fetching sponsor data:", error);
      }
    }
  };

  // Removed GetTrainerBatches - use fetchAllTrainer from AuthContext instead to avoid duplicate calls
  // This was causing duplicate /trainers/ API calls

  const GetBatchSummary = async ()=>{
    if (batchSummaryFetched || batchSummary.length > 0) return; // Already fetched
    try {
      const response = await axios.get(`${API_BASE_URL}/batches/center-summary/`);
      if(response.status === 200){
        setBatchSummary(response.data);
        setBatchSummaryFetched(true);
      }
    } catch (error) {
      console.log('Batch Summary error', error);
    }
  }

  // Only fetch trainer/batch data when explicitly needed (lazy loading)
  // Removed automatic fetching on mount
  // Route-based fetching is now handled in individual components using useLocation() 
  const value = {
    usersDataToSponsor,
    batchName,
    batchId,
    readyForRecruitment,
    FetchSponsor,
    fetchAllData,
    sponsorProfileDetails,
    recruiterProfileDetails,
    batchSummary,
    // Lazy fetch functions
    GetBatchSummary,
    // Individual fetch functions for route-based fetching
    GET_ALL_STUDENTS_TO_SPONSER,
    GET_BATCH,
    GET_READY_FOR_RECRUITMENT,
    FetchRecuiter,
    dataFetched,
    setDataFetched,
  };

  return (
    <SponsorContext.Provider value={value}>{children}</SponsorContext.Provider>
  );
};

export default SponsorDashboardProvider;
