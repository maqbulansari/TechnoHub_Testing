import React, { useEffect, useState, useContext } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const RecruitmentAdmin = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState({});
  const [messages, setMessages] = useState({});
  const [sendingId, setSendingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Result modal state
  const [resultModal, setResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultSuccess, setResultSuccess] = useState(false);

    const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const [reqRes, studentRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/recruitment/requests/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/recruitment/available_students/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRequests(reqRes.data);
        setStudents(studentRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  const handleAssign = (recruiterId, studentId) => {
    setAssignments((prev) => ({ ...prev, [recruiterId]: studentId }));
  };

  const handleMessageChange = (recruiterId, value) => {
    setMessages((prev) => ({ ...prev, [recruiterId]: value }));
  };

  const openDialog = (req) => {
    setSelectedRequest(req);
    if (!messages[req.id]) {
      setMessages((prev) => ({
        ...prev,
        [req.id]: `The ${req.company_name} has selected you. Do you accept this offer?`,
      }));
    }
    setDialogOpen(true);
  };

  const sendConfirmation = async () => {
    if (!selectedRequest) return;
    const studentId = assignments[selectedRequest.id];
    const message =
      messages[selectedRequest.id] ||
      `The ${selectedRequest.company_name} has selected you. Do you accept this offer?`;

    if (!studentId) {
      setResultSuccess(false);
      setResultMessage("Please select a student first!");
      setResultModal(true);
      return;
    }

    const token = localStorage.getItem("accessToken");
    setSendingId(selectedRequest.id);

    try {
      await axios.post(
        `${API_BASE_URL}/recruitment/send_confirmation_request/`,
        { student: studentId, recruiter: selectedRequest.recruiter_id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDialogOpen(false);
      setSelectedRequest(null);
      setResultSuccess(true);
      setResultMessage("Confirmation sent successfully!");
      setResultModal(true);
    } catch (err) {
      console.error(err);
      setResultSuccess(false);
      setResultMessage(err.response.data.error);
      setResultModal(true);
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return <Loading />;

  const availableStudents = students.filter(
    (s) => s.is_ready_for_recruitment && !s.is_hired
  );


  return (
    <div className="p-6 mt-16 space-y-8">
      {/* Recruitment Requests Table */}
      <div>
         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <h2 className="text-2xl text-nowrap font-semibold">Recruitment Requests</h2>  <Button variant="outline" onClick={() => navigate("/RecruitmentApprovalTable")}>
                  Students Status
                </Button> </div>
        {/* <h2 className="text-2xl font-semibold mb-4">Recruitment Requests</h2> */}
        <div className="rounded-lg border bg-white shadow-sm overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Technology</TableHead>
                <TableHead>Requested Students</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length ? (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      {req.company_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.technology_name}</Badge>
                    </TableCell>
                    <TableCell>{req.num_students || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => openDialog(req)}>
                        Assign & Send
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No recruitment requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Available Students Table */}
      <div>
        <h2 className="text-2xl font-semibold text-nowrap mb-4">Available Students</h2>
        <div className="rounded-lg border bg-white shadow-sm overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Batch</TableHead>
                {/* <TableHead>Technology</TableHead> */}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableStudents.length ? (
                availableStudents.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
<div className=" flex items-center" >
  <User className=" h-4" />
                      {s.first_name} {s.last_name}
                      </div>

                    </TableCell>
                    <TableCell>
                      {s.batch ? (
                        <Badge variant="">{s.batch}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    {/* <TableCell>
                      {s.technology ? (
                        <Badge variant="secondary">{s.technology}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell> */}
                    <TableCell>
                      <Badge variant='green'>
                        Available
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No available students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assign & Send Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Student to {selectedRequest?.company_name}
            </DialogTitle>
            <DialogDescription>
              Select a student and write a confirmation message to send.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Student</label>
                <Select
                  value={
                    assignments[selectedRequest.id]
                      ? String(assignments[selectedRequest.id])
                      : ""
                  }
                  onValueChange={(val) =>
                    handleAssign(selectedRequest.id, parseInt(val))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudents.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.first_name} {s.last_name}{" "}
                        {s.batch ? `(${s.batch})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  rows={4}
                  placeholder="Write a confirmation message..."
                  value={messages[selectedRequest.id] || ""}
                  onChange={(e) =>
                    handleMessageChange(selectedRequest.id, e.target.value)
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={sendConfirmation}
              disabled={
                !assignments[selectedRequest?.id] ||
                sendingId === selectedRequest?.id
              }
            >
              {sendingId === selectedRequest?.id
                ? "Sending..."
                : "Send Confirmation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default RecruitmentAdmin;