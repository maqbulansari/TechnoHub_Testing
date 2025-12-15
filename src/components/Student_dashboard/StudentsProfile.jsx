import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/authContext";

const StudentsProfile = () => {
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { API_BASE_URL } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchStudentData = async (token) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Students/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentData = response.data;
        setStudent(studentData);
        reset(studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
      fetchStudentData(token);
    }
  }, [reset, API_BASE_URL]);

  const onSubmit = async (data) => {
    setLoading(true);
    if (!student || !accessToken) {
      console.error("Student data or access token is missing");
      return;
    }
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("mobile_no", data.mobile_no);
    formData.append("gender", data.gender);
    formData.append("qualification", data.qualification);
    formData.append("address", data.address);
    formData.append("date_of_birth", data.date_of_birth);
    if (image) {
      formData.append("user_profile", image);
    }
    try {
      await axios.put(`${API_BASE_URL}/Students/${student.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setEditMode(false);
      setSubmitSuccess(true);
      setStudent({ ...student, ...data });
      reset({ ...student, ...data });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading ...</span>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="container py-4">
        {/* Main Card */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* LEFT COLUMN: AVATAR + BASIC INFO */}
                  <div className="col-12 col-md-4 border-end bg-blue-300 rounded-4">
                    <div className="pt-4 text-center">
                      <center>
                        <div className="mb-0">
                          {student.user_profile ? (
                            <img
                              src={`${API_BASE_URL}${student.user_profile}`}
                              className="rounded-circle"
                              alt="Student"
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                border: "3px solid #fff",
                                boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto"
                              style={{
                                width: "150px",
                                height: "150px",
                                fontSize: "56px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                              }}
                            >
                              {student.first_name?.charAt(0)}
                            </div>
                          )}
                        </div>

                      </center>

                    </div>
                  </div>
                  <div className="col-12 col-md-4 ">
                    <div className="p-2 text-center">


                      <h4 className="mb-1 text-dark text-capitalize">
                        {student.first_name} {student.last_name}
                      </h4>
                      <div className="text-muted small mb-2">{student.email}</div>

                      <div className="d-inline-block px-3 py-1 rounded-pill bg-white border small text-uppercase text-primary fw-semibold">
                        Batch: <span className="ms-1">{student.batch}</span>
                      </div>
                    </div>
                  </div>
                  <hr></hr>

                  {/* RIGHT COLUMN: DETAILS / FORM */}
                  <div className="col-12 col-md-8">
                    <div className="p-4">
                      {!editMode ? (
                        // VIEW MODE
                        <>
                          <h5 className="mb-3 text-dark">Personal Details</h5>
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <div className="text-muted small mb-1">First Name</div>
                              <div className="fw-semibold text-capitalize text-dark">
                                {student.first_name || "-"}
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="text-muted small mb-1">Last Name</div>
                              <div className="fw-semibold text-capitalize text-dark">
                                {student.last_name || "-"}
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="text-muted small mb-1">Gender</div>
                              <div className="fw-semibold text-dark">
                                {student.gender || "-"}
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="text-muted small mb-1">Date of Birth</div>
                              <div className="fw-semibold text-dark">
                                {student.date_of_birth || "-"}
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="text-muted small mb-1">Mobile Number</div>
                              <div className="fw-semibold text-dark">
                                {student.mobile_no || "-"}
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="text-muted small mb-1">Qualification</div>
                              <div className="fw-semibold text-capitalize text-dark">
                                {student.qualification || "-"}
                              </div>
                            </div>
                            <div className="col-12 mb-3">
                              <div className="text-muted small mb-1">Address</div>
                              <div className="fw-semibold text-capitalize text-dark">
                                {student.address || "-"}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-end mt-3">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => setEditMode(true)}
                            >
                              <i className="fa-solid fa-user-pen mr-2"></i>
                              Edit Profile
                            </button>
                          </div>
                        </>
                      ) : (
                        // EDIT MODE
                        <>
                          {/* <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 text-dark">Edit Profile</h5>
                            <button
                              className="btn btn-light btn-sm"
                              type="button"
                              onClick={() => {
                                reset(student);
                                setEditMode(false);
                                setImage(null);
                              }}
                            >
                              <i className="fa-solid fa-xmark me-1"></i>
                              Cancel
                            </button>
                          </div> */}

                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">First Name</label>
                                <input
                                  className="form-control form-control-sm"
                                  {...register("first_name", {
                                    required: "First name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters required" },
                                  })}
                                />
                                {errors.first_name && (
                                  <p className="text-danger mt-1 small mb-0">{errors.first_name.message}</p>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Last Name</label>
                                <input
                                  className="form-control form-control-sm"
                                  {...register("last_name", {
                                    required: "Last name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters required" },
                                  })}
                                />
                                {errors.last_name && (
                                  <p className="text-danger mt-1 small mb-0">{errors.last_name.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Email</label>
                                <input
                                  className="form-control form-control-sm"
                                  type="email"
                                  {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                      message: "Invalid email address",
                                    },
                                  })}
                                />
                                {errors.email && (
                                  <p className="text-danger mt-1 small mb-0">{errors.email.message}</p>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Mobile Number</label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  {...register("mobile_no", {
                                    required: "Mobile number is required",
                                    pattern: {
                                      value: /^[0-9]{10}$/,
                                      message: "Enter a valid 10-digit mobile number",
                                    },
                                  })}
                                />
                                {errors.mobile_no && (
                                  <p className="text-danger mt-1 small mb-0">{errors.mobile_no.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Gender</label>
                                <select
                                  className="form-control form-control-sm"
                                  {...register("gender", { required: "Gender is required" })}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Female">Female</option>
                                  <option value="Male">Male</option>
                                  <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                  <p className="text-danger mt-1 small mb-0">{errors.gender.message}</p>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Date of Birth</label>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  max={new Date().toISOString().split("T")[0]}
                                  {...register("date_of_birth", { required: "Date of birth is required" })}
                                />
                                {errors.date_of_birth && (
                                  <p className="text-danger mt-1 small mb-0">{errors.date_of_birth.message}</p>
                                )}
                              </div>

                            </div>

                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Qualification</label>
                                <input
                                  className="form-control form-control-sm"
                                  {...register("qualification", { required: "Qualification is required" })}
                                />
                                {errors.qualification && (
                                  <p className="text-danger mt-1 small mb-0">{errors.qualification.message}</p>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold small">Address</label>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows={2}
                                  {...register("address", { required: "Address is required" })}
                                ></textarea>
                                {errors.address && (
                                  <p className="text-danger mt-1 small mb-0">{errors.address.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-semibold small">Profile Image</label>
                              <input
                                className="form-control form-control-sm"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                              />
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-2">
                              <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={() => {
                                  reset(student);
                                  setEditMode(false);
                                  setImage(null);
                                }}
                              >
                                Cancel
                              </button>
                              <button className="btn btn-primary btn-sm" disabled={loading}>
                                {loading ? (
                                  <>
                                    <span className="fas fa-spinner fa-spin me-2"></span>
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-check me-1"></i> Save Changes
                                  </>
                                )}
                              </button>
                            </div>
                          </form>

                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submitSuccess && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Updated</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSubmitSuccess(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>User profile successfully updated!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSubmitSuccess(false)}
                >
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

export default StudentsProfile;