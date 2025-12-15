import { motion } from "framer-motion";

const trainers = [
  {
    name: "Dr. Evelyn Reed",
    role: "AI & Machine Learning",
    desc: "12+ years of experience in data science.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus Chen",
    role: "Full-Stack Development",
    desc: "Expert in modern web frameworks.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Isabelle Rossi",
    role: "UX/UI Design",
    desc: "Award-winning designer.",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Leo Kim",
    role: "Cybersecurity",
    desc: "Certified ethical hacker.",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

export const Trainers = () => (
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-4
      gap-6
      max-w-7xl
      mx-auto
      px-4 sm:px-6
    "
  >
    {trainers.map((t) => (
      <motion.div
        key={t.name}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="
          bg-white
          rounded-xl
          shadow-md
          pt-4
          pb-10
          px-5
          text-center
          w-full
          max-w-[240px]
          mx-auto
        "
      >
        {/* Avatar */}
        <img
          src={t.img}
          alt={t.name}
          className="w-16 h-16 mx-auto rounded-full mb-4 object-cover"
        />

        {/* Name */}
        <h4 className="text-sm font-semibold text-dark leading-tight">
          {t.name}
        </h4>

        {/* Role */}
        <p className="text-primary text-xs font-medium mt-1">
          {t.role}
        </p>

        {/* Description */}
        <p className="mt-4 text-xs text-gray-600 leading-relaxed">
          {t.desc}
        </p>
      </motion.div>
    ))}
  </div>
);
