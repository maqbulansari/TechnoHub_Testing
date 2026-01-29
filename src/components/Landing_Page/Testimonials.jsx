import { motion } from "framer-motion";

const team = [
  {
    name: "Arsalan Ahmed",
    role: "MERN Stack Trainer",
    description: "Expert in building scalable full-stack applications using MERN.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "Farha Alam",
    role: "Python Full Stack & Data Analytics Trainer",
    description: "Specialist in Python, data analysis, and backend systems.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "Imad Baig",
    role: "Frontend Developer & Trainer",
    description: "Focused on modern UI, UX, and frontend performance.",
    image:
        "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "Maisara Waseem",
    role: "Data Science & AI Trainer",
    description: "Passionate about AI models and data-driven solutions.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "Mohammad Ibrahim",
    role: "AI & ML Trainer",
    description: "Experienced in machine learning and real-world AI use cases.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "MD Musa Alam",
    role: "Java Full Stack Trainer",
    description: "Strong background in Java, Spring Boot, and APIs.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "Subhana Maroof",
    role: "Python & Full Stack Trainer",
    description: "Hands-on experience in full-stack Python development.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
  {
    name: "Toseef Ali",
    role: "Backend Developer & Co-Trainer",
    description: "Backend expert with focus on databases and APIs.",
    image:
      "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
  },
];

export const Testimonials = () => {
  return (
    <section className="w-full overflow-hidden py-14">
      <motion.div
        className="flex gap-6 w-max px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 45, 
        }}
      >
        {[...team, ...team].map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            className="w-[260px] flex-shrink-0 bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto  rounded-full object-cover mb-4"
            />

            <h3 className="text-sm font-semibold text-gray-900">
              {member.name}
            </h3>

            <p className="text-primary text-xs font-medium mt-1">
              {member.role}
            </p>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-2">
              {member.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
