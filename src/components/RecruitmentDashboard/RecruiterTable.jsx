// import { useContext } from "react";
// import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";

// export const RecruiterTable = () => {
//   const { recruiterProfileDetails } = useContext(SponsorContext);
//   return (
//     <div className="px-2">
//       <h1 className="sponsornowHeading">
//         Recruiters
//       </h1>
//       <div className="table-responsive">
//         <table>
//           <thead>
//             <tr>
//               {/* <th className="text-nowrap">User Profile</th> */}
//               <th className="text-nowrap">Name</th>
//               <th className="text-nowrap">Company</th>
//               <th className="text-nowrap">Email</th>
//               <th className="text-nowrap">Gender</th>
//               {/* <th className="text-nowrap">Qualification</th> */}
//               <th className="text-nowrap">Mobile</th>
//               {/* <th className="text-nowrap">Identity</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {recruiterProfileDetails.length > 0 ? (
//               recruiterProfileDetails.map((profile) => (
//                 <tr>
//                   {/* <td>{profile.image}</td> */}
//                   <td className="text-nowrap">{profile.first_name} {profile.last_name}</td>
//                   <td className="text-nowrap">{profile.company_name}</td>
//                   <td className="text-nowrap">{profile.email}</td>
//                   <td className="text-nowrap">{profile.gender}</td>
//                   {/* <td className="text-nowrap">{profile.qualification}</td> */}
//                   <td className="text-nowrap">{profile.mobile_no}</td>
//                   {/* <td className="text-nowrap">{profile.identity}</td> */}
//                 </tr>
//               ))
//             ) : (
//               <tr className="text-center p-3 w-100">
//                 <td colSpan={8}>No Recruiters Found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };


import { useContext,useState,useEffect } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";

export const RecruiterTable = () => {
  const { recruiterProfileDetails, FetchRecuiter, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { role, responseSubrole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recruiter data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "RECRUITER" || role === "ADMIN") && !dataFetched['recruiter']) {
      FetchRecuiter().then(() => {
        setDataFetched(prev => ({ ...prev, 'recruiter': true }));
      });
    }
  }, [responseSubrole, role, dataFetched, FetchRecuiter, setDataFetched]);

  useEffect(() => {
    if (recruiterProfileDetails && recruiterProfileDetails.length > 0) {
      setLoading(false);
    }
  }, [recruiterProfileDetails]);

   if (loading) {
    return (
      <div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading ...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error fetching data: {error}</div>;
  }
   const sortedRecruiters = [...recruiterProfileDetails].sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="px-2"><br></br>
      <h1 className="sponsornowHeading">
        Recruiters
      </h1>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              {/* <th className="text-nowrap">User Profile</th> */}
              <th className="text-nowrap">Name</th>
              <th className="text-nowrap">Company</th>
              <th className="text-nowrap">Email</th>
              <th className="text-nowrap">Gender</th>
              {/* <th className="text-nowrap">Qualification</th> */}
              <th className="text-nowrap">Mobile</th>
              {/* <th className="text-nowrap">Identity</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedRecruiters.length > 0 ? (
              sortedRecruiters.map((profile) => (
                <tr>
                  {/* <td>{profile.image}</td> */}
                  <td className="text-nowrap capitalize">{profile.first_name} {profile.last_name}</td>
                  <td className="text-nowrap capitalize">{profile.company_name}</td>
                  <td className="text-nowrap">{profile.email}</td>
                  <td className="text-nowrap">{profile.gender}</td>
                  {/* <td className="text-nowrap">{profile.qualification}</td> */}
                  <td className="text-nowrap">{profile.mobile_no}</td>
                  {/* <td className="text-nowrap">{profile.identity}</td> */}
                </tr>
              ))
            ) : (
              <tr className="text-center p-3 w-100">
                <td colSpan={8}>No Recruiters Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

