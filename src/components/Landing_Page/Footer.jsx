import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const Footer = () => {
  const navigate = useNavigate();
  const [openCenters, setOpenCenters] = useState(false);

  return (
    <>
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

              <motion.li
                whileHover={{ x: 4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="cursor-pointer"
                onClick={() => navigate("/Courses")}
              >
                Courses
              </motion.li>

              <motion.li
                whileHover={{ x: 4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="cursor-pointer"
                onClick={() => setOpenCenters(true)}
              >
                Our Centers
              </motion.li>

              {/* <motion.li
                whileHover={{ x: 4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="cursor-pointer"
                onClick={() => navigate("/contact")}
              >
                Contact
              </motion.li> */}

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
        <div className="mt-6 border-t border-gray-700 pt-6 mb-0 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} TechnoHub. All rights reserved.

          <Link
            to="/terms"
            className="text-white mx-2 border-b"
          >
            Terms & Conditions
          </Link>
        </div>
      </motion.footer>

      {/* Centers Dialog */}
     <Dialog open={openCenters} onOpenChange={setOpenCenters}>
  <DialogContent
    className="mt-10 flex h-[75vh] max-h-[75vh] w-[90%] flex-col overflow-hidden rounded-3xl bg-white p-0 sm:w-[85%] md:w-[65%] lg:w-[45%] [&>button]:hidden"
  >
    {/* Header */}
    <DialogHeader className="border-b px-6 pb-2 pt-6 text-center">
      <DialogTitle className="text-center text-xl font-bold sm:text-2xl">
        Our Training Centers
      </DialogTitle>
      <DialogDescription className="m-0 mx-auto max-w-sm text-sm text-muted-foreground">
        Choose the nearest center and start learning with us.
      </DialogDescription>
    </DialogHeader>

    {/* Scrollable Content */}
    <div className="no-scrollbar overflow-y-auto px-5 py-5">
      <div className="space-y-4">
        {[
          {
            name: "AllSaints",
            address: "Airport Road, Bhopal",
            phone: "+91 98765 43210",
          },
          {
            name: "LGS",
            address: "VIP Road, Bhopal",
            phone: "+91 98765 43211",
          },
          {
            name: "Mecaps",
            address: "Near Moti Masjid, Bhopal",
            phone: "+91 98765 43212",
          },
        ].map((center, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Left Side: Icon + Center Details */}
            <div className="flex items-start gap-3">
              {/* Added shrink-0 and changed mt-1 to mt-0.5 for better icon alignment */}
              <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text sm:text-base">
                  {center.name}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {center.address}
                </span>
              </div>
            </div>

            {/* Right Side: Phone Number */}
            <div className="flex sm:justify-end">
              <span className="text-sm text-muted-foreground sm:text-base sm:text-right">
                {center.phone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="border-t bg-muted/30 px-6 py-4">
      <Button
        className="w-full rounded-full py-2.5 text-base"
        onClick={() => setOpenCenters(false)}
      >
        Close
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </>
  );
};