import React, { useContext, useState, useEffect, useMemo } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

 export const SponsorTable = () => {
  const { sponsorProfileDetails, FetchSponsor, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { role, responseSubrole } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  // Always define this hook before any early return
  const sponsorProfiles = sponsorProfileDetails || [];

  const filteredSponsors = useMemo(() => {
    return sponsorProfiles.filter((s) => {
      const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        (s.company_name?.toLowerCase().includes(search.toLowerCase()));
      const matchesGender = genderFilter === "all" || s.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [sponsorProfiles, search, genderFilter]);

  const genders = useMemo(() => {
    return [...new Set(sponsorProfiles.map(s => s.gender))].filter(Boolean);
  }, [sponsorProfiles]);

  // Fetch sponsor data
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    try {
      if ((responseSubrole === "SPONSOR" || role === "ADMIN") && !dataFetched?.sponsor) {
        await FetchSponsor();
        if (isMounted) {
          setDataFetched(prev => ({ ...prev, sponsor: true }));
        }
      }
    } catch (err) {
      if (isMounted) setError(err.message);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchData();

  // Cleanup
  return () => { isMounted = false; };
}, [responseSubrole, role]);


  // Early return after hooks
  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">Error fetching data: {error}</div>;

  return (
    <div className="p-6 mt-16 space-y-6">
      <h1 className="sponsornowHeading text-left">Sponsors</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 w-1/2">
        <Input
          placeholder="Search by name or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {genders.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm max-h-[70vh] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Contribution Value</TableHead>
              <TableHead>Contribution Type</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSponsors.length > 0 ? (
              filteredSponsors
                .sort((a, b) => {
                  const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                  const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                  return nameA.localeCompare(nameB);
                })
                .map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="capitalize">{profile.first_name} {profile.last_name}</TableCell>
                    <TableCell className="capitalize">{profile.company_name}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{profile.gender || "N/A"}</TableCell>
                    <TableCell>{profile.mobile_no}</TableCell>
                    <TableCell>₹ {profile.contribution_value}</TableCell>
                    <TableCell>{profile.contribution_type}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No Sponsors Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SponsorTable;
