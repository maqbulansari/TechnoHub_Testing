import { motion } from "framer-motion";

const tech = [
  {
    name: "Python",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "React",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "AWS",
    img: "https://unpkg.com/simple-icons@v11/icons/amazonwebservices.svg",
  },
  {
    name: "SQL",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "Figma",
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
];

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const Technologies = () => (
  <motion.div
    className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-6"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
  >
    {tech.map(t => (
      <motion.div
        key={t.name}
        variants={item}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="bg-white rounded-xl py-10 text-center shadow flex flex-col items-center"
      >
        <motion.img
          src={t.img}
          alt={t.name}
          className="h-12 w-12 mb-4"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <span className="font-semibold text-sm text-text">
          {t.name}
        </span>
      </motion.div>
    ))}
  </motion.div>
);
