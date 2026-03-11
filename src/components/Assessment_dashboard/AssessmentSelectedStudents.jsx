import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pencil, User } from "lucide-react";

const AssessmentSelectedStudents = () => {
  const { API_BASE_URL, role, hasRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student/selected_student_assessment/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        
        const sorted = response.data.data.sort((a, b) =>
          a.student_name.localeCompare(b.student_name, undefined, { sensitivity: "base" })
        );

        setData(sorted);
      } catch (err) {
        console.error("Error fetching assessment students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, token]);

  const allBatches = useMemo(() => {
    return [...new Set(data.map((d) => d.batch_name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.student_name?.toLowerCase().includes(search.toLowerCase());
      const matchesBatch = batchFilter === "all" || item.batch_name === batchFilter;
      return matchesSearch && matchesBatch;
    });
  }, [data, search, batchFilter]);

  const handleAssessment = (student) => {
    navigate(`/AssessmentCandidte/${student.student_id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Assessments</h2>
        <Button variant="outline" onClick={() => navigate("/StudentInformation")}>
          All Student Information
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 lg:w-1/2">
        <Input
          placeholder="Student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {allBatches.map((batch) => (
              <SelectItem key={batch} value={batch}>
                {batch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-auto max-h-[70vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Trainers</TableHead>
              <TableHead>Batch</TableHead>
              {hasRole && hasRole("ADMIN") && <TableHead>Trainer Assigned</TableHead>}
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              filteredData.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="capitalize font-medium">
                    <div className=" flex items-center">
                      <User className=" h-4" />
                      {student.student_name}</div></TableCell>

                  <TableCell className="flex border-none flex-wrap gap-1">
                    {student.trainers?.length ? (
                      student.trainers.map((trainer) => (
                        <Badge key={trainer.trainer_id} variant="">
                          {trainer.trainer_name}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="">No Trainers</Badge>
                    )}
                  </TableCell>

                  <TableCell className="capitalize">{student.batch_name}</TableCell>

                  {hasRole && hasRole("ADMIN") && (
                    <TableCell>
                      <input type="checkbox" checked={student.trainer_is_selected} disabled />
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    {student.trainer_is_selected ? (
                      <Button variant="ghost" size="icon" onClick={() => handleAssessment(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Badge variant="secondary">Not Assigned</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No assessment students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssessmentSelectedStudents;
