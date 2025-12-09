import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
const AssessmentCandidateWithForm = () => {
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, API_BASE_URL } = useContext(AuthContext);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, } = useForm();
  const { accessToken } = useContext(AuthContext);
  useEffect(() => {
    const fetchAssessmentDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assessment/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data.data;
        console.log(response);
        // Map assessment_test_status to match select options
        const mappedStatus = {
          Selected: "Selected",
          Not: "Not",
          null: "", // for cases where it's null or undefined
        };
        // Ensure the form gets expected values
        const transformedData = {
          ...data,
          assessment_test_status: mappedStatus[data.assessment_test_status] || "",
          admin_selected: data.admin_selected ? "yes" : "no",
        };
        setAssessmentDetail(data);
        reset(transformedData);
      }
      catch (error) {
        console.error("Error fetching assessment detail:", error);
      }
    };
    fetchAssessmentDetail();
  }, [id, reset]);
  const onSubmit = async (data) => {
    console.log(data);
    // Construct the base payload without admin fields
    const payload = {
      // any uses for add extra fetures in payload
      id: data.id,
      student_id: data.student_id,
      batch_id: data.batch_id,
      trainer_score: data.trainer_score,
      trainer_feedback: data.trainer_feedback,
      assessment_test_status: data.assessment_test_status,
      student_name: data.student_name,
      batch_name: data.batch_name,
      trainer_id: data.trainer_id,
      assessed_by: data.assessed_by,
      trainer_is_selected: data.trainer_is_selected,
      selected_by_trainer: data.selected_by_trainer,
      center: data.center,
    };
    // If the role is ADMIN, add the admin-specific fields to the payload
    if (role === "ADMIN") {
      payload.admin_name = data.admin_name;
      payload.admin_score = data.admin_score;
      payload.admin_feedback = data.admin_feedback;
      payload.admin_selected = data.admin_selected;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/assessment/update/${id}/`, payload);
      console.log("Data updated successfully:", response.data);
      setSubmitSuccess(true);
      // alert("Assessment Completed successfully!");
      // window.location.reload();
    }
    catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update assessment data.");
    }
  };
  if (!assessmentDetail) {
    return (<div className="loading-minimal">
      <div className="dot-flashing"></div>
      <span className="ml-4">Loading ...</span>
    </div>);
  }
  const handleCloseModal = () => {
    setSubmitSuccess(false);
    navigate("/AssessmentTable");
  };
  return (
    <div className="card m-4">
      <div className="card-header p-4">
        <h1 className="sponsornowHeading header-titleH text-center flex flex-column absolute top-5 w-full">
          ASSESSMENT DETAILS
        </h1><br /><br /><br />

        {/* <h1 className="card-title text-center mb-2 text-primary fs-3">
          ASSESSMENT DETAILS
        </h1> */}

      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          {/* Batch ID */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Batch ID</label>
            <input type="number" className={`form-control text-base ${errors.batch_id ? "is-invalid" : ""}`} {...register("batch_id", { required: "Batch ID is required." })} readOnly />
            {errors.batch_id && (<div className="invalid-feedback">{errors.batch_id.message}</div>)}
          </div>

          {/* Trainer Score */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Trainer Score <span className="text-danger" >*</span></label>
            <input type="number" className={`form-control text-base ${errors.trainer_score ? "is-invalid" : ""}`} {...register("trainer_score", {
              required: "Trainer Score is required.",
              min: {
                value: 1,
                message: "Trainer Score should be at least 1",
              },
              max: {
                value: 10,
                message: "Trainer Score cannot exceed 10",
              }
            })} />
            {errors.trainer_score && (<div className="invalid-feedback">
              {errors.trainer_score.message}
            </div>)}
          </div>

          {/* Trainer Feedback */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Trainer Feedback <span className="text-danger"  >*</span></label>
            <input type="text" className={`form-control text-base ${errors.trainer_feedback ? "is-invalid" : ""}`} {...register("trainer_feedback", {
              required: "Trainer Feedback is required.",
              minLength: {
                value: 5,
                message: "Feedback must be at least 5 characters",
              }
            })} />
            {errors.trainer_feedback && (<div className="invalid-feedback">
              {errors.trainer_feedback.message}
            </div>)}
          </div>

          {/* Assessment Test Status */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">
              Assessment Test Status{" "}
              <span className="text-danger"  >*</span>
            </label>
            <select className={`form-select text-base ${errors.assessment_test_status ? "is-invalid" : ""}`} {...register("assessment_test_status", {
              required: "Assessment Test Status is required.",
            })}>
              <option value="">Select</option>
              <option value="Selected">Yes</option>
              <option value="Not">No</option>
            </select>
            {errors.assessment_test_status && (<div className="invalid-feedback">
              {errors.assessment_test_status.message}
            </div>)}
          </div>


          {/* Conditionally render Admin fields if role is ADMIN */}
          {role === "ADMIN" && (<>
            {/* Admin Name */}
            <div className="col-xxl-6 col-xl-6 col-md-6">
              <label className="form-label text-base">Admin Name</label>
              <input type="text" className={`form-control text-base ${errors.admin_name ? "is-invalid" : ""}`} {...register("admin_name", {
                required: "Admin Name is required.",
              })} />
              {errors.admin_name && (<div className="invalid-feedback">
                {errors.admin_name.message}
              </div>)}
            </div>

            {/* Admin Score */}
            <div className="col-xxl-6 col-xl-6 col-md-6">
              <label className="form-label text-base">Admin Score <span className="text-danger"  >*</span></label>
              <input type="number" className={`form-control text-base ${errors.admin_score ? "is-invalid" : ""}`} {...register("admin_score", {
                required: "Admin Score is required.",
                min: {
                  value: 1,
                  message: "Trainer Score should be at least 1",
                },
                max: {
                  value: 10,
                  message: "Trainer Score cannot exceed 10",
                }
              })} />
              {errors.admin_score && (<div className="invalid-feedback">
                {errors.admin_score.message}
              </div>)}
            </div>

            {/* Admin Feedback */}
            <div className="col-xxl-6 col-xl-6 col-md-6">
              <label className="form-label text-base">Admin Feedback <span className="text-danger"  >*</span></label>
              <input type="text" className={`form-control text-base ${errors.admin_feedback ? "is-invalid" : ""}`} {...register("admin_feedback", {
                required: "Admin Feedback is required.",
                minLength: {
                  value: 5,
                  message: "Feedback must be at least 5 characters",
                }
              })} />
              {errors.admin_feedback && (<div className="invalid-feedback">
                {errors.admin_feedback.message}
              </div>)}
            </div>

            {/* Admin Selected */}
            <div className="col-xxl-6 col-xl-6 col-md-6">
              <label className="form-label text-base">
                Admin Selected{" "}
                <span className="text-danger"  >*</span>
              </label>
              <select className={`form-select text-base ${errors.admin_selected ? "is-invalid" : ""}`} {...register("admin_selected", {
                required: "Please select Admin decision.",
              })}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.admin_selected && (<div className="invalid-feedback">
                {errors.admin_selected.message}
              </div>)}
            </div>

          </>)}

          {/* Student Name */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Student Name</label>
            <input type="text" className={`form-control text-base ${errors.student_name ? "is-invalid" : ""}`} {...register("student_name", {
              required: "Student Name is required.",
            })} readOnly />
            {errors.student_name && (<div className="invalid-feedback">
              {errors.student_name.message}
            </div>)}
          </div>

          {/* Batch Name */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Batch Name</label>
            <input type="text" className={`form-control text-base ${errors.batch_name ? "is-invalid" : ""}`} {...register("batch_name", {
              required: "Batch Name is required.",
            })} readOnly />
            {errors.batch_name && (<div className="invalid-feedback">
              {errors.batch_name.message}
            </div>)}
          </div>

          {/* Trainer Name */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Trainer Name</label>
            <input type="text" className={`form-control text-base ${errors.selected_by_trainer ? "is-invalid" : ""}`} {...register("selected_by_trainer", {
              required: "Trainer Name is required.",
            })} readOnly />
            {errors.selected_by_trainer && (<div className="invalid-feedback">
              {errors.selected_by_trainer.message}
            </div>)}
          </div>

          {/* Trainer Is Selected */}
          <div className="col-xxl-6 col-xl-6 col-md-6">
            <label className="form-label text-base">Trainer Is Selected</label>
            <input type="text" className={`form-control text-base ${errors.trainer_is_selected ? "is-invalid" : ""}`} value={assessmentDetail.trainer_is_selected ? "Yes" : "No"} readOnly />
          </div>

          {/* Submit Button */}
          <div className="col-12 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary p-2">
              Update Assessment
            </button>
          </div>
        </form>
      </div>
      {submitSuccess && (<div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assessment</h5>
              <button type="button" className="btn-close" onClick={() => handleCloseModal()}></button>
            </div>
            <div className="modal-body">
              <p>Assessment Completed successfully!</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => handleCloseModal()}>
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>)}
    </div>);
};
export default AssessmentCandidateWithForm;
