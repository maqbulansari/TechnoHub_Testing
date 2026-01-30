import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../../assets/images/trainers/trainer1.jpg";
import image2 from "../../assets/images/trainers/trainer2.jpg";
import image3 from "../../assets/images/trainers/trainer3.jpg";
import image4 from "../../assets/images/trainers/trainer4.jpg";
import image5 from "../../assets/images/trainers/trainer5.jpg";

const team = [
  {
    name: "Toseef Ali",
    role: "Co-Trainer",
    description: "Backend expert with focus on databases and APIs.",
    image: image2,
    qualification: "BCA 2nd Year",
    batchesTaken: "1 (co-trainer)",
    studentsTrained: 7,
    experience: "July 2025 to now at Ethical Intelligence",
    currentProject: "Social Media (Backend Developer)",
  },
  {
    name: "Subhana Maroof",
    role: "Python & Full Stack Trainer",
    description: "Hands-on experience in full-stack Python development.",
    image: "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
    qualification: "B.Tech , M.Tech (Pursuing)",
    batchesTaken: 4,
    pythonBatches: 2,
    dataAnalyticsBatches: 1,
    currentBatch: "Python-React Full Stack",
    studentsTrained: 75,
    experience: "Ethical Intelligence, Bhopal (Current)",
    projects: [
      "MHS (Modest Hijab Store) - Backend Developer",
      "SOS (Switch On Success) - Backend Developer",
      "HMS (Hospital Management System) - Team Lead",
      "Mecaps Automation - Team Lead",
    ],
  },
  {
    name: "MD Musa Alam",
    role: "Java Full Stack Trainer",
    description: "Strong background in Java, Spring Boot, and APIs.",
    image: image1,
    qualification: "Pursuing Bachelors in Computer Science Engineering (Final Year)",
    batchName: "Java Full Stack",
    batchesTaken: 2,
    studentsTrained: 20,
    experience: ["Ethical Intelligence (2025 to Current)", "Afucent (05/2024 to 11/2024)"],
  },
  {
    name: "Mohammad Ibrahim",
    role: "AI & ML Trainer",
    description: "Experienced in machine learning and real-world AI use cases.",
    image: image4,
    qualification: "Pursuing Bachelors in Computer Science Engineering (3rd Year)",
    batchName: "AI-ML Batch",
    batchesTaken: 2,
    studentsTrained: 40,
    experience: ["Ethical Intelligence (2025 to Current)", "Orange Antelopes (2024 to 2025)"],
  },
  {
    name: "Maisara Waseem",
    role: "Data Science & AI Trainer",
    description: "Passionate about AI models and data-driven solutions.",
    image: "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
    qualification: "M.Tech",
    batchesTaken: 5,
    aiBatches: 2,
    studentsTrained: 95,
    companies: [
      "Innomatics Research Labs (Hyderabad) - Data Science Trainer (Freelance – Online)",
      "Skillio by Testing Shastra (Pune) - Data Science Trainer (Part Time – Online)",
    ],
  },
  {
    name: "Imad Baig",
    role: " Python Full Stack &Frontend Trainer",
    description: "Focused on modern UI, UX, and frontend performance.",
    image: image5,
    qualification: "BCA 1st Year",
    batchesTaken: 2,
    studentsTrained: 18,
    experience: "August 2024 to now",
    currentProject: "Khidmat App (Frontend Developer)",
  },
  {
    name: "Farha Alam",
    role: "Python Full Stack & Data Analytics Trainer",
    description: "Specialist in Python, data analysis, and backend systems.",
    image: "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
    qualification: "MCA (Master of Computer Applications)",
    batchesTaken: 1,
    currentBatch: "Python Full Stack Data Analytics",
    studentsTrained: "Currently training",
    experience: ["Ethical Intelligence, Bhopal (Current)", "BISP Solutions, Bhopal"],
  },
  {
    name: "Arsalan Ahmed",
    role: "MERN Stack Trainer",
    description: "Expert in building scalable full-stack applications using MERN.",
    image: image3,
    qualification: "Bachelors in Computer Science Engineering",
    batchName: "MERN Stack",
    batchesTaken: 2,
    studentsTrained: 15,
    experience: [
      "Ethical Intelligence (2025 to Current)",
      "Wenodo (06/2024 to 01/2025)",
      "Anncode Solution (03/2024 to 05/2025)",
      "Neural Bridge AI (01/2024 to 02/2024)",
    ],
  },
];

export const Testimonials = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const x = useMotionValue(0);
  const animationRef = useRef(null);

  const CARD_WIDTH = 260;
  const GAP = 24;
  const ITEM_WIDTH = CARD_WIDTH + GAP;
  const TOTAL_WIDTH = team.length * ITEM_WIDTH;
  const DURATION = 120; // seconds for full loop

  // Start infinite scroll animation
  const startAnimation = (fromX = 0) => {
    // Cancel any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Normalize position to stay within bounds
    let normalizedX = fromX;
    while (normalizedX > 0) normalizedX -= TOTAL_WIDTH;
    while (normalizedX < -TOTAL_WIDTH) normalizedX += TOTAL_WIDTH;

    // Calculate proportional duration based on remaining distance
    const distance = TOTAL_WIDTH + normalizedX;
    const duration = (distance / TOTAL_WIDTH) * DURATION;

    x.set(normalizedX);

    animationRef.current = animate(x, -TOTAL_WIDTH, {
      duration: duration,
      ease: "linear",
      onComplete: () => startAnimation(0),
    });
  };

  useEffect(() => {
    startAnimation(0);
    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, []);

  // Handle previous button click
  const handlePrev = () => {
    if (animationRef.current) animationRef.current.stop();
    const currentX = x.get();
    const newX = currentX + ITEM_WIDTH;

    animationRef.current = animate(x, newX, {
      duration: 0.4,
      ease: "easeOut",
      onComplete: () => startAnimation(newX),
    });
  };

  // Handle next button click
  const handleNext = () => {
    if (animationRef.current) animationRef.current.stop();
    const currentX = x.get();
    const newX = currentX - ITEM_WIDTH;

    animationRef.current = animate(x, newX, {
      duration: 0.4,
      ease: "easeOut",
      onComplete: () => startAnimation(newX),
    });
  };

  return (
    <section className="w-full overflow-hidden py-14 relative">
      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 sm:p-3 hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200 flex items-center justify-center"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 sm:p-3 hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200 flex items-center justify-center"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </button>

      {/* Carousel */}
      <motion.div
        className="flex gap-6 w-max px-6"
        style={{ x }}
      >
        {[...team, ...team].map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            className="w-[260px] flex-shrink-0 bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedProfile(member)}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
            />
            <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
            <p className="text-primary text-xs font-medium mt-1">{member.role}</p>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-2">{member.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="
              bg-white 
              rounded-2xl 
              p-6 
              w-11/12 
              max-w-4xl 
              max-h-[90vh] 
              overflow-y-auto 
              shadow-lg 
              relative
            "
          >
            {/* Top-right X button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 font-bold text-lg"
              onClick={() => setSelectedProfile(null)}
            >

            </button>

            {/* Profile Image and Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img
                src={selectedProfile.image}
                alt={selectedProfile.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold">{selectedProfile.name}</h3>
                <p className="text-primary text-sm font-medium mt-1">{selectedProfile.role}</p>
                <p className="text-gray-600 text-sm mt-2">{selectedProfile.description}</p>
              </div>
            </div>

            {/* Detail Section */}
            <div className="mt-6 text-sm text-gray-700 space-y-1">
              {selectedProfile.qualification && <p><strong>Qualification:</strong> {selectedProfile.qualification}</p>}
              {selectedProfile.batchName && <p><strong>Batch Name:</strong> {selectedProfile.batchName}</p>}
              {selectedProfile.batchesTaken && <p><strong>Total Batches Taken:</strong> {selectedProfile.batchesTaken}</p>}
              {selectedProfile.pythonBatches && <p><strong>Number of Python Batches:</strong> {selectedProfile.pythonBatches}</p>}
              {selectedProfile.dataAnalyticsBatches && <p><strong>Number of Data Analytics Batches:</strong> {selectedProfile.dataAnalyticsBatches}</p>}
              {selectedProfile.currentBatch && <p><strong>Current Batch:</strong> {selectedProfile.currentBatch}</p>}
              {selectedProfile.studentsTrained && <p><strong>Number of Students Trained (Approx):</strong> {selectedProfile.studentsTrained}</p>}
              {selectedProfile.experience && (
                <p>
                  <strong>Work Experience:</strong>{" "}
                  {Array.isArray(selectedProfile.experience) ? selectedProfile.experience.join("; ") : selectedProfile.experience}
                </p>
              )}
              {selectedProfile.projects && (
                <p>
                  <strong>Projects:</strong>{" "}
                  {selectedProfile.projects.join("; ")}
                </p>
              )}
              {selectedProfile.companies && (
                <p>
                  <strong>Current Companies:</strong>{" "}
                  {selectedProfile.companies.join("; ")}
                </p>
              )}
              {selectedProfile.currentProject && <p><strong>Current Project:</strong> {selectedProfile.currentProject}</p>}
            </div>

            {/* Footer Close Button */}
            <div className="mt-6 text-center">
              <button
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => setSelectedProfile(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};