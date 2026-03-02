import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AUTH_BASE_URL } from "@/environment";

/* ---------------- ROLES ---------------- */

const ROLES = [
  { id: 1, name: "ADMIN" },
  { id: 2, name: "ENABLER" },
  { id: 3, name: "LEARNER" },
];

/* ---------------- SUBROLES ---------------- */

const SUBROLES = [
  { id: 1, name: "APPLICANT" },
  { id: 2, name: "INTERVIEWEE" },
  { id: 3, name: "STUDENT" },
  { id: 4, name: "SPONSOR" },
  { id: 5, name: "TRAINER" },
  { id: 6, name: "RECRUITER" },
  { id: 7, name: "GUEST LECTURER" },
  { id: 8, name: "ADMISSION MANAGER" },
  { id: 9, name: "BOOKHUB MANAGER" },
  { id: 10, name: "INTERN" },
  { id: 11, name: "CO TRAINER" },
  { id: 13, name: "DEVELOPER" },
  { id: 14, name: "TEAM LEADER" },
  { id: 15, name: "PROJECT LEAD" },
];

const ROLE_SUBROLE_MAP = {
  1: [8, 9],
  2: [7, 6, 4, 5, 11, 15, 14, 13],
  3: [1, 2, 3, 10],
};

export const ManageRoles = () => {
  const token = localStorage.getItem("accessToken");

  const [selectedRoleFilter, setSelectedRoleFilter] = useState("");
  const [selectedSubroleFilter, setSelectedSubroleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignedSubroles, setAssignedSubroles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  /* ---------------- FILTER USERS ---------------- */

  useEffect(() => {
    if (!selectedRoleFilter || !selectedSubroleFilter) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get(
          `${AUTH_BASE_URL}/userrolehistory/user_all_roles/?role=${selectedRoleFilter}&subrole=${selectedSubroleFilter}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [selectedRoleFilter, selectedSubroleFilter]);

  /* ---------------- LOAD USER ROLES ---------------- */

  const handleUserChange = async (userId) => {
    setSelectedUser(userId);

    try {
      const res = await axios.get(
        `${AUTH_BASE_URL}/userrolehistory/user_all_roles/?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = res.data[0];
      setAssignedSubroles(userData?.subrole || []);
    } catch (err) {
      console.error("Failed to fetch user roles");
    }
  };

  /* ---------------- TOGGLE ---------------- */

  const toggleSubrole = (subId) => {
    setAssignedSubroles((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId]
    );
  };

  /* ---------------- SUBMIT (CORRECT PAYLOAD) ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);

    try {
      // ✅ Auto-detect roles from selected subroles
      const detectedRoles = ROLES
        .filter((role) =>
          assignedSubroles.some((subId) =>
            ROLE_SUBROLE_MAP[role.id].includes(subId)
          )
        )
        .map((role) => role.id);

      await axios.post(
        `${AUTH_BASE_URL}/userrolehistory/`,
        {
          users: parseInt(selectedUser),
          role: detectedRoles,
          subroles: assignedSubroles,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalMessage("Roles updated successfully!");
      setSubmitSuccess(true);

    } catch (err) {
      setModalMessage(
        err.response?.data?.errors?.[0] || "Failed to update roles."
      );
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <Card className="p-6 space-y-5 shadow-sm">

        <h2 className="text-2xl font-semibold text-center">
          Manage User Roles
        </h2>

        {/* FILTER ROLE */}
        <div>
          <label className="block mb-1 font-medium">
            Filter by Role <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedRoleFilter}
            onValueChange={setSelectedRoleFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FILTER SUBROLE */}
        {selectedRoleFilter && (
          <div>
            <label className="block mb-1 font-medium">
              Filter by Subrole <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedSubroleFilter}
              onValueChange={setSelectedSubroleFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subrole" />
              </SelectTrigger>
              <SelectContent>
                {SUBROLES
                  .filter((sub) =>
                    ROLE_SUBROLE_MAP[Number(selectedRoleFilter)]?.includes(sub.id)
                  )
                  .map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* SELECT USER */}
        {selectedRoleFilter && selectedSubroleFilter && (
          <div>
            <label className="block mb-1 font-medium">
              Select User <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedUser}
              onValueChange={handleUserChange}
              disabled={loadingUsers}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingUsers ? "Loading..." : "Choose user"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem
                    key={user.user_id}
                    value={user.user_id.toString()}
                  >
                    {user.user_name} ({user.user_email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ROLE SECTIONS */}
        {selectedUser &&
          ROLES.map((role) => (
            <div key={role.id} className="border rounded-md p-4 space-y-2">
              <h3 className="font-semibold text-sm">
                {role.name}
              </h3>

              <div className="flex flex-wrap gap-2">
                {assignedSubroles
                  .filter((id) =>
                    ROLE_SUBROLE_MAP[role.id].includes(id)
                  )
                  .map((id) => (
                    <div
                      key={id}
                      className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {SUBROLES.find((s) => s.id === id)?.name}
                      <button
                        className="ml-1 font-bold"
                        onClick={() => toggleSubrole(id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>

              <Select
                value=""
                onValueChange={(val) =>
                  toggleSubrole(parseInt(val))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Add ${role.name} subrole`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {SUBROLES.filter(
                    (s) =>
                      ROLE_SUBROLE_MAP[role.id].includes(s.id) &&
                      !assignedSubroles.includes(s.id)
                  ).map((sub) => (
                    <SelectItem
                      key={sub.id}
                      value={sub.id.toString()}
                    >
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

        {selectedUser && (
          <div className="text-center pt-2">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </Card>

      {/* ✅ Modal */}
      <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {modalMessage === "Roles updated successfully!"
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