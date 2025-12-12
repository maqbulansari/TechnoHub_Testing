import React from "react";
import { motion } from "framer-motion";

const posts = [
  { id: 1, title: "How to get started with Python", excerpt: "Beginner friendly guide to Python." },
  { id: 2, title: "Interview tips for freshers", excerpt: "Structure your preparation." },
  { id: 3, title: "AI trends 2025", excerpt: "Where AI is headed." },
];

export const ThursdayReads = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(p => (
          <motion.article key={p.id} initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
            <p className="text-gray-600 mt-2">{p.excerpt}</p>
            <a className="inline-block mt-4 text-blue-600 font-medium" href="#">Read more →</a>
          </motion.article>
        ))}
      </div>
    </div>
  );
};