import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Python Full Stack & Data Analysis",
    level: "Beginner to Advanced",
    duration: "6–7 Months",
    description:
      "Industry-ready program covering Python, SQL, Django, React and Data Analytics with real-world projects.",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    syllabusPdf: "/syllabus/python-react-fullstack.pdf",
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
          "File Handling & Exception Handling",
          "Regex, Decorators, Generators",
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
    syllabusPdf: "/syllabus/ai-ml.pdf",
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
    syllabusPdf: "/syllabus/mern.pdf",
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
    syllabusPdf: "/syllabus/java-fullstack.pdf",
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
  return (
    <section className="bg-slate-50 pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-[34px] font-semibold text-slate-900 tracking-tight">
            Our Professional Courses
          </h1>
          <p className="mt-3 text-[16px] text-slate-600 leading-[1.65] max-w-3xl">
            Carefully designed long-term programs focused on real-world skills,
            industry projects, and career growth.
          </p>
        </div>

        {/* Courses – one by one */}
        <div className="space-y-20 pt-0 mt-0">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="rounded-2xl border bg-white"
            >
              <CardContent className="p-10">
                {/* Header */}
                <div className="flex items-start gap-6">
                  <img
                    src={course.logo}
                    alt={course.title}
                    className="w-14 h-14 shrink-0"
                  />

                  <div className="flex-1">
                    <h2 className="text-[22px] font-semibold text-slate-900 leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis">
                      {course.title}
                    </h2>

                    <p className="mt-3 text-[15px] text-slate-600 leading-[1.65] max-w-3xl">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-6 mt-4 text-[13px] text-slate-700">
                      <span className="whitespace-nowrap">
                        ⏱ {course.duration}
                      </span>
                      <span className="whitespace-nowrap">
                        🎓 {course.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-10 h-px bg-slate-200" />

                {/* Highlights */}
                <div className="mb-4">
                  <h3 className="text-[16px] font-semibold text-slate-900 mb-5">
                    Key Highlights
                  </h3>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {course.highlights.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[14px] text-slate-600 leading-[1.6]"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 mt-[2px] shrink-0" />
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Modules */}

                <div className="mt-2">
                  <h3 className="text-[16px] font-semibold text-slate-900 mb-4">
                    Course Modules
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    {course.modules.map((mod, i) => (
                      <div
                        key={i}
                        className="pl-4 border-l border-slate-200"
                      >
                        {/* MODULE TITLE */}
                        <div className="flex  items-center gap-2 mb-3">
                        
                          <h4 className="text-[14px] mr-2 font-medium text-slate-800 whitespace-nowrap">
                            {mod.module}
                          </h4>
                        </div>

                        {/* TOPICS */}
                        <ul className="ml-6 space-y-2 text-[14px] text-slate-600 leading-[1.6]">
                          {mod.topics.map((topic, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                  </div>
                </div>


                {/* CTA */}
                <div className="mt-12">
                  <a
                    href={course.syllabusPdf}
                    download
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-blue-600 hover:underline whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Download Full Syllabus
                  </a>
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
