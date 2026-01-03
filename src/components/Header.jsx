import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Bell } from "lucide-react";
import { AuthContext } from "../contexts/authContext";
import LoginModal from "@/feature-module/auth/login/login-3";
import ForgotPasswordModal from "@/feature-module/auth/forgotPassword/forgotPassword";
import axios from "axios";
import { onForegroundMessage } from "@/firebase/notificationsHelper";
import { toast } from "sonner";
import NotificationPopover from "./Notifications";


export default function Header({ setVisible }) {
  const MotionLink = motion(Link);
  const location = useLocation();
  const navigate = useNavigate();
  const { API_BASE_URL } = useContext(AuthContext);

  const requestIdRef = useRef(0);

  const isAuthenticated =
    localStorage.getItem("accessToken") &&
    localStorage.getItem("refreshToken") &&
    localStorage.getItem("userID");

  const isHome = location.pathname === "/";

  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const [openNotifications, setOpenNotifications] = useState(false);
  const notifRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // DEBUG: log on every render to ensure this instance is the one you see
  console.log("Header render, notificationCount:", notificationCount);

  // Stable fetch function + race-condition protection
  const fetchNotificationCount = useCallback(async () => {
    if (!isAuthenticated) return;

    const currentRequestId = ++requestIdRef.current;
    console.log("fetchNotificationCount requestId:", currentRequestId);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/notifications/unread/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const unread = response.data?.unread ?? 0;
      console.log(
        "API returned unread:",
        unread,
        "for requestId:",
        currentRequestId,
        "latest requestIdRef:",
        requestIdRef.current
      );

      // Only update state if this is the latest request
      if (currentRequestId === requestIdRef.current) {
        setNotificationCount(unread);
        console.log("unread", unread);

      } else {
        console.log(
          "Ignored stale response for requestId:",
          currentRequestId
        );
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, [API_BASE_URL, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotificationCount(0);
      return;
    }

    // initial load
    fetchNotificationCount();

    const unsubscribe = onForegroundMessage((payload) => {
      console.log("FCM payload:", payload);
      window.dispatchEvent(new Event("notification-received"));


      if (payload?.data?.type === "notification") {
        // always refetch on each notification
        fetchNotificationCount();
        toast("New notification", {
          description: payload?.notification?.body || "You have a new notification",
        });


      }
    });

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    console.log("notificationCount changed:", notificationCount);
  }, [notificationCount]);


  const handleNavigate = () => async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        `${API_BASE_URL}/notifications/mark-all-read/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setNotificationCount(0);
    } catch (error) {
      console.log(error);
    }
    finally {
      navigate("/notifications");
    }
  };

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

            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-auto">
                <motion.button
                  onClick={() => setOpenNotifications((prev) => !prev)}
                  className="relative p-2 rounded-full"
                >
                  <Bell className="w-8 h-6 text-gray-600" />

                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                  )}
                </motion.button>

              </div>
            )}
          </div>
        </div>
      </header>

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
      {openNotifications && (
        <div ref={notifRef} className="absolute right-6 top-16 z-50">
          <NotificationPopover
            onClose={() => setOpenNotifications(false)}
            refreshCount={fetchNotificationCount}
          />
        </div>
      )}

    </>
  );
}    