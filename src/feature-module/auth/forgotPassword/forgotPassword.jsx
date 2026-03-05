import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { LIMITS, PATTERNS, MESSAGES } from "@/utils/validation";

export default function ForgotPasswordModal({ open, onClose, onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => PATTERNS.EMAIL.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");

    let valid = true;

    if (!email) {
      setEmailError(MESSAGES.REQUIRED("Email"));
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError(MESSAGES.INVALID_EMAIL);
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    // Call forgot password API here
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

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
            <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl p-6">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-muted-foreground hover:text-black"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-center">Forgot Password?</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter your email to receive reset instructions
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Email"
                    value={email}
                    maxLength={LIMITS.EMAIL}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="w-full h-10 rounded-md bg-primary text-white font-medium disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </form>

              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={onBackToLogin} // parent handles going back to login
                  className="text-primary font-semibold"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
