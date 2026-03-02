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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const StudentInformation = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [centerFilter, setCenterFilter] = useState("all");

  const { API_BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(`${API_BASE_URL}/assessment/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sorted = response.data.data.sort((a, b) =>
          a.student_name.localeCompare(b.student_name, undefined, {
            sensitivity: "base",
          })
        );

        setStudentData(sorted);
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
      const matchesSearch = student.student_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBatch =
        batchFilter === "all" || student.batch_name === batchFilter;

      const matchesCenter =
        centerFilter === "all" || student.center === centerFilter;

      return matchesSearch && matchesBatch && matchesCenter;
    });
  }, [studentData, search, batchFilter, centerFilter]);

  const batches = [...new Set(studentData.map((s) => s.batch_name))].filter(
    Boolean
  );
  const centers = [...new Set(studentData.map((s) => s.center))].filter(
    Boolean
  );

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Error fetching data: {error}
      </div>
    );

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold text-left">
        Student Information
      </h2>

      {/* Filters – NO border */}
      <div className="flex flex-col md:flex-row gap-4 lg:w-1/2">
        <Input
          placeholder="Search student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map((batch) => (
              <SelectItem key={batch} value={batch}>
                {batch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={centerFilter} onValueChange={setCenterFilter}>
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Center" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Centers</SelectItem>
            {centers.map((center) => (
              <SelectItem key={center} value={center}>
                {center}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Center</TableHead>
              <TableHead>Selected By Trainer</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="capitalize font-medium">
                    {student.student_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="" className="uppercase">
                      {student.batch_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {student.center}
                  </TableCell>
                  <TableCell className="capitalize">
                    {student.selected_by_trainer || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
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

export default StudentInformation;
