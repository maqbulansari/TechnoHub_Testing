import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";

const AssignBatchForTrainer = () => {
  const { batches, allTrainer, fetchBatches, fetchAllTrainer, API_BASE_URL } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  // Fetch batches and trainers when component mounts
  useEffect(() => {
    if (fetchBatches) fetchBatches();
    if (fetchAllTrainer) fetchAllTrainer();
  }, [fetchBatches, fetchAllTrainer]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        batch_id: data.batch_id,
        trainer_ids: [parseInt(data.trainer_ids)], // Convert to number and wrap in array
      };

      const response = await axios.post(
        `${API_BASE_URL}/batches/assign_trainers_for_admin/`,
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
    <div className="assignABT-batch-container mt-6">
      {/* <h1 className="assignABT-batch-title text-center text-nowrap">
        Assign Batch to Trainer
      </h1> */}
       <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
        Assign Batch to Trainer
      </h2>

      <div className="assignABT-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-groupABT">
            <label className="form-labelABT" htmlFor="trainerId">
              Select Trainer
            </label>
            <select
              id="trainerId"
              {...register("trainer_ids", { required: "Trainer is required" })}
              className="form-selectABT capitalize"
              disabled={isSubmitting}
            >
              <option value="">-- Select Trainer --</option>
              {allTrainer.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.first_name} {trainer.last_name} - {trainer.email}
                </option>
              ))}
            </select>
            {errors.trainer_ids && (
              <p className="error-message text-red-500">{errors.trainer_ids.message}</p>
            )}
          </div>

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
                <option key={batch.batch_id} value={batch.batch_id}>
                  {batch.batch_name} - {batch.center}
                </option>
              ))}
            </select>
            {errors.batch_id && (
              <p className="error-message text-red-500">{errors.batch_id.message}</p>
            )}
          </div>

          {/* <button
            type="submit"
            className="submit-buttonABT"
            disabled={isSubmitting}
          >
            {isSubmitting ? "" : "Assign Batch"}
          </button> */}
          <button
            type="submit"
            className="submit-buttonABT"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
              </>
            ) : (
              <>
                Assign Batch
              </>
            )}
          </button>

        </form>
        {/* {submitSuccess && (
          <div className="success-message">
            Batch assigned to trainer successfully!
          </div>
        )} */}
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
                  <p> Batch assigned to trainer successfully!</p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setSubmitSuccess(false)}
                    data-bs-dismiss="modal"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {submitError && <div className="error-message text-red-600">{submitError}</div>}
      </div>
    </div>
  );
};

export default AssignBatchForTrainer;
