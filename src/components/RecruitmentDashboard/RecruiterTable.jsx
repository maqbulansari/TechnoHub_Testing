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
      <div className="table-wrapperS  overflow-y-auto ">
        <table className="student-tableS">
          <thead className="thead z-2 sticky top-0">
            <tr>
              {/* <th className="text-nowrap">User Profile</th> */}
              <th className="text-nowrap text-white">Name</th>
              <th className="text-nowrap text-white">Company</th>
              <th className="text-nowrap text-white">Email</th>
              <th className="text-nowrap text-white">Gender</th>
              {/* <th className="text-nowrap">Qualification</th> */}
              <th className="text-nowrap text-white">Mobile</th>
              {/* <th className="text-nowrap">Identity</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedRecruiters.length > 0 ? (
              sortedRecruiters.map((profile) => (
                <tr key={profile.id} className="tr">
                  {/* <td>{profile.image}</td> */}
                  <td className="student-nameS text-nowrap capitalize">{profile.first_name} {profile.last_name}</td>
                  <td className="text-nowrap capitalize">{profile.company_name}</td>
                  <td className="text-nowrap">{profile.email}</td>
                  <td className="text-nowrap">{profile.gender || "N/A"}</td>
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

