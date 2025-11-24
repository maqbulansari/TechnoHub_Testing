// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../router/all_routes";
// import login from "../../../assets/images/login/login.png";
// import { AuthContext } from "../../../contexts/authContext";
// import axios from "axios";

// const ForgotPassword = () => {
//   const { API_BASE_URL } = useContext(AuthContext);
//   const routes = all_routes;
//   const [email, setEmail] = useState("");
//   const [allEmails, setAllEmails] = useState([]);

//   const [emailNotFoundError, setEmailNotFoundError] = useState("");

//   const GetAllUsers = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/User/`);
//       const data = response.data;
//       const emails = data.map((user) => user.email.toLowerCase());
//       setAllEmails(emails);
//     } catch (error) {
//       console.log("cannot get all users", error);
//     }
//   };

//   useEffect(() => {
//     GetAllUsers();
//   }, []);   

//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setEmailNotFoundError("Please enter a valid email address.");
//       return;
//     }

//     // Check if email exists in the database
//     if (!allEmails.includes(email.toLowerCase())) {
//       setEmailNotFoundError("Email address not found.");
//       return;
//     }

//     // If valid, clear any previous error
//     setEmailNotFoundError("");

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/forgot-password/`,
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (response.status === 200) {
//         alert("Reset Password link is sent to your email successfully");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <div className="row bgLoginScreen m-0">
//         <div className="col-xxl-8 col-xl-8 col-md-8">
//           <img src={login} alt="..." className="loginImg" />
//         </div>

//         <div className="col-xxl-4 col-xl-4 col-md-4 d-flex align-items-center">
//           <form onSubmit={handleResetPassword}>
//             <div className="card">
//               <div className="card-body">
//                 <h1 className="mt-5">Forgot Password?</h1>
//                 <p className="txt-gray mb-5">
//                   Enter your email to receive a password reset link
//                 </p>

//                 <div className="row mt-3">
//                   <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
//                     <label htmlFor="resetEmail" className="form-label">
//                       Email Address <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       placeholder="Enter Your Registered Email"
//                       id="resetEmail"
//                       type="email"
//                       required
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         setEmailNotFoundError("");
//                       }}
//                       className="mb-0"
//                     />
//                     {emailNotFoundError && (
//                       <div className="text-danger mt-1">
//                         {emailNotFoundError}
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
//                     <button type="submit" className="btn btn-primary w-100">
//                       Reset Password
//                     </button>
//                   </div>

//                   <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
//                     <div className="text-center">
//                       <h6 className="fw-normal text-dark mb-0">
//                         Remember your password?{" "}
//                         <Link to={routes.login} className="hover-a">
//                           Back to Login
//                         </Link>
//                       </h6>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPassword;


import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import login from "../../../assets/images/login/login.png";
import { AuthContext } from "../../../contexts/authContext";
import axios from "axios";

const ForgotPassword = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const routes = all_routes;
  const [email, setEmail] = useState("");
  const [allEmails, setAllEmails] = useState([]);

  const [emailNotFoundError, setEmailNotFoundError] = useState("");
  const [loading,setLoading]=useState(false)

  const GetAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/User/`);
      const data = response.data;
      const emails = data.map((user) => user.email.toLowerCase());
      setAllEmails(emails);
    } catch (error) {
      console.log("cannot get all users", error);
    }
  };

  useEffect(() => {
    GetAllUsers();
  }, []);   

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailNotFoundError("Please enter a valid email address.");
      setLoading(false)
      return;
    }

    // Check if email exists in the database
    if (!allEmails.includes(email.toLowerCase())) {
      setEmailNotFoundError("Email address not found.");
      setLoading(false)
      return;
    }

    // If valid, clear any previous error
    setEmailNotFoundError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Reset Password link is sent to your email successfully");
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div className="row bgLoginScreen m-0">
        <div className="col-xxl-8 col-xl-8 col-md-8">
          <img src={login} alt="..." className="loginImg" />
        </div>

        <div className="col-xxl-4 col-xl-4 col-md-4 d-flex align-items-center">
          <form onSubmit={handleResetPassword}>
            <div className="card">
              <div className="card-body">
                <h1 className="mt-5">Forgot Password?</h1>
                <p className="txt-gray mb-5">
                  Enter your email to receive a password reset link
                </p>

                <div className="row mt-3">
                  <div className="col-xxl-12 col-xl-12 col-md-12 mb-3">
                    <label htmlFor="resetEmail" className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      placeholder="Enter Your Registered Email"
                      id="resetEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailNotFoundError("");
                      }}
                      className="mb-0"
                    />
                    {emailNotFoundError && (
                      <div className="text-danger mt-1">
                        {emailNotFoundError}
                      </div>
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
    </>
  );
};

export default ForgotPassword;

