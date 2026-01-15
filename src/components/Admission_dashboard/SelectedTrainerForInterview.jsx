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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SelectedTrainerForInterview = () => {
  const { API_BASE_URL } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  const [rowToDelete, setRowToDelete] = useState(null);

  const token = localStorage.getItem("accessToken");

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/interview-schedules/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching schedules", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const allBatches = useMemo(() => {
    return [
      ...new Set(
        data.flatMap((i) =>
          i.batches_names?.map((b) => b.name) || []
        )
      ),
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.user_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesBatch =
        batchFilter === "all" ||
        item.batches_names?.some((b) => b.name === batchFilter);

      return matchesSearch && matchesBatch;
    });
  }, [data, search, batchFilter]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/interview-schedules/${rowToDelete.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => prev.filter((i) => i.id !== rowToDelete.id));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setRowToDelete(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 className="text-2xl font-semibold">
        Selected Trainer For Interview
      </h2><Button variant="outline" onClick={() => navigate("/AssignTrainerForInterview")}>
                Assign Trainer Interview
              </Button></div>

      {/* Filters Card */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Candidate name..."
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
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-auto max-h-[70vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium capitalize">
                    {row.user_name}
                  </TableCell>

                  <TableCell className="flex flex-wrap items-center gap-1 border-none">
                    {row.batches_names?.map((b) => (
                      <Badge key={b.id} variant="">
                        {b.name}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell>
                    {row.start_date}
                    <div className="text-xs text-muted-foreground">
                      ({row.start_day})
                    </div>
                  </TableCell>

                  <TableCell>
                    {row.end_date}
                    <div className="text-xs text-muted-foreground">
                      ({row.end_day})
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setRowToDelete(row)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No interview schedules found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!rowToDelete} onOpenChange={() => setRowToDelete(null)}>
        <DialogContent className="pt-4 pb-3 px-6 sm:w-[400px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to delete the interview schedule for{" "}
            <strong>{rowToDelete?.user_name}</strong>?
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRowToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectedTrainerForInterview;
