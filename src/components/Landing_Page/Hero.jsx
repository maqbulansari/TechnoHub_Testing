import React from "react";
import { motion } from "framer-motion";
import HeroImg from "../../../public/HeroImg.jpg"; // put your hero image at public/hero.jpg

export default function Hero() {
  return (
    <section className="bg-[#eef2f7] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-10">
        {/* left */}
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="flex-1 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Unlock Your <br />
            <span className="text-blue-600">Potential.</span> <br />
            Join Our <span className="text-blue-600">Community.</span>
          </h1>

          <p className="mt-5 text-gray-600 text-lg">
            A collaborative space for learners, thinkers, and creators.
            Dive into cutting-edge technologies with expert trainers and a vibrant community.
          </p>

          <div className="flex gap-4 mt-8">
            <a href="#tech" className="px-6 py-3 rounded-full bg-blue-600 text-white shadow hover:scale-105 transition">Explore Courses</a>
            <a href="#centers" className="px-6 py-3 rounded-full bg-white text-gray-800 shadow hover:scale-105 transition">Our Centers</a>
          </div>
        </motion.div>

        {/* right */}
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9 }} className="flex-1 max-w-lg w-full">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D" alt="community" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}