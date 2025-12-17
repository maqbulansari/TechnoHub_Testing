import React, { useContext, useEffect, useState } from "react";
// import Header from "../components/Header";
// import Hero from "../components/Hero";
// import SectionHeading from "./landing/Sections/SectionHeading";
// import { Centers } from "./landing/Centers";
// import { Technologies } from "./landing/Technologies";
// import { Trainers } from "./landing/Trainers";
// import { Gallery } from "./landing/Gallery";
// import { ThursdayReads } from "./landing/ThursdayReads";
// import { Footer } from "../components/Footer";
// import { AuthContext } from "../contexts/authContext";
import { Footer } from "./Footer";
import { ThursdayReads } from "./ThrusdayReads";
import SectionHeading from "./SectionHeading";
import { Gallery } from "./Gallery";
import { Trainers } from "./Trainers";
import { Technologies } from "./Technologies";
import { Centers } from "./Centers";
import Header from "../Header";
import Hero from "./Hero";
import Section from "./Section";
import { AuthContext } from "@/contexts/authContext";
import { useLocation } from "react-router-dom";


export const Landing_page = () => {
  const { loginSuccess, setLoginSuccess, responseSubrole } = useContext(AuthContext);
    const words = ["Trainers", "Developers"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [deleting, setDeleting] = useState(false);


    useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timer;

    if (!deleting && displayedText.length < currentWord.length) {
      timer = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, 150); // typing speed
    } else if (deleting && displayedText.length > 0) {
      timer = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
      }, 150); // deleting speed
    } else if (!deleting && displayedText.length === currentWord.length) {
      timer = setTimeout(() => setDeleting(true), 1000); // wait before deleting
    } else if (deleting && displayedText.length === 0) {
      setDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, deleting, words, currentWordIndex]);

  useEffect(() => {
    if (loginSuccess) {
      const t = setTimeout(() => setLoginSuccess(false), 1500);
      return () => clearTimeout(t);
    }
  }, [loginSuccess, setLoginSuccess]);

  useEffect(() => {
    if (responseSubrole === "SPONSOR") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    if (responseSubrole === "STUDENT") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    if (responseSubrole === "TRAINER") {
      setShowModal(false);
      setLoginSuccess(false);
    }


    if (responseSubrole === "RECRUITER") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    if (responseSubrole === "INTERVIEWEE") {
      setShowModal(false);
      setLoginSuccess(false);
    }

  }, [responseSubrole,]);


  return (
    <div className="overflow-x-hidden">
      <Header />
      <Hero />
 

{/*       
      <Section>
        <SectionHeading 
        title="Centers" 
        subtitle="Where learning meets real-world experience."
        />
        <Centers />
      </Section> */}

      <Section gray>
        <div id="tech" className="scroll-mt-[90px]">
          <SectionHeading
            title="Technologies We Teach"
            subtitle="Stay ahead of the curve with in-demand skills."
          />
          <Technologies />
        </div>
      </Section>

      <Section>
        <div id="trainers" className="scroll-mt-[90px]">
          <SectionHeading
            title={`Meet Our Expert  ${displayedText}`}
            subtitle="Learn from industry leaders."
          />
          <Trainers />
        </div>
      </Section>

      <Section gray>
        <div id="gallery" className="scroll-mt-[90px]">
          <SectionHeading
            title="Our Community in Action"
            subtitle="Explore our vibrant learning centers."
          />
          <Gallery />
        </div>
      </Section>

      <Section gray>
        <div id="reads" className="scroll-mt-[90px]">
          <SectionHeading
            title="Thursday Reads"
            subtitle="Join the discussion every week."
          />
          <ThursdayReads />
        </div>
      </Section>


      <Footer />
    </div>
  );
};