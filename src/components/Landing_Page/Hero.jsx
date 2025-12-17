import { motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";
// import AnimatedButton from "./AnimatedButton";

export default function Hero() {
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



// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import AnimatedButton from "../ui/AnimatedButton";


// export default function Hero() {
//   const words = ["Design", "Develop", "Dominate"];
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [displayedText, setDisplayedText] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const currentWord = words[currentWordIndex];
//     let timer;

//     if (!deleting && displayedText.length < currentWord.length) {
//       timer = setTimeout(() => {
//         setDisplayedText(currentWord.slice(0, displayedText.length + 1));
//       }, 150); // typing speed
//     } else if (deleting && displayedText.length > 0) {
//       timer = setTimeout(() => {
//         setDisplayedText(currentWord.slice(0, displayedText.length - 1));
//       }, 100); // deleting speed
//     } else if (!deleting && displayedText.length === currentWord.length) {
//       timer = setTimeout(() => setDeleting(true), 1000); // wait before deleting
//     } else if (deleting && displayedText.length === 0) {
//       setDeleting(false);
//       setCurrentWordIndex((prev) => (prev + 1) % words.length);
//     }

//     return () => clearTimeout(timer);
//   }, [displayedText, deleting, words, currentWordIndex]);

//   return (
//     <section className="bg-soft pt-[120px] pb-[100px]">
//       <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//         >
//           <h1 className="text-[32px] sm:text-[42px] lg:text-[52px] leading-tight font-extrabold text-text">
//             Code Your <br />
//             Future. <br />
//             <span className="text-primary inline-block border-r-2 border-r-primary pr-1">
//               {displayedText}
//             </span>
//           </h1>

//           <p className="mt-6 max-w-lg text-muted text-base sm:text-lg">
//             Join our web development classes to learn essential coding
//             skills, build dynamic websites, and kickstart your tech career.
//             Empower yourself with hands-on projects and expert guidance.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 mt-10">
//               <AnimatedButton className="px-7 py-3 bg-primary text-white rounded-full font-semibold shadow">
//                 Explore Courses
//               </AnimatedButton>
//             <AnimatedButton className="px-7 py-3 bg-white rounded-full font-semibold shadow">
//               Our Centers
//             </AnimatedButton>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//           className="rounded-[24px] overflow-hidden shadow-xl"
//         >
//           <img
//             src="https://images.unsplash.com/photo-1568992687947-868a62a9f521"
//             // src={carouselImg2}
//             className="w-full h-[260px] sm:h-[320px] lg:h-[420px] object-cover"
//           />
//         </motion.div>

//       </div>
//     </section>
//   );
// }
