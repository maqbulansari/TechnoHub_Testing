import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseURL } from "../../utils/axios";
import { AuthContext } from "../../contexts/authContext";
const TrainerProfile = () => {
    const [trainer, setTrainer] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState(null);
    const [accessToken, setAccessToken] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { API_BASE_URL } = useContext(AuthContext);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm();
    // Fetch trainer data
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token)
            setAccessToken(token);
        axios
            .get(`${API_BASE_URL}/trainers/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
            const trainerData = response.data;
            setTrainer(trainerData);
            reset(trainerData);
        })
            .catch((error) => {
            console.error("Error fetching trainer data:", error);
        });
    }, [API_BASE_URL, reset]);
    // Handle form submit
    const onSubmit = async (data) => {
        if (!trainer)
            return;
        setIsSaving(true);
        const formData = new FormData();
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("job_title", data.job_title);
        formData.append("email", data.email);
        formData.append("mobile_no", data.mobile_no);
        formData.append("gender", data.gender);
        formData.append("qualification", data.qualification);
        formData.append("address", data.address);
        formData.append("date_of_birth", data.date_of_birth);
        if (data.id_type) {
            formData.append("id_type", String(data.id_type));
        }
        if (data.technologies && Array.isArray(data.technologies)) {
            data.technologies.forEach((techId) => {
                formData.append("technologies", String(techId));
            });
        }
        if (image instanceof File) {
            formData.append("user_profile", image);
        }
        try {
            await axios.put(`${API_BASE_URL}/trainers/${trainer.id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSubmitSuccess(true);
            setEditMode(false);
            setTrainer({ ...trainer, ...data });
        }
        catch (error) {
            console.error("Error updating profile:", error.response?.data || error);
        }
        finally {
            setIsSaving(false);
        }
    };
    if (!trainer) {
        return (<div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading...</span>
      </div>);
    }
    return (<div className="container mt-3">
      <div className="card shadow-lg border-0 rounded p-4">
        <div className="row align-items-center">
          <div className="col-sm-12 col-md-4 d-flex flex-column align-items-center justify-content-center mb-3">
            {trainer.user_profile ? (<img src={`${baseURL}${trainer.user_profile}`} alt="Trainer Profile" className="img-thumbnail rounded-circle border border-primary" style={{ width: "180px", height: "180px", objectFit: "cover" }}/>) : (<div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{
                width: "180px",
                height: "180px",
                fontSize: "64px",
                fontWeight: "bold",
                textTransform: "uppercase",
            }}>
                {trainer.first_name?.charAt(0)}
              </div>)}
            <button className="btn btn-primary btn-sm w-100 mt-3" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>

          <div className="col-sm-12 col-md-8">
            {editMode ? (<form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  {/* FIRST NAME */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">First Name</label>
                    <input className="form-control" {...register("first_name", {
            required: "First name is required",
        })}/>
                    {errors.first_name && (<small className="text-danger">
                        {errors.first_name.message}
                      </small>)}
                  </div>

                  {/* LAST NAME */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Last Name</label>
                    <input className="form-control" {...register("last_name", {
            required: "Last name is required",
        })}/>
                    {errors.last_name && (<small className="text-danger">
                        {errors.last_name.message}
                      </small>)}
                  </div>

                  {/* JOB TITLE */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Job Title</label>
                    <input className="form-control" {...register("job_title", {
            required: "Job title is required",
        })}/>
                    {errors.job_title && (<small className="text-danger">
                        {errors.job_title.message}
                      </small>)}
                  </div>

                  {/* EMAIL */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input className="form-control" type="email" {...register("email", {
            required: "Email is required",
            pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
            },
        })}/>
                    {errors.email && (<small className="text-danger">
                        {errors.email.message}
                      </small>)}
                  </div>

                  {/* MOBILE */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Mobile No</label>
                    <input className="form-control" {...register("mobile_no", {
            required: "Mobile number is required",
            pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid mobile number",
            },
        })}/>
                    {errors.mobile_no && (<small className="text-danger">
                        {errors.mobile_no.message}
                      </small>)}
                  </div>

                  {/* GENDER */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Gender</label>
                    <select className="form-control" {...register("gender", { required: "Gender is required" })}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (<small className="text-danger">
                        {errors.gender.message}
                      </small>)}
                  </div>

                  {/* QUALIFICATION */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Qualification</label>
                    <input className="form-control" {...register("qualification", {
            required: "Qualification is required",
        })}/>
                    {errors.qualification && (<small className="text-danger">
                        {errors.qualification.message}
                      </small>)}
                  </div>

                  {/* ADDRESS */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Address</label>
                    <input className="form-control" {...register("address", {
            required: "Address is required",
        })}/>
                    {errors.address && (<small className="text-danger">
                        {errors.address.message}
                      </small>)}
                  </div>

                  {/* DOB */}
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold">Date of Birth</label>
                    <input className="form-control" type="date" {...register("date_of_birth", {
            required: "Date of birth is required",
        })}/>
                    {errors.date_of_birth && (<small className="text-danger">
                        {errors.date_of_birth.message}
                      </small>)}
                  </div>

                  {/* IMAGE */}
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Profile Image</label>
                    <input className="form-control" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)}/>
                  </div>

                  {/* BUTTONS */}
                  <div className="col-12 d-flex gap-2">
                    <button type="submit" className="btn btn-primary w-100">
                      {isSaving ? (<>
                          <span className="fas fa-spinner fa-spin me-2"></span>
                        </>) : ("Save Changes")}
                    </button>
                    <button type="button" className="btn btn-secondary w-100" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>) : (<div className="table-responsive">
                <h3 className="profile-headerHTP text-uppercase">
                  <span className="font-bold text-primary px-3 ">Name</span>:{" "}
                  {trainer.first_name} {trainer.last_name}
                </h3>
                <p className="profile-subheaderHTP mb-3">
                  <span className="font-bold text-primary px-3">Job Title</span>
                  : {trainer.job_title}
                </p>
                <table className="custom-tableHTP px-2">
                  <tbody>
                    <tr>
                      <th>Email:</th>
                      <td>{trainer.email}</td>
                    </tr>
                    <tr>
                      <th>Mobile:</th>
                      <td>{trainer.mobile_no}</td>
                    </tr>
                    <tr>
                      <th>Gender:</th>
                      <td>{trainer.gender}</td>
                    </tr>
                    <tr>
                      <th>Qualification:</th>
                      <td>{trainer.qualification}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{trainer.address}</td>
                    </tr>
                    <tr>
                      <th>Date of Birth:</th>
                      <td>{trainer.date_of_birth}</td>
                    </tr>
                  </tbody>
                </table>
              </div>)}
          </div>
        </div>
      </div>


      {submitSuccess && (<div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Updated</h5>
                <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
              </div>

              <div className="modal-body">
                <p>Your profile has been updated successfully!</p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setSubmitSuccess(false)} data-bs-dismiss="modal">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
};
export default TrainerProfile;
