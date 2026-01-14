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

const AdmissionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { API_BASE_URL, fetchTrainers, fetchAdmin, user } =
    useContext(AuthContext);

  const trainerName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  console.log(user);
  

  useEffect(() => {
    if (fetchTrainers) fetchTrainers();
    if (fetchAdmin) fetchAdmin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/Learner/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.name} ${item.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleSelectInterviewer = async (row) => {
    const token = localStorage.getItem("accessToken");

    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, interview_by: trainerName } : item
      )
    );

    try {
      await axios.put(
        `${API_BASE_URL}/Learner/${row.id}/update_selected/`,
        { ...row, interview_by: trainerName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update interviewer", error);
    }
  };

  const handleEdit = (row) => {
    navigate(`/interview-candidate/${row.id}`, {
      state: { candidateData: row },
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Interviewees</h2>

        <div className="flex gap-2">
          <Button onClick={() => navigate("/AssignBatch")}>
            Assign Batch
          </Button>
          <Button variant="outline" onClick={() => navigate("/AllIntervieweesInformation")}>
            All Interviewees
          </Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Table */}
      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Interviewer</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.mobile_no || "N/A"}</TableCell>
                  <TableCell>
                    {row.interview_by ? (
                      <Badge className="text-nowrap">{row.interview_by}</Badge>
                    ) : (
                      <Badge variant="outline">Not Assigned</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!row.interview_by ? (
                      <Button
                      variant="outline"
                        size="sm"
                        onClick={() => handleSelectInterviewer(row)}
                      >
                        Select
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(row)}
                      >
                        Update
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
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

export default AdmissionTable;
