import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ title }) {
  return (
    <motion.h2 initial={{ y: 18, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
      {title}
    </motion.h2>
  );
}