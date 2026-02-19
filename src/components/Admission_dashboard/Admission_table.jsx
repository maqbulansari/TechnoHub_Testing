import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import { TECHNO_BASE_URL } from "@/environment";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdmissionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  const navigate = useNavigate();
  const { API_BASE_URL, fetchTrainers, fetchAdmin, user } =
    useContext(AuthContext);

  const trainerName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  useEffect(() => {
    if (fetchTrainers) fetchTrainers();
    if (fetchAdmin) fetchAdmin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${TECHNO_BASE_URL}/Learner/`, {
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

  // ── WhatsApp group creation using ALL data ─────────────────────
  const handleCreateWhatsAppGroup = async () => {
    if (!groupName.trim()) return;

    const intervieweeNumbers = data
      .map((r) => {
        if (!r.mobile_no) return null;
        let num = String(r.mobile_no).replace(/\D/g, "");
        return num || null;
      })
      .filter(Boolean);

    if (intervieweeNumbers.length === 0) {
      setModalMessage("No interviewees have a valid mobile number.");
      setSubmitSuccess(true);
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${API_BASE_URL}/whatsapp/create-interview-group/`,
        {
          group_name: groupName.trim(),
          interviewee_numbers: intervieweeNumbers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalMessage("WhatsApp group created successfully!");
      setSubmitSuccess(true);

      setDialogOpen(false);
      setGroupName("");
    } catch (error) {
      console.error("Failed to create WhatsApp group", error);

      setModalMessage("Failed to create WhatsApp group. Please try again.");
      setSubmitSuccess(true);
    } finally {
      setCreating(false);
    }
  };

  // ── Existing handlers ──────────────────────────────────────────
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

        <div className="flex gap-2 flex-wrap">
          {/* ── WhatsApp Group Dialog ── */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={data.length === 0}
              >
                Create WhatsApp Group
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create WhatsApp Group</DialogTitle>
                <DialogDescription>
                  A WhatsApp group will be created with all{" "}
                  <strong>{data.length}</strong> interviewee(s).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g. Interview GROUP - Batch 5"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>

                {/* Preview of all members */}
                <div className="space-y-2">
                  <Label>Members ({data.length})</Label>
                  <div className="max-h-40 overflow-auto rounded border p-2 space-y-1 text-sm">
                    {data.map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between items-center"
                      >
                        <span>{r.name}</span>
                        <span className="text-muted-foreground">
                          {r.mobile_no || "No number"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWhatsAppGroup}
                  disabled={creating || !groupName.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {creating ? "Creating…" : "Create Group"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => navigate("/AssignBatch")}>Assign Batch</Button>
          <Button
            variant="outline"
            onClick={() => navigate("/AllIntervieweesInformation")}
          >
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
                        variant=""
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


      {/* Result Modal */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {modalMessage === "WhatsApp group created successfully!"
                ? "Success"
                : "Error"}
            </DialogTitle>

            <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => setSubmitSuccess(false)}
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

export default AdmissionTable;