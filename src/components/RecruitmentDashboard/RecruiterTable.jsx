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

export const RecruiterTable = () => {
  const { recruiterProfileDetails, FetchRecuiter, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { role, responseSubrole, hasSubrole, hasRole } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  // Ensure recruiterProfileDetails is always an array
  const recruiterProfiles = recruiterProfileDetails || [];

  // Fetch recruiter data safely
 useEffect(() => {
  let isMounted = true;
  
  // Only fetch if not already fetched
  if ((hasSubrole("RECRUITER") || hasRole("ADMIN")) && !dataFetched?.recruiter) {
    const fetchData = async () => {
      try {
        await FetchRecuiter();
        if (isMounted) {
          // Use functional update to avoid triggering effect again
          setDataFetched(prev => ({ ...prev, recruiter: true }));
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

      fetchData();
  } else {
    // Already fetched, stop loading
    setLoading(false);
  }

  return () => { isMounted = false; };
  // Only run once or when role/subrole changes
}, [responseSubrole, role]);

  // Memoized filtered recruiters
  const filteredRecruiters = useMemo(() => {
    return recruiterProfiles.filter((r) => {
      const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        (r.company_name?.toLowerCase().includes(search.toLowerCase()));
      const matchesGender = genderFilter === "all" || r.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [recruiterProfiles, search, genderFilter]);

  // Unique genders for filter
  const genders = useMemo(() => {
    return [...new Set(recruiterProfiles.map(r => r.gender))].filter(Boolean);
  }, [recruiterProfiles]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">Error fetching data: {error}</div>;

  return (
    <div className="p-6 mt-16 space-y-6">
      <h1 className="sponsornowHeading text-left">Recruiters</h1>

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
            </TableRow>
          </TableHeader>

          <TableBody>
  {filteredRecruiters.length > 0 ? (
    filteredRecruiters
      .sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      })
      .map((profile) => (
        <TableRow key={`${profile.id}-${profile.email}`}>
          <TableCell className="capitalize">{profile.first_name} {profile.last_name}</TableCell>
          <TableCell className="capitalize">{profile.company_name}</TableCell>
          <TableCell>{profile.email}</TableCell>
          <TableCell>{profile.gender || "N/A"}</TableCell>
          <TableCell>{profile.mobile_no}</TableCell>
        </TableRow>
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-6">
        No Recruiters Found
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>
    </div>
  );
};

export default RecruiterTable;
