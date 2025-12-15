import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const Footer = () => (
  <motion.footer
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="bg-[#263746] text-gray-300 py-20"
  >
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

      {/* Brand */}
      <motion.div variants={fadeUp}>
        <h4 className="font-semibold text-gray-300 mb-4">TechnoHub</h4>
        <p className="text-sm leading-relaxed">
          A global community dedicated to lifelong learning.
        </p>
      </motion.div>

      {/* Links */}
      <motion.div variants={fadeUp}>
        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          {["Courses", "About", "Contact"].map((link) => (
            <motion.li
              key={link}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="cursor-pointer"
            >
              {link}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Social */}
      <motion.div variants={fadeUp}>
        <h4 className="font-semibold text-white mb-4">Follow Us</h4>
        <div className="flex gap-4 text-sm">
          {["Twitter", "LinkedIn", "Instagram"].map((social) => (
            <motion.span
              key={social}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="cursor-pointer"
            >
              {social}
            </motion.span>
          ))}
        </div>
      </motion.div>

    </div>
  </motion.footer>
);
