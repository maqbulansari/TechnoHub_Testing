import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { AuthContext } from "../contexts/authContext";
import { all_routes } from "../feature-module/router/all_routes";

export default function Header({ setVisible }) {
  const MotionLink = motion(Link);
  const routes = all_routes;

  const storedRole = localStorage.getItem("role");
  const {
    userLoggedIN,
    accessToken,
    refreshToken,
    userID,
  } = useContext(AuthContext);

  const isAuthenticated =
    userLoggedIN && accessToken && refreshToken && userID;
    const isHome = location.pathname === "/";
  return (
<header className="fixed top-0 w-full bg-white border-b z-50">
  {/* FULL WIDTH BAR */}
  <div className="h-[72px] flex items-center">

    {/* LEFT EDGE ACTION (NOT CENTERED) */}
    {isAuthenticated && (
      <Button
        icon="pi pi-bars"
        onClick={() => setVisible?.(true)}
        aria-label="Open sidebar"
        className="
          ml-2
          p-2
          text-primary
          bg-transparent
          border-none
          shadow-none
        "
      />
    )}

    {/* CENTERED CONTENT */}
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">

      {/* LOGO */}
      <Link to="/" className="text-3xl font-bold text-primary">
        TechnoHub
      </Link>

      {/* CENTER NAV */}
      {!isAuthenticated && isHome && (
        <nav className="hidden md:flex gap-8 text-sm text-text">
          <a href="#trainers">Trainers</a>
          <a href="#tech">Technologies</a>
          <a href="#gallery">Gallery</a>
          <a href="#reads">Thursday Reads</a>
        </nav>
      )}

      {/* RIGHT ACTION */}
      {!isAuthenticated && (
        <MotionLink
          to={routes.login3}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="
            px-5 py-2
            bg-primary text-white
            rounded-full
            text-sm font-semibold
            shadow
          "
        >
          Join Now
        </MotionLink>
      )}
    </div>
  </div>
</header>

  );
}
