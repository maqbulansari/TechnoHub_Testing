import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";

const RecruitmentProfile = () => {
  const { API_BASE_URL, role, responseSubrole } = useContext(AuthContext);
  const accessToken = localStorage.getItem("accessToken");
  const { recruiterProfileDetails, FetchRecuiter, dataFetched, setDataFetched } = useContext(SponsorContext);

  // Fetch recruiter data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "RECRUITER" || role === "ADMIN") && !dataFetched['recruiter']) {
      FetchRecuiter().then(() => {
        setDataFetched(prev => ({ ...prev, 'recruiter': true }));
      });
    }
  }, [responseSubrole, role, dataFetched, FetchRecuiter, setDataFetched]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gender, setGender] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [userProfileError, setUserProfileError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingProfileImage, setExistingProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Basic form validation errors
  const [errors, setErrors] = useState({});

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setUserProfileError("Only JPG, JPEG, or PNG files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUserProfileError("Image size should be less than 2MB");
      return;
    }

    setProfileImage(file);
    setUserProfileError("");
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview("");
    URL.revokeObjectURL(imagePreview);
  };

  useEffect(() => {
    if (recruiterProfileDetails?.length) {
      const profile = recruiterProfileDetails[0];
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      setPhoneNumber(profile.mobile_no || "");
      setCompanyName(profile.company_name || "");
      setGender(profile.gender || "");
      setExistingProfileImage(profile.user_profile || "");
    }
  }, [recruiterProfileDetails]);

  const toggleDisabled = () => setDisabled(!disabled);

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())
    )
      newErrors.email = "Invalid email address";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{7,15}$/.test(phoneNumber.trim()))
      newErrors.phoneNumber = "Invalid phone number";
    if (!companyName.trim()) newErrors.companyName = "Company name is required";
    if (!gender) newErrors.gender = "Please select a gender";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecruiterUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const currentProfile = recruiterProfileDetails[0];
      const formData = new FormData();

      formData.append("id", currentProfile.id);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("mobile_no", phoneNumber);
      formData.append("company_name", companyName);
      formData.append("gender", gender);
      formData.append("identity", currentProfile.identity || "");
      formData.append("qualification", currentProfile.qualification || "");
      formData.append("address", currentProfile.address || "");

      if (profileImage) formData.append("user_profile", profileImage);

      const response = await axios.put(
        `${API_BASE_URL}/recruiter/Recruiter_update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        setDisabled(true);
        setProfileImage(null);
        setImagePreview("");
        setExistingProfileImage(response.data.user_profile || "");
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error("Error updating recruiter:", error);
      window.alert(
        error.response
          ? `Update failed: ${JSON.stringify(error.response.data)}`
          : "Failed to update profile. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-16">
      <div className="card shadow-sm border-0 p-3">
        <div className="row ">
          <div className="col-xxl-12  mb-3">
            <div className=" me-4 bg-blue-300 rounded-4 p-2">
              <center>
                {imagePreview || existingProfileImage ? (
                  <img
                    src={imagePreview || `${API_BASE_URL}${existingProfileImage}`}
                    className="profileImg mb-2"
                    alt="Profile"
                    style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mb-2 uppercase"
                    style={{ width: "150px", height: "150px", fontSize: "60px", fontWeight: "bold" }}
                  >
                    {firstName?.charAt(0) || "R"}
                  </div>
                )}</center>


            </div>
            <center>
              {recruiterProfileDetails.map((items, idx) => (
                <div className="profileView pt-2" key={idx}>
                  <h4 className="mb-1 text-dark text-capitalize">
                    {items.first_name} {items.last_name}
                  </h4>
                  <div className="text-muted small mb-2">{items.email}</div>

                </div>
              ))}</center>
          </div>

        </div>

        <hr />

        <div className="row">
          <div className="col-xxl-6 mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              id="firstName"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
          </div>

          <div className="col-xxl-6 mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              id="lastName"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
          </div>

          <div className="col-xxl-6 mb-3">
            <label className="form-label" htmlFor="user_profile">
              User Profile Image
            </label>
            <input
              disabled={!isEditing}
              id="user_profile"
              type="file"
              className="form-control"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleImageUpload}
            />
            {userProfileError && <span className="text-danger">{userProfileError}</span>}
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px", maxHeight: "100px" }} className="mb-2" />
                <button type="button" className="btn btn-sm btn-danger" onClick={removeImage}>
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="col-xxl-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              disabled={!isEditing}
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div className="col-xxl-6 mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              disabled={!isEditing}
              id="phoneNumber"
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}
          </div>

          <div className="col-xxl-6 mb-3">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              id="companyName"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            {errors.companyName && <span className="text-danger">{errors.companyName}</span>}
          </div>

          <div className="col-xxl-6 mb-3">
            <label className="form-label" htmlFor="Gender">
              Select Gender
            </label>
            <div className="dropdown">
              <button
                className="btnDropdown dropdown-toggle form-control"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                disabled={!isEditing}
              >
                {gender || "Select Gender"}
              </button>
              <ul className="dropdown-menu w-100">
                {["Male", "Female", "Other"].map((g) => (
                  <li key={g} className="dropdown-item c-pointer" onClick={() => setGender(g)}>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            {errors.gender && <span className="text-danger">{errors.gender}</span>}
          </div>
        </div>

        {/* <div className="row">
          <div className="col-12 text-center">
            <button className="btn btn-primary w-40" onClick={handleRecruiterUpdate} disabled={loading}>
              {loading ? <span className="fas fa-spinner fa-spin me-2"></span> : "Submit Change"}
            </button>
          </div>
        </div> */}

        <div className="w-full text-end">
          <button
            className="btn btn-primary text-end"
            onClick={() => {
              if (isEditing) handleRecruiterUpdate();
              setIsEditing(!isEditing);
              toggleDisabled();
            }}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button></div>
      </div>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
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
        </div>
      )}
    </div>
  );
};

export default RecruitmentProfile;
