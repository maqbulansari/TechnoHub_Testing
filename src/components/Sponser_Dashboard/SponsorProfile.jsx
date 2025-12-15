import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";

const Sponsor_Profile = () => {
  const { sponsorProfileDetails, FetchSponsor, dataFetched, setDataFetched } = useContext(SponsorContext);
  const { API_BASE_URL, role, responseSubrole } = useContext(AuthContext);
  const accessToken = localStorage.getItem("accessToken");

  // Fetch sponsor data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "SPONSOR" || role === "ADMIN") && !dataFetched['sponsor']) {
      FetchSponsor().then(() => {
        setDataFetched(prev => ({ ...prev, 'sponsor': true }));
      });
    }
  }, [responseSubrole, role, dataFetched, FetchSponsor, setDataFetched]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gender, setGender] = useState("");
  const [contributionType, setContributionType] = useState("");
  const [contributionValue, setContributionValue] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [userProfileError, setUserProfileError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingProfileImage, setExistingProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({}); // field-level errors

  // Populate initial data
  useEffect(() => {
    if (sponsorProfileDetails?.length) {
      const profile = sponsorProfileDetails[0];
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      setPhoneNumber(profile.mobile_no || "");
      setCompanyName(profile.company_name || "");
      setGender(profile.gender || "");
      setExistingProfileImage(profile.user_profile || "");
      setContributionType(profile.contribution_type || "");
      setContributionValue(profile.contribution_value || "");
    }
  }, [sponsorProfileDetails]);

  const toggleDisabled = () => setDisabled(!disabled);

  // Image upload with validation
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

  // Field validation function
  const validateFields = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10,15}$/.test(phoneNumber))
      newErrors.phoneNumber = "Phone number should be 10-15 digits";
    if (!companyName.trim()) newErrors.companyName = "Company name is required";
    if (!gender) newErrors.gender = "Please select gender";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSponsorUpdate = async () => {
    if (!validateFields()) return;

    if (profileImage && profileImage.size > 2 * 1024 * 1024) {
      setUserProfileError("Profile image size should be less than 2MB.");
      return;
    }

    setLoading(true);

    try {
      const currentProfile = sponsorProfileDetails[0];
      const formData = new FormData();

      formData.append("id", currentProfile.id);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("mobile_no", phoneNumber);
      formData.append("company_name", companyName);
      formData.append("gender", gender);
      formData.append("contribution_type", contributionType);
      formData.append("contribution_value", contributionValue);

      // Optional fallback fields
      formData.append("id_type", currentProfile.id_type || "");
      formData.append("identity", currentProfile.identity || "");
      formData.append("qualification", currentProfile.qualification || "");
      formData.append("address", currentProfile.address || "");
      formData.append("date_of_birth", currentProfile.date_of_birth || "");

      if (profileImage) {
        formData.append("user_profile", profileImage);
      }

      const response = await axios.put(
        `${API_BASE_URL}/sponsors/Sponser_update/`,
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
      const errMsg =
        error.response?.data?.message || "Failed to update profile. Check your connection.";
      alert(errMsg); // simple alert for backend errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-16">
      <div className="card shadow-sm border-0 p-3">
        <div className="row">
          <div className="col-xxl-12 col-xl-12 col-md-12 mb-3 text-center">
            <div className=" me-4 bg-blue-300 rounded-4 p-2">
              <center>
                {imagePreview || existingProfileImage ? (
                  <img
                    src={
                      imagePreview
                        ? imagePreview
                        : `${API_BASE_URL}${existingProfileImage}`
                    }
                    className="profileImg mb-2"
                    alt="Profile"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mb-2"
                    style={{
                      width: "150px",
                      height: "150px",
                      fontSize: "60px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {firstName?.charAt(0) || "S"}
                  </div>
                )}
              </center>

            </div>
            {sponsorProfileDetails.map((items, idx) => (
              <div className="profileView pt-2" key={idx}>
                <h4 className="mb-1 text-dark text-capitalize">
                  {items.first_name} {items.last_name}
                </h4>
                <div className="text-muted small mb-2">{items.email}</div>
              </div>
            ))}
          </div>
          <hr />



          {/* Form Fields */}
          <div className="row">
            {/* First Name */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                id="firstName"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                id="lastName"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>

            {/* Profile Image */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label className="form-label" htmlFor="user_profile">
                User Profile Image
              </label>
              <input
                disabled={!isEditing}
                id="user_profile"
                type="file"
                name="user_profile"
                className="form-control mb-0"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleImageUpload}
              />
              {userProfileError && (
                <span className="text-danger">{userProfileError}</span>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100px", maxHeight: "100px", display: "block" }}
                    className="mb-2"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={removeImage}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                disabled={!isEditing}
                id="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Phone Number */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                disabled={!isEditing}
                id="phoneNumber"
                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              )}
            </div>

            {/* Company Name */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label htmlFor="companyName" className="form-label">
                Company Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                id="companyName"
                className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
              />
              {errors.companyName && (
                <div className="invalid-feedback">{errors.companyName}</div>
              )}
            </div>

            {/* Gender */}
            <div className="col-xxl-6 col-xl-6 col-md-6 mb-3">
              <label className="form-label" htmlFor="Gender">
                Select Gender
              </label>
              <div className="dropdown">
                <button
                  className={`btnDropdown dropdown-toggle form-control ${errors.gender ? "is-invalid" : ""}`}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={!isEditing}
                >
                  {gender || "Select Gender"}
                </button>
                <ul className="dropdown-menu w-100">
                  <li className="dropdown-item c-pointer" onClick={() => setGender("Male")}>
                    Male
                  </li>
                  <li className="dropdown-item c-pointer" onClick={() => setGender("Female")}>
                    Female
                  </li>
                  <li className="dropdown-item c-pointer" onClick={() => setGender("Other")}>
                    Other
                  </li>
                </ul>
                {errors.gender && (
                  <div className="invalid-feedback d-block">{errors.gender}</div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full text-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsEditing(!isEditing);
                toggleDisabled();
              }}
            >
              {isEditing ? "Save" : "Edit Profile"}
            </button>
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
                <p>Your profile has been updated successfully!</p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSubmitSuccess(false)}
                  data-bs-dismiss="modal"
                >
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

export default Sponsor_Profile;
