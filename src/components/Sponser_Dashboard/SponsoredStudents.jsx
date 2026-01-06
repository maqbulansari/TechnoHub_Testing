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

 export const SponsoredStudents = () => {
  const { API_BASE_URL, accessToken, role, responseSubrole } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  // Fetch sponsored students
  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      if (!(role === "ADMIN" || responseSubrole === "SPONSOR")) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/sponsors/sponsored_students/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (isMounted) setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching sponsored students:", err);
        if (isMounted) setError("Unable to fetch sponsored students.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudents();
    return () => { isMounted = false; };
  }, [API_BASE_URL, accessToken, role, responseSubrole]);

  // Always define students array for useMemo
  const studentList = students || [];

  // Unique batch list
  const batchList = useMemo(() => [...new Set(studentList.map(s => s.batch_name))].filter(Boolean), [studentList]);

  // Filtered + sorted students
  const filteredStudents = useMemo(() => {
    return studentList
      .filter(s => s.student_name.toLowerCase().includes(search.toLowerCase()))
      .filter(s => batchFilter === "all" || s.batch_name === batchFilter)
      .sort((a, b) => (a.student_name || "").toLowerCase().localeCompare((b.student_name || "").toLowerCase()));
  }, [studentList, search, batchFilter]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold">Sponsored Students</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mt-3 w-1/2">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batchList.map(batch => (
              <SelectItem key={batch} value={batch}>{batch}</SelectItem>
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
              <TableHead>Fee</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <TableRow key={student.id || student.student_name}>
                  <TableCell className="capitalize font-medium">{student.student_name}</TableCell>
                  <TableCell>
                    <Badge className="uppercase">{student.batch_name || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>₹ {student.fee || "0"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">No students found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SponsoredStudents;
