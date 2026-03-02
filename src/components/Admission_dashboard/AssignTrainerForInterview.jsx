import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const AssignTrainerForInterview = () => {
  const { batches, fetchBatches, API_BASE_URL, hasRole, hasSubrole } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [roleType, setRoleType] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchId, setBatchId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const {
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (fetchBatches) fetchBatches();
  }, []);

  // Fetch users whenever role changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!roleType) return;
      setLoadingUsers(true);
      try {
        const endpoint =
          roleType === "trainer"
            ? `${API_BASE_URL}/interview-schedules/users-by-role/?role=enabler&subrole=trainer`
            : `${API_BASE_URL}/interview-schedules/users-by-role/?role=learner&subrole=students`;
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(res.data);
        setSelectedUsers([]);
        setSearchTerm("");
        setValue("user_ids", []);
        clearErrors("user_ids");
      } catch (err) {
        setModalTitle("Error");
        setModalMessage("Failed to fetch users");
        setModalOpen(true);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [roleType, API_BASE_URL, token, setValue, clearErrors]);

  // Handle checkbox selection
  const handleUserChange = (id) => {
    setSelectedUsers((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      setValue("user_ids", updated);
      if (updated.length > 0) clearErrors("user_ids");
      return updated;
    });
  };

  // Filter users based on search term
  const filteredUsers = allUsers.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!roleType) {
      setError("roleType", { message: "Role is required" });
      hasError = true;
    }

    if (selectedUsers.length === 0) {
      setError("user_ids", {
        message: `${
          roleType === "trainer" ? "Trainer(s)" : "Student(s)"
        } is required`,
      });
      hasError = true;
    }

    if (!batchId) {
      setError("batchId", { message: "Batch is required" });
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);
    try {
      if (!(hasRole && hasRole('ADMIN')) && !(hasSubrole && hasSubrole('ADMISSION_MANAGER'))) {
        setModalTitle('Unauthorized')
        setModalMessage('You are not authorized to assign interviews')
        setModalOpen(true)
        setSubmitting(false)
        return
      }
      await axios.post(
        `${API_BASE_URL}/interview-schedules/`,
        {
          batches: [parseInt(batchId)],
          user: selectedUsers.map((id) => parseInt(id)),
          is_approved: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalTitle("Success");
      setModalMessage("Interview schedule assigned successfully!");
      setModalOpen(true);

      setRoleType("");
      setSelectedUsers([]);
      setBatchId("");
      setSearchTerm("");
    } catch (err) {
      setModalTitle("Error");
      setModalMessage(
        err.response?.data?.message || "Failed to assign interview"
      );
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <Card className="p-6 space-y-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-center">
          Assign Trainer / Student For Interview
        </h2>

        <form onSubmit={handleSubmitForm} className="space-y-6" noValidate>
          {/* Role Select */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Select Role <span className="text-red-500">*</span>
            </label>
            <Select
              value={roleType}
              onValueChange={(val) => {
                setRoleType(val);
                clearErrors("roleType");
              }}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("roleType")} value={roleType} />
            {errors.roleType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roleType.message}
              </p>
            )}
          </div>

          {/* Users Multi-Select */}
          {roleType && (
            <div className="flex flex-col gap-1">
              <label className="block font-medium text-gray-900 mb-1">
                Select {roleType === "trainer" ? "Trainer(s)" : "Student(s)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} selected`
                      : `Select ${
                          roleType === "trainer" ? "Trainer(s)" : "Student(s)"
                        }`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none"
                    />
                  </div>

                  <ScrollArea className="h-60">
                    {loadingUsers ? (
                      <p className="text-center text-gray-500 py-2">
                        Loading...
                      </p>
                    ) : filteredUsers.length === 0 ? (
                      <p className="text-center text-gray-500 py-2">
                        No users found
                      </p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            className="mr-2 w-4 h-4 rounded"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserChange(user.id)}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {user.first_name} {user.last_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <input type="hidden" {...register("user_ids")} />
              {errors.user_ids && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.user_ids.message}
                </p>
              )}
            </div>
          )}

          {/* Batch Select */}
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Select Batch <span className="text-red-500">*</span>
            </label>
            <Select
              value={batchId}
              onValueChange={(val) => {
                setBatchId(val);
                clearErrors("batchId");
              }}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem
                    key={batch.batch_id}
                    value={batch.id.toString()}
                  >
                    {batch.batch_name} - {batch.center}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("batchId")} value={batchId} />
            {errors.batchId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.batchId.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={submitting} className="w-1/2">
              {submitting ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">
          <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
            <DialogTitle className="text-xl pb-2 font-semibold">
              {modalTitle}
            </DialogTitle>
            <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="px-3 pb-3 bg-muted/30">
            <Button
              onClick={() => setModalOpen(false)}
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

export default AssignTrainerForInterview;
