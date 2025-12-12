import React, { useContext, useEffect } from "react";
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
import { AuthContext } from "@/contexts/authContext";

export const Landing_page = () => {
  const { loginSuccess, setLoginSuccess, responseSubrole } = useContext(AuthContext);

  useEffect(() => {
    if (loginSuccess) {
      const t = setTimeout(() => setLoginSuccess(false), 1500);
      return () => clearTimeout(t);
    }
  }, [loginSuccess, setLoginSuccess]);

  useEffect(() => {
    if (responseSubrole) {
      // quick close or handle redirect
      setLoginSuccess(false);
    }
  }, [responseSubrole, setLoginSuccess]);

  return (
    <div>
      <Header />
      <Hero />

      <main className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        <section id="centers" className="pt-4">
          <SectionHeading title="Our Centers" />
          <Centers />
        </section>

        <section id="tech">
          <SectionHeading title="Technologies We Teach" />
          <Technologies />
        </section>

        <section id="trainers">
          <SectionHeading title="Meet Our Expert Trainers" />
          <Trainers />
        </section>

        <section id="gallery">
          <SectionHeading title="Our Community in Action" />
          <Gallery />
        </section>

        <section id="reads">
          <SectionHeading title="Thursday Reads" />
          <ThursdayReads />
        </section>
      </main>

      <Footer />
    </div>
  );
};