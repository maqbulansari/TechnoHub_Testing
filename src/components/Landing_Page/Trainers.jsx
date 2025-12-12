import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import placeholder from "../../../public/user.jpg";
// import { AuthContext } from "../../../contexts/authContext";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";

export const Trainers = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch trainers (keeps your API usage)
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/trainers/`);
        if (mounted && res.status === 200) setTrainers(res.data);
      } catch (err) {
        console.warn("Trainers fetch failed, using empty array", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [API_BASE_URL]);

  const demo = [
    { id: "d1", first_name: "Aisha", last_name: "Khan", job_title: "Sr. JS Trainer", technologies: ["React"], required_skills: "React, Node", experience: 4, qualification: "MCA", user_profile: placeholder },
    { id: "d2", first_name: "Rohit", last_name: "Sharma", job_title: "AI Trainer", technologies: ["Python", "ML"], required_skills: "Python, TensorFlow", experience: 5, qualification: "M.Tech", user_profile: placeholder },
  ];

  const list = trainers && trainers.length ? trainers : demo;

  if (loading) return <div className="py-8 text-center text-gray-600">Loading trainers...</div>;

  return (
    <div className="w-full overflow-x-auto py-6 scrollbar-x">
      <div className="flex gap-6 px-4 md:px-6">
        {list.map((tr) => (
          <motion.div key={tr.id || tr.first_name} whileHover={{ scale: 1.03 }} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="min-w-[300px] rounded-2xl shadow-lg bg-white border border-gray-100 overflow-hidden">
            <div className="h-44 w-full bg-gray-50 flex items-center justify-center">
              <img src={tr.user_profile || placeholder} alt={`${tr.first_name} ${tr.last_name}`} onError={(e) => e.target.src = placeholder} className="h-full w-full object-cover"/>
            </div>
            <div className="p-5 capitalize">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{tr.first_name} {tr.last_name}</h4>
              <div className="text-blue-600 font-medium mb-2">{tr.job_title || "Trainer"}</div>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Technology:</span> {tr.technologies?.join(", ") || "N/A"}</p>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Skills:</span> {tr.required_skills || "N/A"}</p>
              <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Experience:</span> {tr.experience ? `${tr.experience} years` : "N/A"}</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Qualification:</span> {tr.qualification || "N/A"}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};