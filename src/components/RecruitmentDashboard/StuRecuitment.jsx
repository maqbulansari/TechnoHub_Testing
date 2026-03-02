import React, { useContext, useEffect, useState } from "react";
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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const StuRecuitment = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch student recruitment data
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

  // Handle student decision (accept/reject)
  const handleDecision = async (recruitmentId, decision) => {
    const token = localStorage.getItem("accessToken");
    setUpdatingId(recruitmentId);

    try {
      await axios.patch(
        `${API_BASE_URL}/recruitment/${recruitmentId}/student_reply/`,
        { student_decision: decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI locally
      setData((prev) =>
        prev.map((item) =>
          item.id === recruitmentId ? { ...item, student_decision: decision } : item
        )
      );
    } catch (err) {
      console.error("Failed to update decision", err);
      alert("Failed to update your decision");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold">Your Recruitment Offers</h2>

      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Recruiter</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.recruiter_company}</TableCell>
                  <TableCell>{row.recruiter_name}</TableCell>
                  <TableCell>{row.student_batch}</TableCell>
                  <TableCell>
                    {row.student_decision === "Accepted" ? (
                      <Badge variant="green">Accepted</Badge>
                    ) : row.student_decision === "Pending" ? (
                      <Badge variant="outline">Pending</Badge>
                    ) : (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {row.student_decision === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleDecision(row.id, "Accepted")}
                          disabled={updatingId === row.id}
                        >
                          {updatingId === row.id ? "Processing..." : "Accept"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecision(row.id, "Declined")}
                          disabled={updatingId === row.id}
                        >
                          {updatingId === row.id ? "Processing..." : "Reject"}
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        {row.student_decision}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No recruitment offers available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
