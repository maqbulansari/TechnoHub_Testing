import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const Gallery = () => (
  <motion.div
  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-6"

    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
  >
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        variants={item}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="rounded-sm overflow-hidden shadow bg-white"
      >
        <motion.img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
         className="w-full h-36 sm:h-44 md:h-56 object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    ))}
  </motion.div>
);
