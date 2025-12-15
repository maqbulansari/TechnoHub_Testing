import { motion } from "framer-motion";

const centers = [
  { name: "AllSaints", batches: 5, students: 45 },
  { name: "LGS", batches: 3, students: 28 },
  { name: "Mecaps", batches: 6, students: 62 },
];

export const Centers = () => (
  <div className="flex justify-center gap-8">
    {centers.map(c => (
      <motion.div
        key={c.name}
        whileHover={{ y: -6 }}
        className="bg-white w-[260px] rounded-2xl shadow-lg p-8 text-center"
      >
        <h4 className="font-semibold mb-6">{c.name}</h4>
        <div className="text-sm text-muted">
          <p><b>{c.batches}</b> Batches</p>
          <p><b>{c.students}</b> Students</p>
        </div>
      </motion.div>
    ))}
  </div>
);
