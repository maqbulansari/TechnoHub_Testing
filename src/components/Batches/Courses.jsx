import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Courses = () => {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Python Full Stack & Data Analysis",
      description:
        "Industry-ready program covering Python, SQL, Django, and Data Analytics with real projects.",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      modules: [
        {
          module: "Python Programming",
          topics: [
            "Python Basics, Variables & Data Types",
            "Conditional Statements & Loops",
            "Functions, Lambda, Map, Filter, Reduce",
            "OOP Concepts & Recursion",
            "File Handling & Exception Handling",
            "Regex, Decorators, Iterators & Generators",
          ],
        },
        {
          module: "Database & SQL",
          topics: [
            "DBMS & RDBMS Concepts",
            "DDL & DML Commands",
            "Joins, Subqueries & Views",
            "Window Functions & Stored Procedures",
            "SQL Integration with Python",
          ],
        },
        {
          module: "Web Technologies",
          topics: [
            "HTML Structure, Forms & Tables",
            "CSS Styling, Layouts & Positioning",
            "JavaScript Basics & DOM Manipulation",
          ],
        },
        {
          module: "Backend Development",
          topics: [
            "Django Framework & MVT Architecture",
            "Django ORM & Authentication",
            "REST APIs using Django REST Framework",
            "JWT Authentication & Filters",
          ],
        },
        {
          module: "Data Analysis & Visualization",
          topics: [
            "NumPy & Pandas for Data Analysis",
            "Data Cleaning & Transformation",
            "Matplotlib & Seaborn",
            "Power BI / Tableau",
          ],
        },
      ],
    },

    {
      id: 2,
      title: "JavaScript",
      description:
        "Master modern JavaScript to build interactive and dynamic web applications.",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      modules: [
        {
          module: "JavaScript Fundamentals",
          topics: [
            "Variables, Data Types & Operators",
            "Conditional Statements & Loops",
            "Arrays, Objects & Destructuring",
          ],
        },
        {
          module: "Advanced JavaScript",
          topics: [
            "Functions, Scope & Closures",
            "Error Handling (try/catch)",
            "Asynchronous JavaScript",
          ],
        },
        {
          module: "Web Interaction",
          topics: [
            "DOM Manipulation",
            "Event Handling",
            "Fetch API & API Integration",
          ],
        },
      ],
    },

    {
      id: 3,
      title: "React",
      description:
        "Build scalable, fast, and modern frontend applications using React.",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      modules: [
        {
          module: "React Core",
          topics: [
            "React Introduction & Project Setup",
            "JSX & Component Architecture",
            "Props & State",
          ],
        },
        {
          module: "React Hooks",
          topics: [
            "useState & useEffect",
            "Custom Hooks",
            "Context API",
          ],
        },
        {
          module: "Advanced React",
          topics: [
            "React Router",
            "Redux Basics",
            "API Integration",
          ],
        },
      ],
    },

    {
      id: 4,
      title: "AI & Machine Learning",
      description:
        "End-to-end AI & ML course covering data, machine learning, deep learning, and GenAI.",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
      modules: [
        {
          module: "Programming & Data Foundations",
          topics: [
            "Python Programming (Basic to Advanced)",
            "NumPy, Pandas & Data Visualization",
            "SQL for Data Analytics",
          ],
        },
        {
          module: "Machine Learning",
          topics: [
            "Supervised & Unsupervised Learning",
            "Regression & Classification",
            "Clustering & Dimensionality Reduction",
          ],
        },
        {
          module: "Deep Learning",
          topics: [
            "ANN, CNN, RNN, LSTM & GRU",
            "Computer Vision & NLP",
            "Transformers & BERT",
          ],
        },
        {
          module: "Generative AI",
          topics: [
            "LLMs & Prompt Engineering",
            "LangChain & AI Agents",
            "Vector Databases & RAG",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-semibold text-center mb-12">
          Our Professional Courses
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6 text-center">
                <img
                  src={course.logo}
                  alt={course.title}
                  className="w-14 h-14 mx-auto"
                />
                <h3 className="mt-4 font-semibold">{course.title}</h3>
                <p className="text-sm text-slate-500 mt-2">
                  {course.description}
                </p>
                <Button
                  className="mt-5 w-full"
                  onClick={() => {
                    setSelectedCourse(course);
                    setOpen(true);
                  }}
                >
                  View Detailed Syllabus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent
    className="
      w-[90vw] 
      max-w-4xl 
      h-[80vh] 
      flex 
      flex-col 
      rounded-2xl
    "
  >
    {/* Header */}
    <DialogHeader className="shrink-0 border-b pb-3">
      <DialogTitle className="text-2xl">
        {selectedCourse?.title}
      </DialogTitle>
    </DialogHeader>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
      {selectedCourse?.modules.map((mod, i) => (
        <div key={i}>
          <h4 className="font-semibold text-lg text-slate-800">
            {mod.module}
          </h4>
          <ul className="mt-2 space-y-2">
            {mod.topics.map((topic, j) => (
              <li
                key={j}
                className="text-slate-600 leading-relaxed"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Footer */}
    <DialogFooter className="shrink-0 border-t pt-3">
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default Courses;
