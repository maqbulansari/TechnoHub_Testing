import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AssignTrainerForInterview = () => {
  const { batches, fetchBatches, API_BASE_URL } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [allTrainer, setAllTrainer] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const newaccessToken = localStorage.getItem("accessToken");

  const fetchAllTrainer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers/`, {
        headers: { Authorization: `Bearer ${newaccessToken}` },
      });
      if (response.status === 200) setAllTrainer(response.data);
    } catch (error) {
      console.error("Error fetching Trainers:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchBatches) fetchBatches();
    fetchAllTrainer();
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

  // Update selected trainers and sync with React Hook Form
  const handleTrainerChange = (trainerId) => {
    setSelectedTrainers((prev) => {
      let updated = prev.includes(trainerId)
        ? prev.filter((id) => id !== trainerId)
        : [...prev, trainerId];

      setValue("trainer_ids", updated, { shouldValidate: true }); // Sync form
      clearErrors("trainer_ids");
      return updated;
    });
  };

  const filteredTrainers = allTrainer.filter((trainer) =>
    `${trainer.first_name} ${trainer.last_name} ${trainer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data) => {
    if (selectedTrainers.length === 0) {
      setError("trainer_ids", { type: "manual", message: "At least one trainer is required" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        batches: [Number(data.batch_id)],
        user: selectedTrainers,
        is_approved: true,
        start_time: data.start_time,
        end_time: data.end_time,
      };

      await axios.post(`${API_BASE_URL}/interview-schedules/`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setSubmitSuccess(true);
      reset();
      setSelectedTrainers([]);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to assign batch to trainer");
    } finally {
      setIsSubmitting(false);
    }
  };

//   const handleSelectedTrainers = () => navigate("/SelectedTrainerForInterview");

  return (
    <div className="assignABT-batch-container">
      <h2 className="sponsornowHeading pt-2 text-4xl mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
        Assign Trainer For Interview
      </h2>

      {/* <div className="header-containerH mb-2">
        <Button className="btn btn-primary " onClick={handleSelectedTrainers}>
          Selected Trainers
        </Button>
      </div> */}

      <div className="assignABT-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden input to sync selected trainers with React Hook Form */}
          <input
            type="hidden"
            {...register("trainer_ids", {
              required: "At least one trainer is required",
              validate: (value) => value.length > 0 || "Please select at least one trainer",
            })}
            value={selectedTrainers}
          />

          {/* Trainer Multi-Select */}
          <div className="form-groupABT">
            <label className="form-labelABT">
              Select Trainer <span className="text-danger">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <div
                className={`form-selectABT cursor-pointer flex items-center justify-between min-h-[42px] ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedTrainers.length === 0 ? (
                    <span>-- Select Trainer --</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                      {selectedTrainers.length} trainer{selectedTrainers.length > 1 ? "s" : ""} selected
                    </span>
                  )}
                </div>
                {selectedTrainers.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrainers([]);
                      setValue("trainer_ids", []);
                      clearErrors("trainer_ids");
                    }}
                    className="mr-2 size-6 text-gray-400 hover:text-gray-600"
                    title="Clear all"
                  >
                    ×
                  </button>
                )}
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      placeholder="Search trainers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {loading ? (
                      <div className="px-3 py-4 text-center text-gray-500">Loading trainers...</div>
                    ) : filteredTrainers.length === 0 ? (
                      <div className=" text-center text-gray-500">No trainers found</div>
                    ) : (
                      filteredTrainers.map((trainer) => (
                        <label
                          key={trainer.id}
                          className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                            selectedTrainers.includes(trainer.id) ? "bg-blue-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTrainers.includes(trainer.id)}
                            onChange={() => handleTrainerChange(trainer.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3 flex gap-2 flex-row">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {trainer.first_name} {trainer.last_name}
                            </span>
                            <span className="text-sm font-medium text-gray-500 block">{trainer.email}</span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.trainer_ids && <p className="error-message text-red-500 mt-1">{errors.trainer_ids.message}</p>}
          </div>

          {/* Batch Selection */}
          <div className="form-groupABT">
            <label className="form-labelABT" htmlFor="batchId">
              Select Batch <span className="text-danger">*</span>
            </label>
            <select
              id="batchId"
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
            {errors.batch_id && <p className="error-message text-red-500">{errors.batch_id.message}</p>}
          </div>

          {/* Start Time */}
          <div className="form-groupABT">
            <label className="form-labelABT" htmlFor="start_time">
              Start Time <span className="text-danger">*</span>
            </label>
            <input
              type="time"
              id="start_time"
              {...register("start_time", { required: "Start time is required" })}
              className="form-selectABT"
              disabled={isSubmitting}
            />
            {errors.start_time && <p className="error-message text-red-500">{errors.start_time.message}</p>}
          </div>

          {/* End Time */}
          <div className="form-groupABT">
            <label className="form-labelABT" htmlFor="end_time">
              End Time <span className="text-danger">*</span>
            </label>
            <input
              type="time"
              id="end_time"
              {...register("end_time", {
                required: "End time is required",
                validate: (value, formValues) => {
                  const startTime = formValues.start_time || "";
                  if (startTime && value <= startTime) return "End time must be after start time";
                  return true;
                },
              })}
              className="form-selectABT"
              disabled={isSubmitting}
            />
            {errors.end_time && <p className="error-message text-red-500">{errors.end_time.message}</p>}
          </div>

          <button type="submit" className="submit-buttonABT" disabled={isSubmitting}>
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin me-2"></i>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane mr-2"></i> Assign
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Batch</h5>
                <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
              </div>
              <div className="modal-body">
                <p>Batch assigned to trainer(s) successfully!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setSubmitSuccess(false)}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {submitError && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
              </div>
              <div className="modal-body">
                <p>{submitError}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSubmitError(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTrainerForInterview;
