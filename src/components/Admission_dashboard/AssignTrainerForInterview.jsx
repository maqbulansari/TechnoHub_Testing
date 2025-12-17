import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";

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


const newaccessToken = localStorage.getItem("accessToken")

    console.log(accessToken);

    const fetchAllTrainer = async () => {
     

        try {
            const response = await axios.get(
                `${API_BASE_URL}/trainers/`,
                {
                    headers: {
                        Authorization: `Bearer ${newaccessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                setAllTrainer(response.data);
            }
        } catch (error) {
            console.error(
                "Error fetching Trainers:",
                error.response?.data || error.message
            );
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
        if (token) {
            setAccessToken(token);
        }
    }, []);

    // Close dropdown when clicking outside
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
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();

    // Handle checkbox change for trainers
    const handleTrainerChange = (trainerId) => {
        setSelectedTrainers((prev) => {
            if (prev.includes(trainerId)) {
                return prev.filter((id) => id !== trainerId);
            } else {
                return [...prev, trainerId];
            }
        });
        clearErrors("trainer_ids");
    };

    // Select All / Deselect All
    const handleSelectAll = () => {
        if (selectedTrainers.length === allTrainer.length) {
            setSelectedTrainers([]);
        } else {
            setSelectedTrainers(allTrainer.map((t) => t.id));
        }
    };

    // Filter trainers based on search
    const filteredTrainers = allTrainer.filter((trainer) =>
        `${trainer.first_name} ${trainer.last_name} ${trainer.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Remove a single trainer
    const removeTrainer = (trainerId) => {
        setSelectedTrainers((prev) => prev.filter((id) => id !== trainerId));
    };

    const onSubmit = async (data) => {
        console.log(data);

        if (selectedTrainers.length === 0) {
            setError("trainer_ids", {
                type: "manual",
                message: "At least one trainer is required",
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const payload = {
                batches: Number(data.batch_id),
                user: selectedTrainers,
                is_approved: data.is_approved === true,
            };

            const response = await axios.post(
                `${API_BASE_URL}/interview-schedules/`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Assignment successful:", response.data);
            setSubmitSuccess(true);
            reset();
            setSelectedTrainers([]);
        } catch (error) {
            console.error("Assignment failed:", error);
            setSubmitError(
                error.response?.data?.message || "Failed to assign batch to trainer"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="assignABT-batch-container">
            <h2 className="sponsornowHeading pt-2 text-4xl mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
                Assign Trainer For Interview
            </h2>

            <div className="assignABT-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Custom Multi-Select Dropdown with Checkboxes */}
                    <div className="form-groupABT">
                        <label className="form-labelABT ">
                            Select Trainer
                        </label>

                        <div className="relative" ref={dropdownRef}>
                            {/* Dropdown Trigger Button */}
                            <div
                                className={`form-selectABT cursor-pointer flex items-center justify-between min-h-[42px] ${isSubmitting ? "opacity-50 pointer-events-none" : ""
                                    } ${errors.trainer_ids ? "border-red-500" : ""}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="flex flex-wrap gap-1 flex-1">
                                    {selectedTrainers.length === 0 ? (
                                        <span className="">-- Select Trainer --</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                                            {selectedTrainers.length} trainers selected
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    {selectedTrainers.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTrainers([]);
                                            }}
                                            className="mr-2 size-6 text-gray-400 hover:text-gray-600"
                                            title="Clear all"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <svg
                                        className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-hidden">
                                    {/* Search Input */}
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

                                    {/* Trainer List */}
                                    <div className="max-h-48 overflow-y-auto">
                                        {loading ? (
                                            <div className="px-3 py-4 text-center text-gray-500">
                                                Loading trainers...
                                            </div>
                                        ) : filteredTrainers.length === 0 ? (
                                            <div className="px-3 py-4 text-center text-gray-500">
                                                No trainers found
                                            </div>
                                        ) : (
                                            filteredTrainers.map((trainer) => (
                                                <label
                                                    key={trainer.id}
                                                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 ${selectedTrainers.includes(trainer.id) ? "bg-blue-50" : ""
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTrainers.includes(trainer.id)}
                                                        onChange={() => handleTrainerChange(trainer.id)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />

                                                    <div className="ml-3 flex-1">
                                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                                            {trainer.first_name} {trainer.last_name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 block">
                                                            {trainer.email}
                                                        </span>
                                                    </div>

                                                    {selectedTrainers.includes(trainer.id) && (
                                                        <svg
                                                            className="w-3 h-3 text-blue-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))

                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {errors.trainer_ids && (
                            <p className="error-message text-red-500 mt-1">
                                {errors.trainer_ids.message}
                            </p>
                        )}
                    </div>

                    {/* Batch Selection */}
                    <div className="form-groupABT">
                        <label className="form-labelABT" htmlFor="batchId">
                            Select Batch
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
                        {errors.batch_id && (
                            <p className="error-message text-red-500">
                                {errors.batch_id.message}
                            </p>
                        )}
                    </div>

                    {/* Approval Status */}
                    <div className="form-groupABT">
                        <label className="form-labelABT" htmlFor="is_approved">
                            Select Status
                        </label>
                        <select
                            id="is_approved"
                            {...register("is_approved", { required: "Approval status is required" })}
                            className="form-selectABT capitalize"
                            disabled={isSubmitting}
                        >
                            {/* <option value="">-- Select Status --</option> */}
                            <option value="true">Approved</option>
                        </select>
                        {errors.is_approved && (
                            <p className="error-message text-red-500">
                                {errors.is_approved.message}
                            </p>
                        )}
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

                {/* Success Modal */}
                {submitSuccess && (
                    <div
                        className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Assign Batch</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSubmitSuccess(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Batch assigned to trainer(s) successfully!</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitSuccess(false)}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className="error-message text-red-600">{submitError}</div>
                )}
            </div>
        </div>
    );
};

export default AssignTrainerForInterview;