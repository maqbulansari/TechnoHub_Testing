import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Python Full Stack & Data Analysis",
    level: "Beginner to Advanced",
    duration: "6–7 Months",
    description:
      "Industry-ready program covering Python, SQL, Django, React and Data Analytics with real-world projects.",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    syllabusPdf: "/syllabus/pythonreactsyllabus.pdf",
    fileName: "Python-React-FullStack-Syllabus.pdf",
    highlights: [
      "Live Industry Projects",
      "Job-Oriented Curriculum",
      "Resume & Interview Preparation",
      "Certificate of Completion",
    ],
    modules: [
      {
        module: "Python Programming",
        topics: [
          "Core Python & OOP",
          "File Handling ",
          "Exception Handling",
          "Regex",
          "Decorators",
          "Generators",
        ],
      },
      {
        module: "Database & SQL",
        topics: [
          "DBMS & MySQL",
          "Joins, Subqueries, Window Functions",
          "Python–SQL Integration",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "AI & Machine Learning",
    level: "Intermediate to Advanced",
    duration: "7–8 Months",
    description:
      "Comprehensive AI & ML program covering Machine Learning, Deep Learning and Generative AI.",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    syllabusPdf: "/syllabus/aimlsyllabus.pdf",
    fileName: "AI-ML-Syllabus.pdf",
    highlights: [
      "Hands-on ML & DL Projects",
      "Generative AI & LLMs",
      "Real Dataset Training",
      "Industry Certification",
    ],
    modules: [
      {
        module: "Machine Learning",
        topics: ["Regression", "Classification", "Clustering"],
      },
      {
        module: "Deep Learning",
        topics: ["CNN", "RNN", "Transformers"],
      },
    ],
  },
  {
    id: 3,
    title: "MERN Full Stack",
    level: "Beginner to Advanced",
    duration: "5–6 Months",
    description:
      "Complete MERN stack course covering MongoDB, Express, React and Node.js.",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    syllabusPdf: "/syllabus/mernsyllabus.pdf",
    fileName: "MERN-FullStack-Syllabus.pdf",
    highlights: [
      "Full Stack Projects",
      "REST APIs & JWT",
      "Modern React Practices",
      "Placement Support",
    ],
    modules: [
      {
        module: "Frontend",
        topics: ["HTML, CSS, JavaScript", "React & Hooks"],
      },
      {
        module: "Backend",
        topics: ["Node.js", "Express.js"],
      },
    ],
  },
  {
    id: 4,
    title: "Java Full Stack",
    level: "Beginner to Advanced",
    duration: "6 Months",
    description:
      "Enterprise-level Java full stack development using Spring Boot and SQL.",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    syllabusPdf: "/syllabus/javasyllabus.pdf",
    fileName: "Java-FullStack-Syllabus.pdf",
    highlights: [
      "Spring Boot & Hibernate",
      "Enterprise Projects",
      "Strong Backend Focus",
      "Interview Preparation",
    ],
    modules: [
      {
        module: "Core Java",
        topics: ["OOP", "Collections", "Multithreading"],
      },
      {
        module: "Backend",
        topics: ["Spring Boot", "REST APIs"],
      },
    ],
  },
];

const Courses = () => {
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async (pdfUrl, fileName, courseId) => {
    setDownloading(courseId);
    setError(null);

    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error("PDF file not found");
      }

      const blob = await response.blob();

      // Create download link
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setError(courseId);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section className="bg-slate-50 py-24">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-semibold text-slate-900 tracking-tight">
            Our Professional Courses
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[16px] text-slate-600 leading-relaxed lg:leading-[1.65] max-w-3xl">
            Carefully designed long-term programs focused on real-world skills,
            industry projects, and career growth.
          </p>
        </div>

        {/* Courses – one by one */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
                {/* Header */}
                <div className="flex flex-col xs:flex-row items-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  <img
                    src={course.logo}
                    alt={course.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0"
                  />

                  <div className="flex-1 min-w-0 w-full">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-[22px] font-semibold text-slate-900 leading-snug lg:leading-[1.35]">
                      {course.title}
                    </h2>

                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-relaxed lg:leading-[1.65]">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-[13px] text-slate-700">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 sm:my-6 md:my-8 lg:my-10 h-px bg-slate-200" />

                {/* Highlights */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-slate-900 mb-3 sm:mb-4 md:mb-5">
                    Key Highlights
                  </h3>

                  <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-x-6 md:gap-y-3">
                    {course.highlights.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm md:text-[14px] text-slate-600 leading-relaxed"
                      >
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modules */}
                <div className="mt-4 sm:mt-6 md:mt-8">
                  <h3 className="text-sm sm:text-base md:text-[16px] font-semibold text-slate-900 mb-3 sm:mb-4">
                    Course Modules
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                    {course.modules.map((mod, i) => (
                      <div 
                        key={i} 
                        className="pl-3 sm:pl-4 border-l-2 border-slate-200"
                      >
                        <div className="mb-2 sm:mb-3">
                          <h4 className="text-xs sm:text-sm md:text-[14px] font-medium text-slate-800">
                            {mod.module}
                          </h4>
                        </div>

                        <ul className="space-y-1 sm:space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-[14px] text-slate-600">
                          {mod.topics.map((topic, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2"
                            >
                            
                              <span className="leading-relaxed">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <button
                    onClick={() =>
                      handleDownload(
                        course.syllabusPdf,
                        course.fileName,
                        course.id
                      )
                    }
                    disabled={downloading === course.id}
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-[14px] font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading === course.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : error === course.id ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        <span className="text-red-500">Retry Download</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-nowrap">Download Full Syllabus</span>
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;