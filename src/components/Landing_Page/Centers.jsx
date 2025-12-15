import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";

const centers = [
  { name: "AllSaints", batches: 5, students: 45, Location: "https://maps.app.goo.gl/y9jkoEG8aN9pgxKM8", },
  { name: "LGS", batches: 3, students: 28, Location: "https://maps.app.goo.gl/Gmg7JnMpvTRg1ZQi6" },
  { name: "Mecaps", batches: 6, students: 62, Location: "https://maps.app.goo.gl/9BxCqBefij6KurLN9" },
];

export const Centers = () => (
  <div className="flex justify-center gap-8">
    {centers.map(c => (
      <motion.div
        key={c.name}
        whileHover={{ y: -6 }}
        className="bg-white w-[260px] rounded-2xl shadow-lg p-8 text-center text-2xl"
      >
        <h4 className="font-semibold mb-6">{c.name}</h4>
        <div className="text-sm text-muted">
          <p><b>{c.batches}</b> Batches</p>
          <p><b>{c.students}</b> Students</p>
        </div><br></br>
        <AnimatedButton
          href={c.Location}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-primary rounde-16 text-nowrap"
          // className="bg-primary text-white rounded-full size-20 shadow text-nowrap p-2"
        >
          View Location
        </AnimatedButton>


      </motion.div>
    ))}
  </div>
);
