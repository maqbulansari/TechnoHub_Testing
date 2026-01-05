import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
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

import { Button } from "@/components/ui/button";

export const AllBatches = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [centerFilter, setCenterFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(`${API_BASE_URL}/batches/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatches(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [API_BASE_URL]);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch =
        batch.batch_name.toLowerCase().includes(search.toLowerCase()) ||
        batch.batch_id.toString().includes(search);

      const matchesStatus =
        statusFilter === "all" || batch.status === statusFilter;

      const matchesCenter =
        centerFilter === "all" || batch.center === centerFilter;

      return matchesSearch && matchesStatus && matchesCenter;
    });
  }, [batches, search, statusFilter, centerFilter]);

  const statuses = [...new Set(batches.map((b) => b.status))].filter(Boolean);
  const centers = [...new Set(batches.map((b) => b.center))].filter(Boolean);

  const handleEdit = (batchId) => {
    navigate(`/EditBatch/${batchId}`);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Error fetching data: {error}
      </div>
    );

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold text-left">Batch Information</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
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
      <div className="rounded-lg border bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Batch ID</TableHead> */}
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trainers</TableHead>
              <TableHead>Student Count</TableHead>
              <TableHead>Center</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  {/* <TableCell>{batch.batch_id}</TableCell> */}
                  <TableCell className="capitalize text-nowrap">{batch.batch_name}</TableCell>
                  <TableCell className="text-nowrap">{batch.start_date}</TableCell>
                  <TableCell className="text-nowrap">{batch.end_date}</TableCell>
                  <TableCell className="text-nowrap">{batch.capacity}</TableCell>
                  <TableCell className="text-nowrap">{batch.time_slot}</TableCell>
                  <TableCell className="text-nowrap">{batch.duration}</TableCell>
                  <TableCell className="text-nowrap">{batch.fee}</TableCell>
                  <TableCell className="text-nowrap">{batch.status}</TableCell>
                  <TableCell>{batch.trainer.join(", ")}</TableCell>
                  <TableCell>{batch.student_count}</TableCell>
                  <TableCell>{batch.center}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(batch.batch_id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-6">
                  No batches found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllBatches;
