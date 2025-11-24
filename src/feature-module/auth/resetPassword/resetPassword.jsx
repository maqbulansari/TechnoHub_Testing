import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import login from "../../../assets/images/login/login.png";
import { AuthContext } from "../../../contexts/authContext";
import axios from "axios";
import { Tooltip } from "primereact/tooltip";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log("token", token);
  const routes = all_routes;
  const { API_BASE_URL } = useContext(AuthContext);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    let isValid = true;
    if (!newPassword) {
      setErrorPassword("Password is Required");
      isValid = false;
    } else if (!validatePassword(newPassword)) {
      setErrorPassword(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      isValid = false;
    }
    if (!isValid){
      setLoading(false)
      return;
      }

    const payload = {
      "new_password": newPassword,
      "token": token,
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reset-password/`,
        payload
      );
      if (response.status === 200) {
        alert("Your password was successfully reset");
        setErrorPassword("");
        navigate(routes.login);
      }
    } catch (error) {
      console.log("password was not reset", error);
      setErrorPassword(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="row bgLoginScreen m-0">
      <div className="col-xxl-8 col-xl-8 col-md-8">
        <img src={login} alt="..." className="loginImg" />
      </div>
      <div className="col-xxl-4 col-xl-4 col-md-4 d-flex align-items-center">
        <form onSubmit={handleResetPassword}>
          <div className="card">
            <div className="card-body">
              <h1 className="mt-5">Reset Password?</h1>
              <p className="txt-gray mb-5">
                Please enter your new password below
              </p>
              <div className="row mt-3">
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password <span className="text-danger">*</span>
                    <Tooltip target=".custom-target-icon" />
                    <i
                      className="custom-target-icon pi pi-info-circle p-text-secondary ms-5"
                      data-pr-tooltip="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                      data-pr-position="right"
                      data-pr-at="right+5 top"
                      data-pr-my="left center-2"
                      style={{ fontSize: "1rem", cursor: "pointer" }}
                    ></i>
                  </label>
                  <div className="pass-group">
                    <input
                      id="newPassword"
                      placeholder="Enter Your New Password"
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={() => togglePasswordVisibility("newPassword")}
                    />
                  </div>
                  {errorPassword && (
                    <div className="text-danger mt-2">{errorPassword}</div>
                  )}
                </div>
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                  {/* <button type="submit" className="btn btn-primary w-100">
                    Reset Password
                  </button> */}
                   <button type="submit"
                     className="btn btn-primary w-100" >
                      {loading ? (
                         <>
                           <i className="fas fa-spinner fa-spin me-2"></i> 
                         </>
                        ) : (
                         <>
                           Reset Password
                         </>
                        )}
                      </button>
                </div>
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

export default ResetPassword;
