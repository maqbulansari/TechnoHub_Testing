import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, User } from "lucide-react";

const AllIntervieweesInformation = () => {
  const { API_BASE_URL } = useContext(AuthContext);

  const [interviewees, setInterviewees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/Learner/interviewee_student/`;
      if (statusFilter !== "ALL") {
        url += `?selected_status=${statusFilter}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInterviewees(response.data);
    } catch (err) {
      console.error("Error fetching interviewees", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviewees = useMemo(() => {
    return interviewees.filter((i) =>
      `${i.name} ${i.email} ${i.mobile_no}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [interviewees, search]);

  const statusBadge = (status) => {
    if (status === "Y") return <Badge>Selected</Badge>;
    if (status === "N") return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="outline">TBD</Badge>;
  };

  if (loading) return <Loading />;

  return (
    // Adjusted margins and padding for mobile vs desktop
    <div className="p-4 sm:p-6 md:m-8 lg:m-16 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-left">
        Interviewees Information
      </h2>

      {/* Filters: Stacks on mobile, inline on large screens */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Added overflow-x-auto so tabs don't get squished on tiny screens */}
        <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-full min-w-max"
          >
            <TabsList className="w-full sm:w-auto flex">
              <TabsTrigger value="ALL" className="flex-1 sm:flex-none">All</TabsTrigger>
              <TabsTrigger value="TBD" className="flex-1 sm:flex-none">TBD</TabsTrigger>
              <TabsTrigger value="Y" className="flex-1 sm:flex-none">Selected</TabsTrigger>
              <TabsTrigger value="N" className="flex-1 sm:flex-none">Not Selected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Input
          placeholder="Search name, email or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full xl:w-80"
        />
      </div>

      {/* Table: Added explicit min-w-[1200px] or whitespace-nowrap to prevent column crushing */}
      <div className="rounded-lg border bg-white shadow-sm overflow-x-auto overflow-y-auto max-h-[70vh]">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Mobile</TableHead>
              <TableHead className="whitespace-nowrap">Subrole</TableHead>
              <TableHead className="whitespace-nowrap">Batch</TableHead>
              <TableHead className="whitespace-nowrap">Eng Comm</TableHead>
              <TableHead className="whitespace-nowrap">Background</TableHead>
              <TableHead className="whitespace-nowrap">Laptop</TableHead>
              <TableHead className="whitespace-nowrap">Profession</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Level</TableHead>
              <TableHead className="whitespace-nowrap">Source</TableHead>
              <TableHead className="whitespace-nowrap">Remarks</TableHead>
              <TableHead className="whitespace-nowrap">Interview By</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInterviewees.length ? (
              filteredInterviewees.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.id}</TableCell>
                  
                  <TableCell className="capitalize font-medium whitespace-nowrap">
                    {/* Added gap-2 for better icon spacing */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0" />
                      <span>{i.name || "N/A"}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>{i.email || "N/A"}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{i.mobile_no || "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">{i.subrole || "N/A"}</TableCell>
                  <TableCell className="uppercase whitespace-nowrap">{i.batch || "N/A"}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.eng_comm_skills || "N/A"}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.humble_background || "N/A"}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.laptop || "N/A"}</TableCell>
                  <TableCell className="capitalize whitespace-nowrap">{i.profession || "N/A"}</TableCell>
                  <TableCell className="whitespace-nowrap">{statusBadge(i.selected_status)}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.level || "N/A"}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.source || "N/A"}</TableCell>
                  
                  {/* Kept truncate on remarks but set a specific max width */}
                  <TableCell className="max-w-[200px] truncate" title={i.remarks}>
                    {i.remarks || "N/A"}
                  </TableCell>
                  
                  <TableCell className="capitalize whitespace-nowrap">{i.interview_by || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-6">
                  No interviewees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllIntervieweesInformation;