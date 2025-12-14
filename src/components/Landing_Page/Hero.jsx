import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";
// import AnimatedButton from "./AnimatedButton";

export default function Hero() {
  return (
    <section className="bg-soft pt-[140px] pb-[100px]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-[36px] sm:text-[44px] lg:text-[56px] leading-tight font-extrabold text-text">
            Unlock Your <br />
            Potential. <br />
            <span className="text-primary">Join Our Community.</span>
          </h1>

          <p className="mt-6 max-w-lg text-muted text-base sm:text-lg">
            A collaborative space for learners, thinkers, and creators.
            Dive into cutting-edge technologies with expert trainers
            and a vibrant community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <AnimatedButton className="px-7 py-3 bg-primary text-white rounded-full font-semibold shadow">
              Explore Courses
            </AnimatedButton>

            <AnimatedButton className="px-7 py-3 bg-white rounded-full font-semibold shadow">
              Our Centers
            </AnimatedButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-[24px] overflow-hidden shadow-xl"
        >
          <img
            src="https://images.unsplash.com/photo-1568992687947-868a62a9f521"
            className="w-full h-[260px] sm:h-[320px] lg:h-[420px] object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}
