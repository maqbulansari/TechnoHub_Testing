import { motion } from "framer-motion";

export default function AnimatedButton({
  children,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
