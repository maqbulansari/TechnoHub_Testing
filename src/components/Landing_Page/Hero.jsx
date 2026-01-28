import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";
import image1 from "../../assets/images/carousel/carousel8.jpg";
import image2 from "../../assets/images/carousel/carousel6.jpg";
import image3 from "../../assets/images/carousel/carousel7.jpg";
import image4 from "../../assets/images/carousel/carousel9.jpg";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const Navigate = useNavigate()
  const images = [image1, image2, image3,image4];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="bg-soft pt-[120px] pb-[100px]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-[32px] sm:text-[42px] lg:text-[52px] leading-tight font-extrabold text-text">
            Unlock Your <br />
            Potential. <br />
            <span className="text-primary">Join Our Community.</span>
          </h1>

          <p className="mt-4 max-w-lg text-muted text-base sm:text-md">
            A collaborative space for learners, thinkers, and creators.
            Dive into cutting-edge technologies with expert trainers
            and a vibrant community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <AnimatedButton onClick={()=>Navigate("/Courses")} className="px-7 py-3 bg-primary text-white rounded-full font-semibold">
              Explore Courses
            </AnimatedButton>

            <AnimatedButton className="px-7 border border-gray-200 py-3 bg-white rounded-full font-semibold">
              Our Centers
            </AnimatedButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
            className="rounded-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          <img
            src={images[current]}
            alt="Hero Carousel"
            className="w-full h-[260px] sm:h-[320px] lg:h-[420px] object-cover transition-all duration-700"
          />
        </motion.div>

      </div>
    </section>
  );
}
