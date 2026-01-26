import React, { useState, useEffect, useContext, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AdminAccessManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { API_BASE_URL } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/bookhub/admin/access/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Exclude admin accounts (no request and no access)
        const filtered = res.data.results.filter(
          (u) => u.has_requested_access || u.has_access_granted
        );
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_BASE_URL, token]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "pending") {
        matchesStatus = user.has_requested_access && !user.has_access_granted;
      } else if (statusFilter === "granted") {
        matchesStatus = user.has_access_granted;
      } else if (statusFilter === "no_request") {
        matchesStatus = !user.has_requested_access;
      }

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const grantAccess = async (userId) => {
    try {
      setActionLoading(userId);
      const res = await axios.post(
        `${API_BASE_URL}/bookhub/admin/access/`,
        { user_id: userId, notes: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update table
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, has_access_granted: true } : u
        )
      );

      // Show success modal
      setModalMessage(res.data.message);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error granting access:", err);
      setModalMessage("Something went wrong!");
      setSubmitSuccess(true);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 mt-16 space-y-6">
      <h2 className="text-2xl font-semibold">BookHub Access Requests</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="granted">Granted</SelectItem>
            <SelectItem value="no_request">No Request</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border max-h-[70vh] bg-white shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isPending =
                  user.has_requested_access && !user.has_access_granted;

                return (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium capitalize">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.has_access_granted ? (
                        <Badge variant="green">Granted</Badge>
                      ) : user.has_requested_access ? (
                        <Badge variant="yellow">Pending</Badge>
                      ) : (
                        <Badge variant="outline">No Request</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.requested_at
                        ? new Date(user.requested_at).toLocaleDateString("en-GB") +
                          " " +
                          new Date(user.requested_at).toLocaleTimeString("en-GB")
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      {isPending ? (
                        <Button
                          size="sm"
                          onClick={() => grantAccess(user.user_id)}
                          disabled={actionLoading === user.user_id}
                        >
                          {actionLoading === user.user_id
                            ? "Processing..."
                            : "Grant Access"}
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">No Action</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Success Modal */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">Success</DialogTitle>
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

export default AdminAccessManager;
