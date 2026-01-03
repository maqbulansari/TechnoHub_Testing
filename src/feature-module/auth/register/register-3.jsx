import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Info, X, ChevronDown, Loader2, Check } from "lucide-react";
import { all_routes } from "../../router/all_routes";
import axios from "axios";
import { AuthContext } from "../../../contexts/authContext";

const Register3 = () => {
  const { userLoggedIN, accessToken, refreshToken, API_BASE_URL } = useContext(AuthContext);
  const routes = all_routes;
  const navigate = useNavigate();

  const {
    RegisterUser,
    newSubrole,
    fetchNewSubrole,
    loading,
    emailAlreadyCreated,
  } = useContext(AuthContext);

  // STATE MANAGEMENT
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newSelectedRole, setNewSelectedRole] = useState("LEARNER");
  const [selectedSubrole, setSelectedSubrole] = useState("INTERVIEWEE");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [idTypes, setIdType] = useState([]);
  const [identity, setIdentity] = useState("");
  const [selectedIdType, setSelectedIdType] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  // Dropdown states
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [subroleDropdownOpen, setSubroleDropdownOpen] = useState(false);
  const [idTypeDropdownOpen, setIdTypeDropdownOpen] = useState(false);

  // Error states
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorSelectedRole, setErrorSelectedRole] = useState("");
  const [errorSelectedSubRole, setErrorSelectedSubsRole] = useState("");
  const [mobilenumberError, setMobileNumberError] = useState("");
  const [userProfileError, setUserProfileError] = useState("");
  const [idTypeError, setSelectedIdTypeError] = useState("");
  const [selectedIdTypeName, setselectedIdTypeName] = useState("");
  const [SelectedSubroleId, setSelectedSubroleId] = useState("7");
  const [idNumberError, setIdNumberError] = useState("");
  const [emailExistsError, setEmailExistsError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isloading, setisloading] = useState(false);

  const ID_TYPE_MAPPING = {
    'PASSPORT': 2,
    'VOTER_ID': 3,
    'ADHAARCARD': 1
  };

  // Validation functions
  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const handleSelectRole = (role) => {
    setNewSelectedRole(role);
    setErrorSelectedRole("");
    setErrorSelectedSubsRole("");
    setRoleDropdownOpen(false);
    if (role === "LEARNER") {
      setSelectedSubrole("INTERVIEWEE");
      setSelectedSubroleId(2);
      setErrorSelectedSubsRole("");
    } else {
      setSelectedSubrole("Choose Your Subrole");
    }
  };

  const fetchIdType = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/idtypes/`);
      if (response.status === 200) {
        setIdType(response.data);
      }
    } catch (error) {
      console.error("Error fetching ID types:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
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
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  useEffect(() => {
    fetchNewSubrole();
    fetchIdType();

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const onRegisterUser = async (e) => {
    e.preventDefault();

    setErrorFirstName("");
    setErrorLastName("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorSelectedRole("");
    setErrorSelectedSubsRole("");
    setMobileNumberError("");
    setUserProfileError("");
    setSelectedIdTypeError("");
    setIdNumberError("");
    setEmailExistsError("");

    let isValid = true;

    if (!firstName.trim()) {
      setErrorFirstName("First Name is Required");
      isValid = false;
    }
    if (!lastName.trim()) {
      setErrorLastName("Last Name is Required");
      isValid = false;
    }
    if (!email.trim()) {
      setErrorEmail("Email is Required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setErrorEmail("Invalid Email Format");
      isValid = false;
    }
    if (!password) {
      setErrorPassword("Password is Required");
      isValid = false;
    } else if (!validatePassword(password)) {
      setErrorPassword(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      isValid = false;
    }
    if (!newSelectedRole) {
      setErrorSelectedRole("Select a Role");
      isValid = false;
    }
    if (newSelectedRole === "LEARNER") {
      if (!mobileNumber) {
        setMobileNumberError("Mobile Number is Required");
        isValid = false;
      } else if (!validateMobileNumber(mobileNumber)) {
        setMobileNumberError("Invalid Mobile Number");
        isValid = false;
      }
    }

    if (!isValid) return;

    try {
      setisloading(true);

      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("mobile_no", mobileNumber);

      if (newSelectedRole === "LEARNER") {
        formData.append("role", "2");
        formData.append("id_type", selectedIdType);
        formData.append("identity", identity.trim());
        formData.append("subrole", SelectedSubroleId);
        if (profileImage) formData.append("user_profile", profileImage);
      } else if (newSelectedRole === "ENABLER") {
        formData.append("role", "3");
        formData.append("subrole", SelectedSubroleId);
      }

      const response = await RegisterUser(formData);

      if (response && response.success) {
        setSubmitSuccess(true);
      } else if (response && response.error?.email) {
        setEmailExistsError(response.error.email.join(", "));
      }
    } catch (error) {
      if (
        error.response?.data?.email &&
        error.response.data.email.some((msg) =>
          msg.toLowerCase().includes("already exists")
        )
      ) {
        setEmailExistsError(
          "This email is already registered. Please use a different email."
        );
      }

      if (error.response?.data?.user_profile) {
        setUserProfileError(error.response.data.user_profile.join(", "));
      }
    } finally {
      setisloading(false);
    }
  };

  const filteredSubroles =
    newSelectedRole === "LEARNER"
      ? newSubrole.filter((s) =>
          ["INTERVIEWEE"].includes(s.name?.toUpperCase())
        )
      : newSubrole.filter(
          (s) => !["INTERVIEWEE", "STUDENT", "GUEST LECTURER", "MENTOR", "APPLICANT"].includes(s.name?.toUpperCase())
        );

  return (
    <div className="min-h-screen mt-10 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 uppercase">Register</h2>
          <p className="text-muted-foreground mt-2">
            Please enter your details to register
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onRegisterUser} className="space-y-6">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter Your First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrorFirstName("");
                }}
              
              />
              {errorFirstName && (
                <p className="text-xs text-red-500 mt-1">{errorFirstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter Your Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrorLastName("");
                }}
               
              />
              {errorLastName && (
                <p className="text-xs text-red-500 mt-1">{errorLastName}</p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorEmail("");
                  setEmailExistsError("");
                }}
              
              />
              {errorEmail && (
                <p className="text-xs text-red-500 mt-1">{errorEmail}</p>
              )}
              {emailExistsError && (
                <p className="text-xs text-red-500 mt-1">{emailExistsError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                Password <span className="text-red-500">*</span>
                <div className="relative">
                  <Info
                    size={16}
                    className="text-muted-foreground cursor-pointer"
                    onMouseEnter={() => setShowPasswordTooltip(true)}
                    onMouseLeave={() => setShowPasswordTooltip(false)}
                  />
                  <AnimatePresence>
                    {showPasswordTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg"
                      >
                        Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorPassword("");
                  }}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errorPassword && (
                <p className="text-xs text-red-500 mt-1">{errorPassword}</p>
              )}
            </div>
          </div>

          {/* Row 3: Mobile Number & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter Your Number"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  setMobileNumberError("");
                }}
               
              />
              {mobilenumberError && (
                <p className="text-xs text-red-500 mt-1">{mobilenumberError}</p>
              )}
            </div>

            {(userLoggedIN && accessToken && refreshToken) && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="w-full h-11 px-3 rounded-md border border-input bg-background flex items-center justify-between text-sm"
                  >
                    {newSelectedRole || "Select Role"}
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </button>
                  <AnimatePresence>
                    {roleDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-1 bg-white border border-input rounded-md shadow-lg overflow-hidden"
                      >
                        <li
                          onClick={() => handleSelectRole("LEARNER")}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          LEARNER
                        </li>
                        <li
                          onClick={() => handleSelectRole("ENABLER")}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          ENABLER
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                {errorSelectedRole && (
                  <p className="text-xs text-red-500 mt-1">{errorSelectedRole}</p>
                )}
              </div>
            )}
          </div>

          {/* Subrole - Only show when logged in */}
          {(userLoggedIN && accessToken && refreshToken) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Subrole <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSubroleDropdownOpen(!subroleDropdownOpen)}
                    className="w-full h-11 px-3 rounded-md border border-input bg-background flex items-center justify-between text-sm"
                  >
                    {selectedSubrole}
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </button>
                  <AnimatePresence>
                    {subroleDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-1 bg-white border border-input rounded-md shadow-lg max-h-48 overflow-y-auto"
                      >
                        {filteredSubroles.length > 0 ? (
                          filteredSubroles.map((subrole) => (
                            <li
                              key={subrole.id}
                              onClick={() => {
                                setSelectedSubrole(subrole.name);
                                setSelectedSubroleId(subrole.id);
                                setErrorSelectedSubsRole("");
                                setSubroleDropdownOpen(false);
                              }}
                              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              {subrole.name}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Loading...
                          </li>
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
                {errorSelectedSubRole && (
                  <p className="text-xs text-red-500 mt-1">{errorSelectedSubRole}</p>
                )}
              </div>
            </div>
          )}

          {/* Additional fields for LEARNER role */}
          {newSelectedRole !== "ENABLER" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    User Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleImageUpload}
                      className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-white cursor-pointer"
                    />
                  </div>
                  {userProfileError && (
                    <p className="text-xs text-red-500 mt-1">{userProfileError}</p>
                  )}
                  {imagePreview && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <X size={14} /> Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* ID Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ID Type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIdTypeDropdownOpen(!idTypeDropdownOpen)}
                      className="w-full h-11 px-3 rounded-md border border-input bg-background flex items-center justify-between text-sm"
                    >
                      {selectedIdTypeName || "Select Your ID Type"}
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {idTypeDropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-20 w-full mt-1 bg-white border border-input rounded-md shadow-lg max-h-48 overflow-y-auto"
                        >
                          {idTypes.length > 0 ? (
                            idTypes.map((idtype) => (
                              <li
                                key={idtype.id}
                                onClick={() => {
                                  setselectedIdTypeName(idtype.idTypeName);
                                  setSelectedIdType(idtype.id);
                                  setSelectedIdTypeError("");
                                  setIdTypeDropdownOpen(false);
                                }}
                                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              >
                                {idtype.idTypeName}
                              </li>
                            ))
                          ) : (
                            <li className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                              <Loader2 size={14} className="animate-spin" />
                              Loading...
                            </li>
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                  {idTypeError && (
                    <p className="text-xs text-red-500 mt-1">{idTypeError}</p>
                  )}
                </div>

                {/* Identity Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Identity Number
                  </label>
                  <Input
                    placeholder="Enter Your ID Number"
                    value={identity}
                    onChange={(e) => {
                      setIdentity(e.target.value);
                      setIdNumberError("");
                    }}
                  
                  />
                  {idNumberError && (
                    <p className="text-xs text-red-500 mt-1">{idNumberError}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isloading}
              className="w-full max-w-md h-12 rounded-xl bg-primary text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </div>
        
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {submitSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setSubmitSuccess(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Success!</h3>
                  <p className="text-muted-foreground mb-6">
                    User successfully created!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSubmitSuccess(false)}
                    className="w-full h-10 rounded-xl bg-primary text-white font-medium"
                  >
                    OK
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register3;