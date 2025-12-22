import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { AuthContext } from "../contexts/authContext";
import { all_routes } from "../feature-module/router/all_routes";
import LoginModal from "@/feature-module/auth/login/login-3";
import ForgotPasswordModal from "@/feature-module/auth/forgotPassword/forgotPassword";

export default function Header({ setVisible }) {
  const MotionLink = motion(Link);
  const routes = all_routes;
  const location = useLocation();

  const { userLoggedIN } = useContext(AuthContext);

  const isAuthenticated =
    localStorage.getItem("accessToken") &&
    localStorage.getItem("refreshToken") &&
    localStorage.getItem("userID");

  const isHome = location.pathname === "/";

  // Add modal state
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full bg-white border-b z-50">
        <div className="h-[72px] flex items-center">
          {isAuthenticated && (
            <Button
              icon="pi pi-bars"
              onClick={() => setVisible?.(true)}
              aria-label="Open sidebar"
              className="ml-3 p-2 text-primary bg-transparent border-none shadow-none"
            />
          )}
          {isAuthenticated && (
            <Link to="/" className="text-3xl ml-3 pt-1 font-bold text-primary">
              TechnoHub
            </Link>
          )}

          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
            {!isAuthenticated && (
              <Link to="/" className="text-3xl font-bold text-primary">
                TechnoHub
              </Link>
            )}

            {!isAuthenticated && isHome && (
              <nav className="hidden md:flex gap-8 text-sm text-text">
                <a href="#trainers">Trainers</a>
                <a href="#tech">Technologies</a>
                <a href="#gallery">Gallery</a>
                <a href="#reads">Thursday Reads</a>
              </nav>
            )}

            {!isAuthenticated && (
              <motion.button
                onClick={() => setLoginOpen(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold "
              >
                Join Now
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {!isAuthenticated && (
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onForgot={() => {
            setLoginOpen(false);
            setForgotOpen(true);
          }}
        />
      )}

      {/*  Forgot Password Modal */}
      {!isAuthenticated && (
        <ForgotPasswordModal
          open={forgotOpen}
          onClose={() => setForgotOpen(false)}
          onBackToLogin={() => {
            setForgotOpen(false);
            setLoginOpen(true);
          }}
        />
      )}
    </>
  );
}
