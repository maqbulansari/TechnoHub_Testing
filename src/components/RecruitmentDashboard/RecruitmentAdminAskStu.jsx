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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

const RecruitmentApprovalTable = () => {
  const { API_BASE_URL } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [assigningId, setAssigningId] = useState(null);

  // Result modal state
  const [resultModal, setResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultSuccess, setResultSuccess] = useState(false);

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(`${API_BASE_URL}/recruitment/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const re = await axios.get(
          `${API_BASE_URL}/recruitment/available_students/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
      `${item.student_name} ${item.recruiter_name ?? ""} ${item.recruiter_company ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  
  const acceptRecruitment = async (recruitmentId, studentId, rowId) => {
    const token = localStorage.getItem("accessToken");
    setAssigningId(rowId);

    try {
      await axios.patch(
        `${API_BASE_URL}/recruitment/${rowId}/assign_to_recruiter/`,
        {
          recruiter: recruitmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === rowId
            ? { ...item, student_decision: "Accepted" }
            : item
        )
      );

      setResultSuccess(true);
      setResultMessage("Recruitment accepted successfully!");
      setResultModal(true);
    } catch (err) {
      console.error("Student acceptance failed", err);
      setResultSuccess(false);
      setResultMessage("Failed to accept recruitment.");
      setResultModal(true);
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) return <Loading />;


  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl text-nowrap font-semibold">Recruitment Records</h2>

      <Input
        placeholder="Search by student or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Recruiter</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className=" flex items-center" >
                      <User className="h-4" />
                    {row.student_name || "N/A " } </div></TableCell>
                  <TableCell>
                    {row.student_batch || "N/A"}</TableCell>
                  <TableCell>
                    <div className=" flex items-center" >
                      <User className="h-4" />
                    {row.recruiter_name || "N/A " } </div></TableCell>
                  <TableCell>{row.recruiter_company || "—"}</TableCell>
                  <TableCell>
                    {row.student_decision === "Accepted" ? (
                      <Badge variant="green">Accepted</Badge>
                    ) : row.student_decision === "Pending" ? (
                      <Badge variant="yellow">Pending</Badge>
                    ) : (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={row.student_decision === "Accepted" ? "" : "outline"}
                      onClick={() =>
                        acceptRecruitment(row.recruiter, row.student, row.id)
                      }
                      disabled={
                        row.student_decision !== "Accepted" ||
                        assigningId === row.id
                      }
                    >
                      {assigningId === row.id
                        ? "Processing..."
                        : row.student_decision === "Accepted"
                          ? "Accept"
                          : "No Action"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No recruitment data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Result Modal */}
      <Dialog open={resultModal} onOpenChange={setResultModal}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {resultSuccess ? "Success" : "Error"}
            </DialogTitle>
            <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
              {resultMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => setResultModal(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruitmentApprovalTable;