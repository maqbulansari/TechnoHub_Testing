import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Info, X, Loader2, Check } from "lucide-react";
import { all_routes } from "../../router/all_routes";
import axios from "axios";
import { AuthContext } from "../../../contexts/authContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AUTH_BASE_URL } from "@/environment";

const Register3 = () => {
  const { userLoggedIN, accessToken, refreshToken, API_BASE_URL, RegisterUser, newSubrole, fetchNewSubrole } = useContext(AuthContext);
  const routes = all_routes;
  const navigate = useNavigate();

  // Compute isLoggedIn early so it can be used in useEffects
  const isLoggedIn = userLoggedIN && accessToken && refreshToken;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Initialize as empty - will be set by useEffect based on login status
  const [newSelectedRole, setNewSelectedRole] = useState("");
  const [selectedSubrole, setSelectedSubrole] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [idTypes, setIdType] = useState([]);
  const [identity, setIdentity] = useState("");
  const [selectedIdType, setSelectedIdType] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorSelectedRole, setErrorSelectedRole] = useState("");
  const [errorSelectedSubRole, setErrorSelectedSubsRole] = useState("");
  const [mobilenumberError, setMobileNumberError] = useState("");
  const [userProfileError, setUserProfileError] = useState("");
  const [idTypeError, setSelectedIdTypeError] = useState("");
  const [SelectedSubroleId, setSelectedSubroleId] = useState("");
  const [SelectedSubroleName, setSelectedSubroleName] = useState("");

  const [idNumberError, setIdNumberError] = useState("");
  const [emailExistsError, setEmailExistsError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isloading, setisloading] = useState(false);

  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobileNumber = (number) => /^[0-9]{10}$/.test(number);

  const fetchIdType = async () => {
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/idtypes/`);
      if (response.status === 200) setIdType(response.data);
    } catch (error) {
      console.error("Error fetching ID types:", error);
    }
  };

  const handleSelectRole = (role) => {
    setNewSelectedRole(role);
    setErrorSelectedRole("");
    setErrorSelectedSubsRole("");

    // Reset subrole first
    setSelectedSubroleId("");
    setSelectedSubroleName("");

    // Only auto-fill subrole when NOT logged in
    if (!isLoggedIn) {
      if (role === "LEARNER") {
        const learnerSubrole = newSubrole.find(
          (s) => s.name?.toUpperCase() === "INTERVIEWEE"
        );
        if (learnerSubrole) {
          setSelectedSubroleId(learnerSubrole.id.toString());
          setSelectedSubroleName(learnerSubrole.name);
        }
      } else if (role === "ENABLER") {
        const enablerSubrole = newSubrole.find(
          (s) =>
            !["INTERVIEWEE", "STUDENT", "GUEST LECTURER", "MENTOR", "APPLICANT"].includes(
              s.name?.toUpperCase()
            )
        );
        if (enablerSubrole) {
          setSelectedSubroleId(enablerSubrole.id.toString());
          setSelectedSubroleName(enablerSubrole.name);
        }
      }
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
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  useEffect(() => {
    fetchNewSubrole();
    fetchIdType();
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, []);

  // Set initial values based on login status
  useEffect(() => {
    if (!isLoggedIn) {
      // When NOT logged in, auto-select defaults
      setNewSelectedRole("LEARNER");
      setSelectedSubrole("INTERVIEWEE");
    } else {
      // When logged in, keep empty (no auto-selection)
      setNewSelectedRole("");
      setSelectedSubrole("");
      setSelectedSubroleId("");
      setSelectedSubroleName("");
    }
  }, [isLoggedIn]);

  // Handle subrole auto-selection when subroles are fetched (only when NOT logged in)
  useEffect(() => {
    if (!Array.isArray(newSubrole) || newSubrole.length === 0) return;

    // Only auto-select when NOT logged in
    if (isLoggedIn) return;

    if (newSelectedRole === "LEARNER") {
      const learnerSubrole = newSubrole.find(
        (s) => s.name?.toUpperCase() === "INTERVIEWEE"
      );
      if (learnerSubrole) {
        setSelectedSubroleId(learnerSubrole.id.toString());
        setSelectedSubroleName(learnerSubrole.name);
      }
    } else if (newSelectedRole === "ENABLER") {
      const enablerSubrole = newSubrole.find(
        (s) =>
          !["INTERVIEWEE", "STUDENT", "GUEST LECTURER", "MENTOR", "APPLICANT"].includes(
            s.name?.toUpperCase()
          )
      );
      if (enablerSubrole) {
        setSelectedSubroleId(enablerSubrole.id.toString());
        setSelectedSubroleName(enablerSubrole.name);
      }
    }
  }, [newSubrole, newSelectedRole, isLoggedIn]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    // Reset based on login status
    if (isLoggedIn) {
      setNewSelectedRole("");
      setSelectedSubrole("");
      setSelectedSubroleId("");
      setSelectedSubroleName("");
    } else {
      setNewSelectedRole("LEARNER");
      setSelectedSubrole("INTERVIEWEE");
      // Re-find and set the subrole ID for INTERVIEWEE
      const learnerSubrole = newSubrole.find(
        (s) => s.name?.toUpperCase() === "INTERVIEWEE"
      );
      if (learnerSubrole) {
        setSelectedSubroleId(learnerSubrole.id.toString());
        setSelectedSubroleName(learnerSubrole.name);
      }
    }
    setMobileNumber("");
    setProfileImage(null);
    setImagePreview("");
    setIdentity("");
    setSelectedIdType("");

    // Clear all errors
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
  };

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
    if (!firstName.trim()) { setErrorFirstName("First Name is Required"); isValid = false; }
    if (!lastName.trim()) { setErrorLastName("Last Name is Required"); isValid = false; }
    if (!email.trim()) { setErrorEmail("Email is Required"); isValid = false; }
    else if (!validateEmail(email)) { setErrorEmail("Invalid Email Format"); isValid = false; }
    if (!password) { setErrorPassword("Password is Required"); isValid = false; }
    else if (!validatePassword(password)) { setErrorPassword("Password must be 8+ chars with uppercase, lowercase, number & special char"); isValid = false; }

    // Role validation - only required when logged in (when selector is visible)
    if (isLoggedIn && !newSelectedRole) {
      setErrorSelectedRole("Select a Role");
      isValid = false;
    }

    // Subrole validation - only required when logged in
    if (isLoggedIn && !SelectedSubroleId) {
      setErrorSelectedSubsRole("Select a Subrole");
      isValid = false;
    }

    // For non-logged in users, use default LEARNER role
    const roleToUse = isLoggedIn ? newSelectedRole : "LEARNER";

    if (roleToUse === "LEARNER") {
      if (!mobileNumber) { setMobileNumberError("Mobile Number is Required"); isValid = false; }
      else if (!validateMobileNumber(mobileNumber)) { setMobileNumberError("Invalid Mobile Number"); isValid = false; }
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

      if (roleToUse === "LEARNER") {
        formData.append("role", "2");
        formData.append("id_type", selectedIdType);
        formData.append("identity", identity.trim());
        formData.append("subrole", SelectedSubroleId);
        if (profileImage) formData.append("user_profile", profileImage);
      } else if (roleToUse === "ENABLER") {
        formData.append("role", "3");
        formData.append("subrole", SelectedSubroleId);
      }

      const response = await RegisterUser(formData);
      if (response?.success) setSubmitSuccess(true), resetForm();
      else if (response?.error?.email) setEmailExistsError(response.error.email.join(", "));
    } catch (error) {
      if (error.response?.data?.email?.some((msg) => msg.toLowerCase().includes("already exists"))) {
        setEmailExistsError("This email is already registered.");
      }
      if (error.response?.data?.user_profile) {
        setUserProfileError(error.response.data.user_profile.join(", "));
      }
    } finally {
      setisloading(false);
    }
  };

  const filteredSubroles = newSelectedRole === "LEARNER"
    ? newSubrole.filter((s) => s.name?.toUpperCase() === "INTERVIEWEE")
    : newSelectedRole === "ENABLER"
      ? newSubrole.filter(
        (s) =>
          !["INTERVIEWEE", "STUDENT", "GUEST LECTURER", "MENTOR", "APPLICANT"].includes(
            s.name?.toUpperCase()
          )
      )
      : []; // Empty array when no role is selected

  // Use roleToUse for conditional rendering of LEARNER fields
  const currentRole = isLoggedIn ? newSelectedRole : "LEARNER";

  return (
    <div className="min-h-screen mt-2 sm:mt-12 py-4 sm:py-8 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[95%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"
      >
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 md:p-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Register
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
              Please enter your details to register
            </p>
          </div>

          <form onSubmit={onRegisterUser} className="space-y-3 sm:space-y-4">
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-sm">First Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrorFirstName(""); }}
                  className="mt-1"
                />
                {errorFirstName && <p className="text-xs text-red-500 mt-1">{errorFirstName}</p>}
              </div>
              <div>
                <Label className="text-sm">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrorLastName(""); }}
                  className="mt-1"
                />
                {errorLastName && <p className="text-xs text-red-500 mt-1">{errorLastName}</p>}
              </div>
            </div>

            {/* Row 2: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-sm">Email <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="Email"
                  className="mt-1 mb-0"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorEmail(""); setEmailExistsError(""); }}
                />
                {(errorEmail || emailExistsError) && (
                  <p className="text-xs text-red-500 mt-1">{errorEmail || emailExistsError}</p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Label className="text-sm">Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Info
                      size={14}
                      className="text-muted-foreground cursor-pointer"
                      onMouseEnter={() => setShowPasswordTooltip(true)}
                      onMouseLeave={() => setShowPasswordTooltip(false)}
                      onClick={() => setShowPasswordTooltip(!showPasswordTooltip)}
                    />
                    {showPasswordTooltip && (
                      <div className="absolute left-0 sm:left-5 top-6 sm:top-0 z-50 w-48 sm:w-56 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                        8+ chars with uppercase, lowercase, number & special character
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorPassword(""); }}
                    className="pr-9 mb-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errorPassword && <p className="text-xs text-red-500 mt-1">{errorPassword}</p>}
              </div>
            </div>

            {/* Row 3: Mobile & Role */}
            <div className={`grid gap-3 sm:gap-4 ${isLoggedIn ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <Label className="text-sm">Mobile Number <span className="text-red-500">*</span></Label>
                <Input
                  type="tel"
                  maxLength={10}
                  className="mt-1 !appearance-none"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setMobileNumber(value);
                    setMobileNumberError("");
                  }}
                />
                {mobilenumberError && <p className="text-xs text-red-500 mt-1">{mobilenumberError}</p>}
              </div>
              {isLoggedIn && (
                <div>
                  <Label className="text-sm">Role <span className="text-red-500">*</span></Label>
                  <Select value={newSelectedRole} onValueChange={handleSelectRole}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEARNER">LEARNER</SelectItem>
                      <SelectItem value="ENABLER">ENABLER</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorSelectedRole && <p className="text-xs text-red-500 mt-1">{errorSelectedRole}</p>}
                </div>
              )}
            </div>

            {/* Subrole - only show when logged in AND role is selected */}
            {isLoggedIn && newSelectedRole && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm">Subrole <span className="text-red-500">*</span></Label>
                  <Select
                    value={SelectedSubroleId}
                    onValueChange={(val) => {
                      const selected = filteredSubroles.find((s) => s.id.toString() === val);
                      setSelectedSubroleId(val);
                      setSelectedSubroleName(selected?.name || "");
                      setErrorSelectedSubsRole("");
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Subrole">
                        {SelectedSubroleName || null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubroles.length > 0 ? (
                        filteredSubroles.map((subrole) => (
                          <SelectItem key={subrole.id} value={subrole.id.toString()}>
                            {subrole.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-muted-foreground flex items-center gap-1">
                          <Loader2 size={12} className="animate-spin" /> Loading...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {errorSelectedSubRole && <p className="text-xs text-red-500 mt-1">{errorSelectedSubRole}</p>}
                </div>
              </div>
            )}

            {/* LEARNER Additional Fields - show when role is LEARNER or when not logged in (default LEARNER) */}
            {currentRole !== "ENABLER" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm">Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageUpload}
                    className="mt-1 w-full text-sm file:text-xs cursor-pointer"
                  />
                  {userProfileError && <p className="text-xs text-red-500 mt-1">{userProfileError}</p>}
                </div>
                <div>
                  <Label className="text-sm">ID Type</Label>
                  <Select
                    value={selectedIdType}
                    onValueChange={(val) => { setSelectedIdType(val); setSelectedIdTypeError(""); }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {idTypes.length > 0 ? (
                        idTypes.map((idtype) => (
                          <SelectItem key={idtype.id} value={idtype.id.toString()}>
                            {idtype.idTypeName}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-muted-foreground flex items-center gap-1">
                          <Loader2 size={12} className="animate-spin" /> Loading...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {idTypeError && <p className="text-xs text-red-500 mt-1">{idTypeError}</p>}
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label className="text-sm">Identity Number</Label>
                  <Input
                    placeholder="ID Number"
                    value={identity}
                    onChange={(e) => { setIdentity(e.target.value); setIdNumberError(""); }}
                    className="mt-1"
                  />
                  {idNumberError && <p className="text-xs text-red-500 mt-1">{idNumberError}</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 sm:pt-3 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isloading}
                className="w-1/2 h-10 sm:h-11 rounded-xl bg-primary text-white font-medium disabled:opacity-60 text-sm sm:text-base"
              >
                {isloading ? (
                  <span className="flex items-center justify-center gap-2">
                    Creating...
                  </span>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </div>
          </form>
        </div>
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
              <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-[280px] sm:max-w-xs shadow-xl text-center">
                <div className="mx-auto mb-3 w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="text-green-600 w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1">Success!</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4">User successfully created!</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="w-full py-2 rounded-lg bg-primary text-white font-medium text-sm sm:text-base"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register3;