import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Bell } from "lucide-react";
import { AuthContext } from "../contexts/authContext";
import { all_routes } from "../feature-module/router/all_routes";
import LoginModal from "@/feature-module/auth/login/login-3";
import ForgotPasswordModal from "@/feature-module/auth/forgotPassword/forgotPassword";
import axios from "axios";
import { onForegroundMessage } from "@/firebase/notificationsHelper";
import { useRef } from "react"; 


export default function Header({ setVisible }) {
  const MotionLink = motion(Link);
  const routes = all_routes;
  const location = useLocation();

  const { API_BASE_URL } = useContext(AuthContext);
  const requestIdRef = useRef(0);

  const isAuthenticated =
    localStorage.getItem("accessToken") &&
    localStorage.getItem("refreshToken") &&
    localStorage.getItem("userID");

  const isHome = location.pathname === "/";

  // Add modal state
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Notification state
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch unread notifications count
const fetchNotificationCount = async () => {
  if (!isAuthenticated) return;

  const currentRequestId = ++requestIdRef.current;

  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${API_BASE_URL}/notifications/unread/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Ignore outdated responses
    if (currentRequestId !== requestIdRef.current) return;

    setNotificationCount(response.data.unread ?? 0);
  } catch (error) {
    if (currentRequestId !== requestIdRef.current) return;
    console.error("Error fetching notification count:", error);
  }
};


  useEffect(() => {
     if (!isAuthenticated) return;
      fetchNotificationCount(); 

  const unsubscribe = onForegroundMessage((payload) => {

    if (payload?.data?.type === "notification") {
      fetchNotificationCount(); 
    }
  });

  return () => unsubscribe?.();
  }, [isAuthenticated]);

  return (
    <>
      <header className="fixed top-0 w-full bg-white border-b z-50">
        <div className="h-[72px] flex items-center">
          {isAuthenticated && (
            <Button
              icon="pi pi-bars"
              onClick={() => setVisible?.(true)}
              aria-label="Open sidebar"
              className="ml-3 p-2 text-gray-700 bg-transparent border-none shadow-none"
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
                className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold"
              >
                Join Now
              </motion.button>
            )}

            {/* Bell Icon for Authenticated Users */}
            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-auto">
                <motion.button
                 
                  onClick={() => {
                   navigate("/notifications");
                  }}
                  className="relative p-2 rounded-full  transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-6 h-8 text-gray-600" />
                  
                  {/* Notification Badge */}
                  {notificationCount > 0 && (
                    <motion.span
                     
                      className="absolute top-0 right-[5px] min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1"
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </motion.span>
                  )}

                  {/* Pulse animation for new notifications */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5  rounded-full opacity-75" />
                  )}
                </motion.button>
              </div>
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

      {/* Forgot Password Modal */}
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