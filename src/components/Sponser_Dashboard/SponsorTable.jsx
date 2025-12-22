import React, { useContext, useState, useEffect } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

export const SponsorTable = () => {
  const { sponsorProfileDetails, FetchSponsor, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { role, responseSubrole } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sponsor data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "SPONSOR" || role === "ADMIN") && !dataFetched['sponsor']) {
      FetchSponsor()
        .then(() => setDataFetched(prev => ({ ...prev, 'sponsor': true })))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (sponsorProfileDetails && sponsorProfileDetails.length > 0) {
      setLoading(false);
    }
  }, [responseSubrole, role, dataFetched, FetchSponsor, setDataFetched, sponsorProfileDetails]);

  if (loading) {
    return (
     <Loading />
    );
  }

  if (error) {
    return <div className="error text-center">Error fetching data: {error}</div>;
  }

  const sortedSponsors = [...sponsorProfileDetails].sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="px-2 mt-16">
      <h1 className="sponsornowHeading pt-4">Sponsors</h1>
      <div className="table-wrapperS overflow-y-auto">
        <table className="student-tableS">
          <thead className="thead z-2 sticky top-0">
            <tr>
              <th className="text-nowrap ">Name</th>
              <th className="text-nowrap">Company</th>
              <th className="text-nowrap">Email</th>
              <th className="text-nowrap">Gender</th>
              <th className="text-nowrap">Mobile</th>
              <th className="text-nowrap">Contribution Value</th>
              <th className="text-nowrap">Contribution Type</th>
            </tr>
          </thead>
          <tbody>
            {sortedSponsors.length > 0 ? (
              sortedSponsors.map(profile => (
                <tr key={profile.id} className="tr">
                  <td className="text-nowrap capitalize">{profile.first_name} {profile.last_name}</td>
                  <td className="text-nowrap capitalize">{profile.company_name}</td>
                  <td className="text-nowrap">{profile.email}</td>
                  <td className="text-nowrap capitalize">{profile.gender || "N/A"}</td>
                  <td className="text-nowrap">{profile.mobile_no}</td>
                  <td className="text-nowrap">₹ {profile.contribution_value}</td>
                  <td className="text-nowrap">{profile.contribution_type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No Sponsors Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
