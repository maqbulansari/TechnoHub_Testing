import { useContext, useState } from "react";
import login from "../../../assets/images/login/login.png";
import { all_routes } from "../../router/all_routes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/authContext";
import { Tooltip } from "primereact/tooltip";

export const ChangePassword = () => {
  const { API_BASE_URL, LogoutUser } = useContext(AuthContext);
  let accessToken = localStorage.getItem("accessToken");
  const routes = all_routes;
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false)


  // State for password visibility
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // State for form values
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for success alert

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Password strength validation
  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Validate old password
    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
      isValid = false;
    }

    // Validate new password (with strength requirements)
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = "Password must contain at least 8 characters including uppercase, lowercase, number, and special character";
      isValid = false;
    } else if (newPassword === oldPassword) {
      newErrors.newPassword = "New password must be different from old password";
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    



    // Validate form
    if (!validateForm()) {
      setLoading(true) 
          return;
    }
    const payload = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/change-password/`,
        payload,
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        }
      );
      
      if (response.status === 200) {
        alert('Password is changed successfully');
        LogoutUser();
        navigate(`${routes.login3}`)

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 400) {
          if (error.response.data.old_password) {
            setErrors(prev => ({
              ...prev, 
              oldPassword: error.response.data.old_password[0]
            }));
          } else if (error.response.data.new_password) {
            setErrors(prev => ({
              ...prev, 
              newPassword: error.response.data.new_password[0]
            }));
          }
        }
      }
    } finally{
      setLoading(false)
    }
  };

  // Clear specific error when field is modified
  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="row bgLoginScreen m-0">
      <div className="col-xxl-8 col-xl-8 col-md-8">
        <img src={login} alt="..." className="loginImg" />
      </div>
      <div className="col-xxl-4 col-xl-4 col-md-4 d-flex align-items-center">
        <form onSubmit={handleChangePassword}>
          <div className="card">
            <div className="card-body">
              <h1 className="mt-5">Change Password?</h1>
              <p className="txt-gray mb-5">
                Please enter your new password below
              </p>
              

              <div className="row mt-3">
                {/* Old Password */}
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  <label htmlFor="oldPassword" className="form-label">
                    Old Password <span className="text-danger">*</span>
                  </label>
                  <div className="pass-group relative">
                    <input
                      id="oldPassword"
                      placeholder="Enter Your Old Password"
                      type={
                        passwordVisibility.oldPassword ? "text" : "password"
                      }
                      className={`pass-input ${errors.oldPassword ? "is-invalid" : ""}`}
                      required
                      value={oldPassword}
                      onChange={(e) => 
                        handleFieldChange("oldPassword", e.target.value, setOldPassword)
                      }
                    />
                    <span
                      className={`absolute top-0 right-0 pr-2 pt-2 ${
                        passwordVisibility.oldPassword ? "ti toggle-password ti-eye" : "ti toggle-password ti-eye-off"
                      }`}
                      onClick={() => togglePasswordVisibility("oldPassword")}
                    />
                  </div>
                  {errors.oldPassword && (
                    <div className="text-danger mt-1">
                      {errors.oldPassword}
                    </div>
                  )}
                </div>

                {/* New Password with Tooltip */}
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password <span className="text-danger">*</span>
                    <Tooltip target=".password-tooltip" />
                    <i
                      className="password-tooltip pi pi-info-circle p-text-secondary ms-2"
                      data-pr-tooltip="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                      data-pr-position="right"
                      data-pr-at="right+5 top"
                      data-pr-my="left center-2"
                      style={{ fontSize: "1rem", cursor: "pointer" }}
                    ></i>
                  </label>
                  <div className="pass-group relative">
                    <input
                      id="newPassword"
                      placeholder="Enter Your New Password"
                      type={
                        passwordVisibility.newPassword ? "text" : "password"
                      }
                      className={`pass-input ${errors.newPassword ? "is-invalid" : ""}`}
                      required
                      value={newPassword}
                      onChange={(e) => 
                        handleFieldChange("newPassword", e.target.value, setNewPassword)
                      }
                    />
                    <span
                      className={`absolute top-0 right-0 pr-2 pt-2 ${
                        passwordVisibility.newPassword ? "ti toggle-password ti-eye" : "ti toggle-password ti-eye-off"
                      }`}
                      onClick={() => togglePasswordVisibility("newPassword")}
                    />
                  </div>
                  {errors.newPassword && (
                    <div className="text-danger mt-1">
                      {errors.newPassword}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="pass-group relative">
                    <input
                      id="confirmPassword"
                      placeholder="Confirm Your New Password"
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"
                      }
                      className={`pass-input ${errors.confirmPassword ? "is-invalid" : ""}`}
                      required
                      value={confirmPassword}
                      onChange={(e) => 
                        handleFieldChange("confirmPassword", e.target.value, setConfirmPassword)
                      }
                    />
                    <span
                      className={`absolute top-0 right-0 pr-2 pt-2 ${
                        passwordVisibility.confirmPassword
                          ? "ti toggle-password ti-eye"
                          : "ti toggle-password ti-eye-off"
                      }`}
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger mt-1">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  {/* <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                  >
                    Change Password
                  </button> */}
                   <button type="submit"
                     className="btn btn-primary w-100" >
                      {loading ? (
                         <>
                           <i className="fas fa-spinner fa-spin me-2"></i> 
                         </>
                        ) : (
                         <>
                           Change Password
                         </>
                        )}
                      </button>
                </div>

                {/* Back to Login */}
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  <div className="text-center">
                    <h6 className="fw-normal text-dark mb-0">
                      Remember your password?{" "}
                      <Link to={routes.login} className="hover-a">
                        Back to Login
                      </Link>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};