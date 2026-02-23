import { motion } from "framer-motion";
import image1 from "../../assets/images/carousel/carousel8.jpg";
import image2 from "../../assets/images/carousel/carousel10.jpg";
import image3 from "../../assets/images/carousel/carousel11.jpg";
import image4 from "../../assets/images/carousel/carousel5.jpg";
import image5 from "../../assets/images/carousel/carousel13.jpg";
import image6 from "../../assets/images/carousel/carousel14.jpg";
import image7 from "../../assets/images/carousel/carousel15.jpg";
import image8 from "../../assets/images/carousel/carousel16.jpg";

const images = [image1,image2,image3,image4,image5,image6,image7,image8];

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

export const Gallery = () => (
  <motion.div
    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-6"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
  >
    {images.map((img, i) => (
      <motion.div
        key={i}
        variants={item}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="rounded-sm overflow-hidden shadow bg-white"
      >
        <motion.img
          src={img}
          alt={`gallery-${i}`}
          className="w-full h-36 sm:h-44 md:h-56 object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    ))}
  </motion.div>
);