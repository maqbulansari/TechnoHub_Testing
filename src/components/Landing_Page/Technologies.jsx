import React from "react";
import pythonImg from "../../../public/user.jpg";
import javaImg from "../../../public/user.jpg";
import mernImg from "../../../public/user.jpg";
import aiImg from "../../../public/user.jpg";
import { motion } from "framer-motion";

const techData = [
  { name: "Python", img: pythonImg, batches: 4, students: 69, desc: "A versatile language for web, data & AI." },
  { name: "Java", img: javaImg, batches: 1, students: 9, desc: "Enterprise-grade, portable, stable." },
  { name: "MERN", img: mernImg, batches: 2, students: 30, desc: "Full-stack JavaScript stack." },
  { name: "AI/ML", img: aiImg, batches: 1, students: 15, desc: "Predictive analytics & CV/NLP." },
];

export const Technologies = () => {
  return (
    <div className="w-full overflow-x-auto py-6 scrollbar-x">
      <div className="flex gap-6 px-4 md:px-6">
        {techData.map((t) => (
          <motion.div key={t.name} initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.45 }} className="min-w-[300px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="h-40 bg-gray-50 flex items-center justify-center">
              <img src={t.img} alt={t.name} className="h-full object-contain p-4" />
            </div>
            <div className="p-5">
              <h4 className="text-lg font-semibold text-gray-800">{t.name}</h4>
              <p className="text-gray-600 text-sm mt-2 mb-4">{t.desc}</p>
              <div className="flex gap-4 text-sm">
                <div className="flex-1 text-gray-700"><span className="font-semibold">Batches:</span> <span className="text-blue-600 font-bold">{t.batches}</span></div>
                <div className="flex-1 text-gray-700"><span className="font-semibold">Students:</span> <span className="text-blue-600 font-bold">{t.students}</span></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};