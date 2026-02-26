import { useState, useRef, useEffect, useCallback } from "react";
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
    qualification:
      "Pursuing Bachelors in Computer Science Engineering (Final Year)",
    batchName: "Java Full Stack",
    batchesTaken: 2,
    studentsTrained: 20,
    experience: [
      "Ethical Intelligence (2025 to Current)",
      "Afucent (05/2024 to 11/2024)",
    ],
  },
  {
    name: "Mohammad Ibrahim",
    role: "AI & ML Trainer",
    description:
      "Experienced in machine learning and real-world AI use cases.",
    image: image4,
    qualification:
      "Pursuing Bachelors in Computer Science Engineering (3rd Year)",
    batchName: "AI-ML Batch",
    batchesTaken: 2,
    studentsTrained: 40,
    experience: [
      "Ethical Intelligence (2025 to Current)",
      "Orange Antelopes (2024 to 2025)",
    ],
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
    description:
      "Expert in building scalable full-stack applications using MERN.",
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
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const animationRef = useRef(null);
  const isNavigatingRef = useRef(false);

  const CARD_WIDTH = 260;
  const GAP = 24;
  const ITEM_WIDTH = CARD_WIDTH + GAP;
  const SET_WIDTH = team.length * ITEM_WIDTH;
  const SPEED = 30; // pixels per second — consistent speed

  // We need enough duplicates so the visual content always fills the screen
  // even during the wrap-around. 5 copies is more than enough.
  const DUPLICATES = 5;
  const infiniteTeam = Array(DUPLICATES).fill(team).flat();

  /**
   * Normalize x into the range (-SET_WIDTH, 0].
   * This keeps us always looking at "copy index 1-2" visually,
   * so the jump is invisible since copies are identical.
   */
  const normalizeX = useCallback(
    (val) => {
      let normalized = val % SET_WIDTH;
      // Keep it negative (scrolling left means negative x)
      if (normalized > 0) normalized -= SET_WIDTH;
      if (normalized === 0) normalized = -SET_WIDTH; // avoid 0 edge
      return normalized;
    },
    [SET_WIDTH]
  );

  /*
* Start continuous scroll — cards move RIGHT (x increases).
*/
  const startContinuousScroll = useCallback(
    (fromX = null) => {
      if (animationRef.current) animationRef.current.stop();
      if (isNavigatingRef.current) return;

      const current = fromX ?? x.get();
      const normalized = normalizeX(current);

      // Scroll RIGHT: target is one SET_WIDTH further right (more positive)
      const target = normalized + SET_WIDTH;
      const distance = Math.abs(target - normalized);
      const duration = distance / SPEED;

      x.set(normalized);

      animationRef.current = animate(x, target, {
        duration,
        ease: "linear",
        onComplete: () => {
          const resetX = normalizeX(target);
          x.set(resetX);
          startContinuousScroll(resetX);
        },
      });
    },
    [SET_WIDTH, SPEED, normalizeX, x]
  );

  // Measure container
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Start scrolling once we know the container width
  useEffect(() => {
    if (containerWidth === 0) return;

    // Start at -SET_WIDTH so we have content on both sides
    x.set(-SET_WIDTH);
    startContinuousScroll(-SET_WIDTH);

    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, [containerWidth, SET_WIDTH, startContinuousScroll, x]);

  // Arrow navigation — step one card in the chosen direction
  const handleNav = useCallback(
    (direction) => {
      // direction: -1 = prev (move content right, x increases)
      //             1 = next (move content left, x decreases)
      if (animationRef.current) animationRef.current.stop();
      isNavigatingRef.current = true;

      const currentX = x.get();
      // Move by one card width in the requested direction
      const targetX = currentX + direction * ITEM_WIDTH;

      animate(x, targetX, {
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1], // smooth ease-out
        onComplete: () => {
          // Normalize so we never drift too far
          const normalized = normalizeX(targetX);
          x.set(normalized);
          isNavigatingRef.current = false;
          // Resume auto-scroll from normalized position
          startContinuousScroll(normalized);
        },
      });
    },
    [ITEM_WIDTH, normalizeX, startContinuousScroll, x]
  );

  const handlePrev = () => handleNav(-1); // left arrow: content slides left
  const handleNext = () => handleNav(1);  // right arrow: content slides right

  const handleOpenModal = (member) => {
    if (animationRef.current) animationRef.current.stop();
    isNavigatingRef.current = true;
    setSelectedProfile(member);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null);
    isNavigatingRef.current = false;
    // Resume from wherever we are, normalized
    const normalized = normalizeX(x.get());
    x.set(normalized);
    startContinuousScroll(normalized);
  };

  return (
    <section ref={containerRef} className="w-full overflow-hidden py-2 relative">
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

      {/* Carousel Track */}
      <motion.div className="flex w-max" style={{ x, gap: `${GAP}px` }}>
        {infiniteTeam.map((member, index) => (
          <motion.div
            key={`${member.name}-${index}`}
            whileHover={{ y: -8 }}
            className="flex-shrink-0 bg-white border rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            style={{ width: `${CARD_WIDTH}px` }}
            onClick={() => handleOpenModal(member)}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
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

      {/* Modal */}
      {selectedProfile && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={selectedProfile.image}
                alt={selectedProfile.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/10"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedProfile.name}
                </h3>
                <p className="text-primary font-medium mt-1">
                  {selectedProfile.role}
                </p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {selectedProfile.description}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 grid gap-3 text-sm">
              {selectedProfile.qualification && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Qualification:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.qualification}
                  </span>
                </div>
              )}
              {selectedProfile.batchName && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Batch Name:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.batchName}
                  </span>
                </div>
              )}
              {selectedProfile.batchesTaken && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Total Batches:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.batchesTaken}
                  </span>
                </div>
              )}
              {selectedProfile.studentsTrained && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Students Trained:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.studentsTrained}
                  </span>
                </div>
              )}
              {selectedProfile.experience && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Experience:
                  </span>
                  <span className="text-gray-700">
                    {Array.isArray(selectedProfile.experience)
                      ? selectedProfile.experience.join("; ")
                      : selectedProfile.experience}
                  </span>
                </div>
              )}
              {selectedProfile.projects && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Projects:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.projects.join("; ")}
                  </span>
                </div>
              )}
              {selectedProfile.companies && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Companies:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.companies.join("; ")}
                  </span>
                </div>
              )}
              {selectedProfile.currentProject && (
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-900 min-w-[140px]">
                    Current Project:
                  </span>
                  <span className="text-gray-700">
                    {selectedProfile.currentProject}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-center">
              <button
                className="px-8 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
                onClick={handleCloseModal}
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