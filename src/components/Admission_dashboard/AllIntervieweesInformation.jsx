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
import { Button } from "@/components/ui/button";
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
    <div className="p-6 m-16 space-y-6">
      <h2 className="text-2xl font-semibold text-left">
        Interviewees Information
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Tabs
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="TBD">TBD</TabsTrigger>
            <TabsTrigger value="Y">Selected</TabsTrigger>
            <TabsTrigger value="N">Not Selected</TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          placeholder="Search name, email or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-80"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-auto max-h-[70vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Subrole</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Eng Comm</TableHead>
              <TableHead>Background</TableHead>
              <TableHead>Laptop</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Interview By</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInterviewees.length ? (
              filteredInterviewees.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.id}</TableCell>
                  <TableCell className="capitalize font-medium text-nowrap">
             <div className=" flex items-center">
               <User className="h-4" />
                    {i.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className=" flex items-center">
               <Mail className="h-4" />
                    {i.email || "N/A"}
                    </div>
                    </TableCell>
                  <TableCell>
                    <div className=" flex items-center">
               <Phone className="h-4" />
                    {i.mobile_no || "N/A"}
                    </div>
                    </TableCell>
                  <TableCell>{i.subrole || "N/A"}</TableCell>
                  <TableCell className="uppercase">
                    {i.batch || "N/A"}
                  </TableCell>
                  <TableCell>{i.eng_comm_skills || "N/A"}</TableCell>
                  <TableCell>{i.humble_background || "N/A"}</TableCell>
                  <TableCell>{i.laptop || "N/A"}</TableCell>
                  <TableCell className="capitalize">
                    {i.profession || "N/A"}
                  </TableCell>
                  <TableCell>{statusBadge(i.selected_status)}</TableCell>
                  <TableCell>{i.level || "N/A"}</TableCell>
                  <TableCell>{i.source || "N/A"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {i.remarks || "N/A"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {i.interview_by || "N/A"}
                  </TableCell>
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
