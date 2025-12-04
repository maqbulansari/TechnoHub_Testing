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
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          {/* Profile Card */}
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              {/* Profile Header - Always Visible */}
              <center>
                <div className="bg-blue-200 p-2">
                  {student.user_profile ? (
                    <img
                      src={`${API_BASE_URL}${student.user_profile}`}
                      className="card-img-top rounded-circle mx-auto mt-4"
                      alt="Student"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto mt-4"
                      style={{
                        width: "150px",
                        height: "150px",
                        fontSize: "60px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {student.first_name?.charAt(0)}
                    </div>
                  )}
                </div>
              </center>

              <div className="card-body text-center">
                <h4 className="card-title mb-2 text-black capitalize">
                  {student.first_name} {student.last_name}
                </h4>
                <p className="text-muted mb-3 text-black">{student.email}</p>
                <p className="bg-gray-300 p-2 rounded-3 mb-3 text-black">
                  <strong className="uppercase">Batch</strong> <br />
                  <span className="uppercase text-blue-400 font-bold">{student.batch}</span>
                </p>

                {/* Conditional Rendering: View Mode OR Edit Mode */}
                {!editMode ? (
                  // VIEW MODE - Show Details
                  <>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">First Name</span>
                          <span className="text-black capitalize">{student.first_name}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">Last Name</span>
                          <span className="text-black capitalize">{student.last_name}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">Gender</span>
                          <span className="text-black">{student.gender}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">Qualification</span>
                          <span className="text-black capitalize">{student.qualification}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">Address</span>
                          <span className="text-black capitalize">{student.address}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">Date of Birth</span>
                          <span className="text-black">{student.date_of_birth}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-black font-bold">Mobile No</span>
                          <span className="text-black">{student.mobile_no}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile<i className="fa-solid fa-user-pen ml-2"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  // EDIT MODE - Show Form
                  <div className="text-start mt-3">
                    <div className=" mb-3 pb-2"><br></br>
                      <center>
                      <h5 className="mb-0 font-bold text-black">
                        <i className="fa-solid fa-pen-to-square me-2"></i>
                        Edit Profile
                      </h5></center>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label fw-bold text-sm">First Name</label>
                          <input
                            className="form-control form-control-sm"
                            {...register("first_name")}
                          />
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label fw-bold text-sm">Last Name</label>
                          <input
                            className="form-control form-control-sm"
                            {...register("last_name")}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold text-sm">Email</label>
                        <input
                          className="form-control form-control-sm"
                          {...register("email")}
                          type="email"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold text-sm">Mobile No</label>
                        <input
                          className="form-control form-control-sm"
                          {...register("mobile_no")}
                        />
                      </div>

                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label fw-bold text-sm">Gender</label>
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
                            <p className="text-danger mt-1 text-sm">{errors.gender.message}</p>
                          )}
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label fw-bold text-sm">Date of Birth</label>
                          <input
                            className="form-control form-control-sm"
                            type="date"
                            {...register("date_of_birth", { required: "DOB is required" })}
                          />
                          {errors.date_of_birth && (
                            <p className="text-danger mt-1 text-sm">{errors.date_of_birth.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold text-sm">Qualification</label>
                        <input
                          className="form-control form-control-sm"
                          {...register("qualification")}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold text-sm">Address</label>
                        <input
                          className="form-control form-control-sm"
                          {...register("address")}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold text-sm">Profile Image</label>
                        <input
                          className="form-control form-control-sm"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                      </div>

                      <div className="d-flex gap-2 mt-4">
                        <button className="btn btn-primary btn-sm flex-grow-1" disabled={loading}>
                          {loading ? (
                            <span className="fas fa-spinner fa-spin me-2"></span>
                          ) : (
                            <>
                              <i className="fa-solid fa-check me-1"></i> Save
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm flex-grow-1"
                          onClick={() => setEditMode(false)}
                          type="button"
                        >
                          <i className="fa-solid fa-xmark me-1"></i> Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
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
    </>
  );
};

export default StudentsProfile;

// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { AuthContext } from "../../contexts/authContext";
// const StudentsProfile = () => {
//   const [student, setStudent] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [image, setImage] = useState(null);
//   const [accessToken, setAccessToken] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const { API_BASE_URL } = useContext(AuthContext);
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   useEffect(() => {
//     const fetchStudentData = async (token) => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/Students/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const studentData = response.data;
//         setStudent(studentData);
//         reset(studentData);
//       }
//       catch (error) {
//         console.error("Error fetching student data:", error);
//       }
//     };
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       setAccessToken(token);
//       fetchStudentData(token);
//     }
//   }, [reset, API_BASE_URL]);
//   const onSubmit = async (data) => {
//     setLoading(true);
//     if (!student || !accessToken) {
//       console.error("Student data or access token is missing");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("first_name", data.first_name);
//     formData.append("last_name", data.last_name);
//     formData.append("email", data.email);
//     formData.append("mobile_no", data.mobile_no);
//     formData.append("gender", data.gender);
//     formData.append("qualification", data.qualification);
//     formData.append("address", data.address);
//     formData.append("date_of_birth", data.date_of_birth);
//     if (image) {
//       formData.append("user_profile", image);
//     }
//     try {
//       await axios.put(`${API_BASE_URL}/Students/${student.id}/`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       setEditMode(false);
//       setSubmitSuccess(true);
//       // Update local state with new data
//       setStudent({ ...student, ...data });
//       reset({ ...student, ...data });
//     }
//     catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile. Please try again.");
//     }
//     finally {
//       setLoading(false);
//     }
//   };
//   if (!student) {
//     return (<div className="loading-minimal">
//       <div className="dot-flashing"></div>
//       <span className="ml-4">Loading ...</span>
//     </div>);
//   }
//   return (<>
//     <div className="container mt-5">
//       <div className="row">
//         {/* Profile Card */}
//         <div className="col-md-4">
//           <div className="card shadow-sm">
//             <center>
//             <div className="bg-blue-200 p-2">
//             {student.user_profile ? (<img src={`${API_BASE_URL}${student.user_profile}`} className="card-img-top rounded-circle mx-auto mt-4" alt="Student" style={{ width: "150px", height: "150px", objectFit: "cover" }} />) : (<div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto mt-4" style={{
//               width: "150px",
//               height: "150px",
//               fontSize: "60px",
//               fontWeight: "bold",
//               textTransform: "uppercase",
//             }}>
//               {student.first_name?.charAt(0)}
//             </div>)}
//             </div></center>
//             <div className="card-body text-center">
//               <h4 className="card-title mb-2 text-black capitalize">
//                 {student.first_name} {student.last_name}
//               </h4>
//               <p className="text-muted mb-3 text-black">{student.email}</p>
//               <p className="bg-gray-300 p-2 rounded-3 mb-3 text-black">
//                 <strong className="uppercase">Batch</strong> <br></br><span className="uppercase text-blue-400 font-bold">{student.batch}</span>
//               </p>
//               <div className="card-body">
//                 <ul className="list-group list-group-flush">
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">First Name</span>
//                     <span className="text-black capitalize">{student.first_name}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">Last Name</span>
//                     <span className="text-black capitalize">{student.last_name}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">Gender</span>
//                     <span className="text-black">{student.gender}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">Qualification</span>
//                     <span className="text-black capitalize">{student.qualification}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">Address</span>
//                     <span className="text-black capitalize">{student.address}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">Date of Birth</span>
//                     <span className="text-black">{student.date_of_birth}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-black font-bold">Mobile No</span>
//                     <span className="text-black">{student.mobile_no}</span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="d-grid gap-2">
//                 <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>
//                   Edit Profile<i className="fa-solid fa-user-pen ml-2"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Student Details or Form */}
//         <div className="col-md-8">
//           {editMode ? (
//             // Edit Form
//             <div className="card shadow-sm">
//               <div className="card-header bg-white">
//                 <h4 className="mb-0 font-bold text-2xl text-black">
//                   Edit Student Details
//                 </h4>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="mb-3">
//                     <label className="form-label fw-bold">First Name</label>
//                     <input className="form-control" {...register("first_name")} />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Last Name</label>
//                     <input className="form-control" {...register("last_name")} />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Email</label>
//                     <input className="form-control" {...register("email")} type="email" />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Mobile No</label>
//                     <input className="form-control" {...register("mobile_no")} />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Gender</label>
//                     <select className="form-control" {...register("gender", { required: "Gender is required" })}>
//                       <option value="">Select Gender</option>
//                       <option value="Female">Female</option>
//                       <option value="Male">Male</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {errors.gender && (<p className="text-danger mt-1">{errors.gender.message}</p>)}
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Qualification</label>
//                     <input className="form-control" {...register("qualification")} />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Address</label>
//                     <input className="form-control" {...register("address")} />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Date of Birth</label>
//                     <input className="form-control" type="date" {...register("date_of_birth", { required: "Date of birth is required" })} />
//                     {errors.date_of_birth && (<p className="text-danger mt-1">{errors.date_of_birth.message}</p>)}
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label fw-bold">Profile Image</label>
//                     <input className="form-control" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
//                   </div>

//                   <div className="flex gap-2">
//                     <button className="btn btn-primary w-40">
//                       {loading ?
//                         <span className="fas fa-spinner fa-spin me-2"></span> :
//                         "Save Changes"}
//                     </button>
//                     <button className="btn btn-secondary w-40" onClick={() => setEditMode(false)} type="button">
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>) : (
//             // Student Details View
//             <div className="">
//               {/* <div className="card-header bg-white">
//                   <h4 className="mb-0 font-bold text-2xl text-black">Student Details</h4>
//                 </div> */}
//               {/* <div className="card-body">
//                   <ul className="list-group list-group-flush">
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Batch</span>
//                       <span className="text-black capitalize">{student.batch}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">First Name</span>
//                       <span className="text-black capitalize">{student.first_name}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Last Name</span>
//                       <span className="text-black capitalize">{student.last_name}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Email</span>
//                       <span className="text-black">{student.email}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Mobile No</span>
//                       <span className="text-black">{student.mobile_no}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Gender</span>
//                       <span className="text-black">{student.gender}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Qualification</span>
//                       <span className="text-black capitalize">{student.qualification}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Address</span>
//                       <span className="text-black capitalize">{student.address}</span>
//                     </li>
//                     <li className="list-group-item d-flex justify-content-between align-items-center">
//                       <span className="fw-bold text-black font-bold">Date of Birth</span>
//                       <span className="text-black">{student.date_of_birth}</span>
//                     </li>
//                   </ul>
//                 </div> */}
//             </div>)}
//         </div>
//       </div>
//     </div>

//     {/* Success Modal */}
//     {submitSuccess && (<div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Profile Updated</h5>
//             <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
//           </div>
//           <div className="modal-body">
//             <p>User profile successfully updated!</p>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-primary" onClick={() => setSubmitSuccess(false)} data-bs-dismiss="modal">
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>)}
//   </>);
// };
// export default StudentsProfile;
