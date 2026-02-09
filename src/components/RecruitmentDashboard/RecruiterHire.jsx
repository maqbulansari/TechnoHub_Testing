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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const RecruiterHire = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");

  // Fetch recruiter’s students
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/recruitment/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching recruitment data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruitments();
  }, [API_BASE_URL]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.student_name} ${item.student_batch} ${item.selection_status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const openUpdateDialog = (student) => {
    setSelectedStudent(student);
    setStatus(student.selection_status);
    setFeedback(student.feedback || "");
  };

  const handleUpdateStatus = async () => {
    if (!selectedStudent) return;
    setUpdatingId(selectedStudent.student);
    const token = localStorage.getItem("accessToken");

    try {
      await axios.patch(
        `${API_BASE_URL}/recruitment/update_status/`,
        {
          student: selectedStudent.student,
          selection_status: status,
          is_hired: status === "Selected",
          feedback,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) =>
        prev.map((item) =>
          item.student === selectedStudent.student
            ? {
                ...item,
                selection_status: status,
                feedback,
                is_hired: status === "Selected",
              }
            : item
        )
      );

      setSelectedStudent(null);
      setFeedback("");
      setStatus("");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold">Recruiter: Manage Student Status</h2>

      <Input
        placeholder="Search by student, batch, or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              {/* <TableHead>Batch</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Hired</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.student_name}</TableCell>
                  {/* <TableCell>{row.student_batch}</TableCell> */}
                  <TableCell>
                    <Badge
                      variant={
                        row.selection_status === "Selected"
                          ? "green"
                          : row.selection_status === "Pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {row.selection_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.is_hired ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => openUpdateDialog(row)}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No students assigned yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal for update */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Student Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label>Status:</label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label>Feedback:</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updatingId === selectedStudent?.student}
            >
              {updatingId === selectedStudent?.student ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
