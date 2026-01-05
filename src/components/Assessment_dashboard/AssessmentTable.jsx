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

const AssessmentTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { API_BASE_URL, fetchTrainers, role, user } =
    useContext(AuthContext);

  const trainerName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  useEffect(() => {
    if (fetchTrainers) fetchTrainers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/assessment/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sorted = res.data.data.sort((a, b) =>
          a.student_name.localeCompare(b.student_name, undefined, {
            sensitivity: "base",
          })
        );

        setData(sorted);
      } catch (err) {
        console.error("Error fetching assessment data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.student_name} ${item.batch_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleSelectAssessment = async (row) => {
    const token = localStorage.getItem("accessToken");

    setData((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? { ...item, selected_by_trainer: trainerName }
          : item
      )
    );

    try {
      await axios.put(
        `${API_BASE_URL}/assessment/update/${row.id}/`,
        { ...row, assessed_by: trainerName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update assessment", err);
    }
  };

  const handleUpdate = (row) => {
    navigate(`/AssessmentCandidte/${row.id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Assessments</h2>

        <Button
          variant="outline"
          onClick={() => navigate("/StudentInformation")}
        >
          All Student Information
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by student or batch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Batch</TableHead>
              {role === "ADMIN" && (
                <TableHead>Admin Approval</TableHead>
              )}
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.student_name}
                  </TableCell>

                  <TableCell>
                    {row.selected_by_trainer ? (
                      <Badge>{row.selected_by_trainer}</Badge>
                    ) : (
                      <Badge variant="outline">Not Assigned</Badge>
                    )}
                  </TableCell>

                  <TableCell>{row.batch_name}</TableCell>

                  {role === "ADMIN" && (
                    <TableCell>
                      {row.admin_selected ? (
                        <Badge variant="success">Approved</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    {!row.selected_by_trainer ? (
                      <Button
                        size="sm"
                        onClick={() => handleSelectAssessment(row)}
                      >
                        Select
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdate(row)}
                      >
                        Update
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={role === "ADMIN" ? 5 : 4}
                  className="text-center py-6"
                >
                  No assessments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssessmentTable;
