import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AssignTrainerForInterview = () => {
  const { batches, fetchBatches, API_BASE_URL } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [roleType, setRoleType] = useState(""); // "trainer" or "student"
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const newaccessToken = localStorage.getItem("accessToken");

  const fetchUsersByRole = async (role) => {
    if (!role) return;
    setLoading(true);
    try {
      const endpoint =
        role === "trainer"
          ? `${API_BASE_URL}/interview-schedules/users-by-role/?role=enabler&subrole=trainer`
          : `${API_BASE_URL}/interview-schedules/users-by-role/?role=learner&subrole=student`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${newaccessToken}` },
      });

      if (response.status === 200) setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setSelectedUsers([]); // reset selection on role change
    }
  };

  useEffect(() => {
    if (fetchBatches) fetchBatches();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleUserChange = (userId) => {
    setSelectedUsers((prev) => {
      let updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      setValue("user_ids", updated, { shouldValidate: true });
      clearErrors("user_ids");
      return updated;
    });
  };

  const filteredUsers = allUsers.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data) => {
    if (selectedUsers.length === 0) {
      setError("user_ids", { type: "manual", message: "At least one user is required" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        batches: [Number(data.batch_id)],
        user: selectedUsers,
        is_approved: true,
      };

      await axios.post(`${API_BASE_URL}/interview-schedules/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setSubmitSuccess(true);
      reset();
      setSelectedUsers([]);
      setRoleType("");
      setAllUsers([]);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to assign batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assignABT-batch-container">
      <h2 className="sponsornowHeading pt-2 mb-4 text-center">
        Assign Trainer / Student For Interview
      </h2>

      <div className="assignABT-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden input to sync selected users */}
          <input
            type="hidden"
            {...register("user_ids", { required: "Select at least one user" })}
            value={selectedUsers}
          />

          {/* Role Type Dropdown */}
          <div className="form-groupABT">
            <label className="form-labelABT">Select Role <span className="text-danger">*</span></label>
            <select
              className="form-selectABT"
              value={roleType}
              onChange={(e) => {
                setRoleType(e.target.value);
                fetchUsersByRole(e.target.value);
              }}
            >
              <option value="">-- Select Role --</option>
              <option value="trainer">Trainer</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* User Multi-Select */}
          {roleType && (
            <div className="form-groupABT">
              <label className="form-labelABT">
                {roleType === "trainer"
                  ? "Select Trainer(s) *"
                  : "Select Student(s) *"}
              </label>
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`form-selectABT cursor-pointer flex items-center justify-between min-h-[42px]`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex flex-wrap gap-1 flex-1">
                    {selectedUsers.length === 0 ? (
                      <span>-- Select {roleType === "trainer" ? "Trainer(s)" : "Student(s)"} --</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-2 rounded bg-blue-100 text-blue-800 text-sm">
                        {selectedUsers.length} {roleType === "trainer" ? "trainer(s)" : "student(s)"} selected
                      </span>
                    )}
                  </div>
                  {selectedUsers.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUsers([]);
                        setValue("user_ids", []);
                        clearErrors("user_ids");
                      }}
                      className="mr-2 text-gray-400 hover:text-gray-600"
                      title="Clear all"
                    >
                      ×
                    </button>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                      {loading ? (
                        <div className="px-3 py-4 text-center text-gray-500">Loading...</div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-2 text-gray-500">No users found</div>
                      ) : (
                        filteredUsers.map((user) => (
                          <label
                            key={user.id}
                            className={`flex items-center px-3 py-3 cursor-pointer hover:bg-gray-50 ${selectedUsers.includes(user.id) ? "bg-blue-50" : ""
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleUserChange(user.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="ml-3 flex gap-2 flex-row">
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {user.first_name} {user.last_name}
                              </span>
                              <span className="text-sm font-medium text-gray-500 block">{user.email}</span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.user_ids && <p className="text-red-500 mt-1">{errors.user_ids.message}</p>}
            </div>
          )}


          {/* Batch Selection */}
          <div className="form-groupABT">
            <label className="form-labelABT">Select Batch <span className="text-danger">*</span></label>
            <select
              {...register("batch_id", { required: "Batch is required" })}
              className="form-selectABT capitalize"
              disabled={isSubmitting}
            >
              <option value="">-- Select Batch --</option>
              {batches.map((batch) => (
                <option key={batch.batch_id} value={batch.id}>
                  {batch.batch_name} - {batch.center}
                </option>
              ))}
            </select>
            {errors.batch_id && <p className="text-red-500">{errors.batch_id.message}</p>}
          </div>

          <button type="submit" className="submit-buttonABT" disabled={isSubmitting}>
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignTrainerForInterview;
