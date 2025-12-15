import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Section({ children, gray = false }) {
  return (
    <section className={gray ? "bg-light" : "bg-white"}>
      <motion.div
        className="py-8 sm:py-20 lg:py-24"
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
