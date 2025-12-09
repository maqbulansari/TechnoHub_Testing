import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";
const InterviewCandidate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidateData } = location.state || {};
  const { error1, batches, loadingBatches, fetchBatches, API_BASE_URL } = useContext(AuthContext);
  const [accessToken, setAccessToken] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch batches when component mounts
  useEffect(() => {
    if (fetchBatches) {
      fetchBatches();
    }
  }, [fetchBatches]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);
  const { register, handleSubmit, formState: { errors }, } = useForm({
    defaultValues: {
      id: candidateData?.id || "",
      name: candidateData?.name || "",
      email: candidateData?.email || "",
      mobile_no: candidateData?.mobile_no || "",
      role: candidateData?.role || "",
      subrole: candidateData?.subrole || "",
      gender: candidateData?.gender || "",
      batch: candidateData?.batch || "",
      eng_comm_skills: candidateData?.eng_comm_skills || 1,
      humble_background: candidateData?.humble_background || "",
      laptop: candidateData?.laptop || "",
      profession: candidateData?.profession || "",
      selected_status: candidateData?.selected_status || "",
      level: candidateData?.level || 1,
      source: candidateData?.source || "",
      remarks: candidateData?.remarks || "",
    },
  });
  const onSubmit = async (data) => {
    console.log(data);
    if (!accessToken) {
      alert("No authentication token available");
      return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/Learner/${data.id}/update_selected/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Data updated successfully:", response.data);
      setSubmitSuccess(true);
      // alert("Candidate data updated successfully!");
    }
    catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update candidate data.");
    }
  };
  if (!candidateData) {
    return <div className="container mt-4">No candidate data found.</div>;
  }
  const handleOnclosemodal = () => {
    setSubmitSuccess(false);
    navigate("/Admission_table");
  };
  return (<div className="card m-4">
    <div className="card-header">
      {/* <h1 className="card-title text-center mb-2 text-primary fs-3">
          CANDIDATE INFORMATION FOR INTERVIEW
        </h1> */}
      <div className="header-containerH d-flex justify-center w-100 ">
        <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
          CANDIDATE  INFORMATION  FOR  INTERVIEW
        </h2>
      </div>
    </div>
    <div className="card-body">
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        {/* Name */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">Name</label>
          <input type="text" className={`form-control text-base ${errors.name ? "is-invalid" : ""}`} {...register("name", { required: "Name is required." })} readOnly />
          {errors.name && (<div className="invalid-feedback">{errors.name.message}</div>)}
        </div>

        {/* Email */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">Email</label>
          <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} {...register("email", { required: "Email is required." })} readOnly />
          {errors.email && (<div className="invalid-feedback">{errors.email.message}</div>)}
        </div>

        {/* Mobile No */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">
            Mobile No{" "}
            <span className="text-danger" style={{ fontSize: "1.2em" }}>
              *
            </span>
          </label>
          <input type="number" className={`form-control text-base ${errors.mobile_no ? "is-invalid" : ""}`} {...register("mobile_no", {
            required: "Mobile No is required.", minLength: {
              value: 10,
              message: "Mobile number must be 10 digits."
            },
            maxLength: {
              value: 10,
              message: "Mobile number must be 10 digits."
            },
          })} />
          {errors.mobile_no && (<div className="invalid-feedback">{errors.mobile_no.message}</div>)}
        </div>

        {/* Role */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">Role</label>
          <input type="text" className={`form-control ${errors.role ? "is-invalid" : ""} text-sm`} {...register("role", { required: "Role is required." })} readOnly />
          {errors.role && (<div className="invalid-feedback">{errors.role.message}</div>)}
        </div>

        {/* Subrole */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">Subrole</label>
          <input type="text" className="form-control text-sm" {...register("subrole")} readOnly />
        </div>

        {/* Gender */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">
            Gender <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.gender ? "is-invalid" : ""}`} {...register("gender", { required: "Gender is required." })}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (<div className="invalid-feedback">{errors.gender.message}</div>)}
        </div>

        {/* Batch - Updated with dynamic data */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">Batch </label>
          {loadingBatches ? (<select className="form-select" disabled>
            <option>Loading batches...</option>
          </select>) : error1 ? (<select className="form-select" disabled>
            <option className="text-danger">{error1}</option>
          </select>) : (<select className="form-select" {...register("batch")}>
            <option value="">Select batch</option>
            {batches.map((batch) => (<option key={batch.id} value={batch.batch_id}>
              {batch.batch_name} - {batch.trainer.join(", ")} -{" "}
              {batch.center}
            </option>))}
          </select>)}
        </div>

        {/* English Communication Skills */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">
            English Communication Skills <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.eng_comm_skills ? "is-invalid" : ""}`} {...register("eng_comm_skills", {
            required: "English communication skill rating is required.",
          })}>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          {errors.eng_comm_skills && (<div className="invalid-feedback">{errors.eng_comm_skills.message}</div>)}
        </div>

        {/* Humble Background */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">
            Humble Background <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.humble_background ? "is-invalid" : ""}`} {...register("humble_background", {
            required: "Please select humble background option.",
          })}>
            <option value="">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
          {errors.humble_background && (<div className="invalid-feedback">
            {errors.humble_background.message}
          </div>)}
        </div>

        {/* Laptop */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label ">
            Laptop <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.laptop ? "is-invalid" : ""}`} {...register("laptop", { required: "Please select laptop option." })}>
            <option value="">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
          {errors.laptop && (<div className="invalid-feedback">{errors.laptop.message}</div>)}
        </div>

        {/* Profession */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label">
            Profession <span className="text-danger">*</span>
          </label>
          <input type="text" className={`form-control text-base ${errors.profession ? "is-invalid" : ""}`} {...register("profession", {
            required: "Profession is required.", pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Profession should contain only letters."
            }
          },)} />
          {errors.profession && (<div className="invalid-feedback">{errors.profession.message}</div>)}
        </div>

        {/* Selected Status */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label">
            Selected Status <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.selected_status ? "is-invalid" : ""}`} {...register("selected_status", {
            required: "Please select a status.",
          })}>
            <option value="">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
            <option value="TBD">To Be Determined</option>
          </select>
          {errors.selected_status && (<div className="invalid-feedback">{errors.selected_status.message}</div>)}
        </div>

        {/* Level */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label">
            Level <span className="text-danger">*</span>
          </label>
          <select className={`form-select ${errors.level ? "is-invalid" : ""}`} {...register("level", { required: "Please select level." })}>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          {errors.level && (<div className="invalid-feedback">{errors.level.message}</div>)}
        </div>

        {/* Source */}
        <div className="col-xxl-6 col-xl-6 col-md-6">
          <label className="form-label">
            Source <span className="text-danger">*</span>
          </label>
          <input type="text" className={`form-control ${errors.source ? "is-invalid" : ""}`} {...register("source", {
            required: "Source is required.", pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Source should contain only letters."
            }
          })} />
          {errors.source && (<div className="invalid-feedback">{errors.source.message}</div>)}
        </div>

        {/* Remarks */}
        <div className="col-12">
          <label className="form-label">
            Remarks <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
            {...register("remarks", {
              required: "Remarks are required.",
              minLength: {
                value: 3,
                message: "Remarks must be at least 3 characters."
              },
              maxLength: {
                value: 200,
                message: "Remarks cannot exceed 200 characters."
              }
            })}
          />
          {errors.remarks && (<div className="invalid-feedback">{errors.remarks.message}</div>)}
        </div>

        {/* Submit Button */}
        <div className="col-12 d-flex justify-content-center">
          <button type="submit" className="custom-button-interview">
            Update Candidate
          </button>
        </div>
      </form>
    </div>


    {submitSuccess && (<div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">INFORMATION</h5>
            <button type="button" className="btn-close" onClick={() => handleOnclosemodal()}></button>
          </div>

          <div className="modal-body">
            <p>Candidate data updated successfully!</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={() => handleOnclosemodal()} data-bs-dismiss="modal">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>)}
  </div>);
};
export default InterviewCandidate;
