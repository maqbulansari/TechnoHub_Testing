import React, { useState, useEffect, useContext, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { email } from "zod";
import { Mail, Phone, User } from "lucide-react";

const AllStudent = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");

  const { API_BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Learner/interviewee_student/?selected_status=Y`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // const res = await axios.get(
        //   `${API_BASE_URL}/recruitment/requests/`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );
        // console.log(res);

        setStudentData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [API_BASE_URL]);

  const filteredStudents = useMemo(() => {
    return studentData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchesGender =
        genderFilter === "all" || student.gender === genderFilter;

      const matchesBatch =
        batchFilter === "all" || student.batch === batchFilter;

      return matchesSearch && matchesGender && matchesBatch;
    });
  }, [studentData, search, genderFilter, batchFilter]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        Error fetching data: {error}
      </div>
    );

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold">Students</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 lg:w-1/2">
        <Input
          placeholder="name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Gender</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>

        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {[...new Set(studentData.map((s) => s.batch))].map(
              (batch) =>
                batch && (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ),
            )}
          </SelectContent>
        </Select>

        
      </div>

      {/* Table */}
      <div className="rounded-lg max-h-[70vh] bg-white  no-scrollbar shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Batch</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id || student.email}>
                  <TableCell className="font-medium capitalize">
                    <div className="flex items-center gap-3">
                      <User className="h-4" />
                      {student.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4" />
                      {student.email || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className=" flex items-center">
                      <Phone className=" h-4" />
                      {student.mobile_no || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {student.gender || "N/A"}
 </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="uppercase text-nowrap">
                      {student.batch || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllStudent;
