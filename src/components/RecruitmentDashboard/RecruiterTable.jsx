import { useContext, useState, useEffect } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

export const RecruiterTable = () => {
  const { recruiterProfileDetails, FetchRecuiter, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { role, responseSubrole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recruiter data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "RECRUITER" || role === "ADMIN") && !dataFetched['recruiter']) {
      FetchRecuiter()
        .then(() => {
          setDataFetched(prev => ({ ...prev, 'recruiter': true }));
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (recruiterProfileDetails && recruiterProfileDetails.length > 0) {
      setLoading(false);
    }
  }, [responseSubrole, role, dataFetched, FetchRecuiter, setDataFetched, recruiterProfileDetails]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error text-center">Error fetching data: {error}</div>;
  }

  const sortedRecruiters = [...recruiterProfileDetails].sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="px-2 mt-20">
      <h1 className="sponsornowHeading">Recruiters</h1>
      <div className="table-wrapperS overflow-y-auto">
        <table className="student-tableS">
          <thead className="thead z-2 sticky top-0">
            <tr>
              <th className="text-nowrap ">Name</th>
              <th className="text-nowrap">Company</th>
              <th className="text-nowrap">Email</th>
              <th className="text-nowrap">Gender</th>
              <th className="text-nowrap">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecruiters.length > 0 ? (
              sortedRecruiters.map((profile) => (
                <tr key={profile.id} className="tr">
                  <td className="student-nameS text-nowrap capitalize">{profile.first_name} {profile.last_name}</td>
                  <td className="text-nowrap capitalize">{profile.company_name}</td>
                  <td className="text-nowrap">{profile.email}</td>
                  <td className="text-nowrap">{profile.gender || "N/A"}</td>
                  <td className="text-nowrap">{profile.mobile_no}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Recruiters Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
