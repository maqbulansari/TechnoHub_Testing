import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // if you're using react-router
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
    className="bg-[#263746] text-gray-300 py-20 pb-4"
  >
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

      {/* Brand */}
      <motion.div variants={fadeUp}>
        <h4 className="font-semibold text-gray-300 mb-4">TechnoHub</h4>
        <p className="text-sm leading-relaxed">
          A global community using technology to educate, empower, and uplift Muslims
  with ethics, intelligence, and purpose.
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

    {/* Footer Bottom */}
    <div className="mt-6 border-t  border-gray-700 pt-6 mb-0 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} TechnoHub. All rights reserved.

      <Link
        to="/terms"
        className="text-white mx-2 border-b"
      >
        Terms & Conditions
      </Link>


    </div>
  </motion.footer>
);
