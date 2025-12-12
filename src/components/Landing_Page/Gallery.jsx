import React from "react";
import { motion } from "framer-motion";
import g1 from "../../../public/user.jpg";
import g2 from "../../../public/user.jpg";
import g3 from "../../../public/user.jpg";

const images = [g1, g2, g3, g1, g2];

export const Gallery = () => {
  return (
    <div className="w-full overflow-x-auto py-8 scrollbar-x">
      <div className="flex gap-6 px-4 md:px-6">
        {images.map((src, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.45 }} className="min-w-[260px] h-40 rounded-xl overflow-hidden shadow-md bg-gray-100">
            <img src={src} alt={`gallery-${i}`} className="w-full h-full object-cover"/>
          </motion.div>
        ))}
      </div>
    </div>
  );
};