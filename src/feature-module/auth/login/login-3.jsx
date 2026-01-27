import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { X, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { all_routes } from "@/feature-module/router/all_routes";

export default function LoginModal({ open, onClose, onForgot }) {
  const {
    LoginUser,
    loginError,
    setLoginError,
    userLoggedIN,
    responseSubrole,
    role,
    setLoginSuccess,
  } = useContext(AuthContext);

  const routes = all_routes;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError("");
  setEmailError("");
  setPasswordError("");

  let valid = true;

  if (!email) {
    setEmailError("Email is required");
    valid = false;
  } else if (!validateEmail(email)) {
    setEmailError("Enter a valid email");
    valid = false;
  }

  if (!password) {
    setPasswordError("Password is required");
    valid = false;
  }

  if (!valid) return;

  try {
    setLoading(true);

  
    const { subrole, role } = await LoginUser({ email, password });

    setLoginSuccess(true); 
    onClose(); 

 
    if (subrole === "SPONSOR") navigate("/Students_SponserDashboard");
    else if (subrole === "STUDENT") navigate("/Students_batches");
    else if (subrole === "TRAINER") navigate("/Trainer_batch");
    else if (subrole === "RECRUITER") navigate("/ReadyToRecruitDashboard");
    else if (subrole === "INTERVIEWEE") navigate("/Interviewee");
    else if (role === "ADMIN") navigate("/adminDashboard");
    else navigate("/");

  } catch (err) {
    console.log("Login failed");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
 
    if (!userLoggedIN) return;

    onClose();
 
    if (responseSubrole === "SPONSOR") navigate("/Students_SponserDashboard");
    else if (responseSubrole === "STUDENT") navigate("/Students_profile");
    else if (responseSubrole === "TRAINER") navigate("/Trainer_batch");
    else if (responseSubrole === "RECRUITER") navigate("/ReadyToRecruitDashboard");
    else if (responseSubrole === "INTERVIEWEE") navigate("/Interviewee");
    else if (role === "ADMIN") navigate("/adminDashboard");
    else navigate("/");
  }, [userLoggedIN]);



  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="relative w-full max-w-md rounded-lg bg-white  p-6">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-muted-foreground hover:text-black"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Sign in to continue
              </p>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setLoginError("");
                    }}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setLoginError("");
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                </div>

                {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-xl bg-primary text-white font-medium disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Login"}
                </motion.button>
              </form>

              {/* Links */}
              <div className="mt-4 flex justify-between text-sm">
                <button
                  type="button"
                  onClick={onForgot} // parent handles switching modals
                  className="text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </button>

                <Link
                  to={routes.register3}
                  onClick={onClose}
                  className="text-primary font-semibold"
                >
                  Create account
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
