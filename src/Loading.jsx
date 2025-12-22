// src/components/LoadingScreen.jsx
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white text-slate-900">
      <div className="flex flex-col items-center gap-3">
        {/* Icon */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-600/30 bg-blue-50 text-blue-600 shadow-sm"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          <motion.span
            className="text-md font-semibold"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
          >
            &lt;/&gt;
          </motion.span>
        </motion.div>

        {/* Text */}
        <div className="text-center">
          <p className="text-md font-medium text-slate-800">
          Loading...
          </p>
        </div>

        {/* Progress bar */}
        {/* <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "70%", "100%"] }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          />
        </div> */}
      </div>
    </div>
  );
}