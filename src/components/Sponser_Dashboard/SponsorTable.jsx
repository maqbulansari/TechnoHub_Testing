import React, { useContext, useState, useEffect } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";

export const SponsorTable = () => {
  const { sponsorProfileDetails, FetchSponsor, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { role, responseSubrole } = useContext(AuthContext);
  console.log("sponsorProfileDetails", sponsorProfileDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sponsor data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "SPONSOR" || role === "ADMIN") && !dataFetched['sponsor']) {
      FetchSponsor().then(() => {
        setDataFetched(prev => ({ ...prev, 'sponsor': true }));
      });
    }
  }, [responseSubrole, role, dataFetched, FetchSponsor, setDataFetched]);

  useEffect(() => {
    if (sponsorProfileDetails && sponsorProfileDetails.length > 0) {
      setLoading(false);
    }
  }, [sponsorProfileDetails]);

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

  const sortedSponsors = [...sponsorProfileDetails].sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="px-2 mt-16"><br></br>
      <h1 className="sponsornowHeading">Sponsors</h1>
      <div className="table-wrapperS overflow-y-auto">
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
              {/* <th className="text-noewrap">Identity</th> */}
              <th className="text-nowrap text-white">Contribution Value</th>
              <th className="text-nowrap text-white">Contribution Type</th>
            </tr>
          </thead>
          <tbody>
            {sortedSponsors.length > 0 ? (
              sortedSponsors.map((profile) => (
                <tr key={profile.id} className="tr">
                  {/* <td>{profile.image}</td> */}
                  <td className="text-nowrap capitalize">
                    {profile.first_name} {profile.last_name}
                  </td>
                  <td className="text-nowrap capitalize">{profile.company_name}</td>
                  <td className="text-nowrap">{profile.email}</td>
                  <td className="text-nowrap capitalize">{profile.gender || "N/A"}</td>
                  {/* <td className="text-nowrap">{profile.qualification}</td> */}
                  <td className="text-nowrap">{profile.mobile_no}</td>
                  {/* <td className="text-nowrap">{profile.identity}</td> */}
                  <td className="text-nowrap">₹ {profile.contribution_value}</td>
                  <td className="text-nowrap">{profile.contribution_type}</td>
                </tr>
              ))
            ) : (
              <tr className="text-center p-3 w-100">
                <td colSpan={8}>No Sponsors Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

