import { useState } from "react";
import { motion } from "framer-motion";
import image1 from "../../assets/images/trainers/Trainer1.jpg";
import image2 from "../../assets/images/trainers/Trainer2.jpg";
import image3 from "../../assets/images/trainers/Trainer3.jpg";
import image4 from "../../assets/images/trainers/Trainer4.jpg";

const team = [
  {
    name: "Toseef Ali",
    role: "Backend Developer & Co-Trainer",
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
    role: "Frontend Developer & Trainer",
    description: "Focused on modern UI, UX, and frontend performance.",
    image: "https://cdn-icons-png.flaticon.com/512/3567/3567769.png",
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

  return (
    <section className="w-full overflow-hidden py-14 relative">
      <motion.div
        className="flex gap-6 w-max px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 120 }}
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
              ×
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
