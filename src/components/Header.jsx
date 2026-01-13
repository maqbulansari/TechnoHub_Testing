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
import NotificationPopover from "./Notifications";
import { NotificationContext } from "@/contexts/NotificationContext";



export default function Header({ setVisible }) {
const { count ,fetchCount} = useContext(NotificationContext);
  const MotionLink = motion(Link);
  const location = useLocation();
  const navigate = useNavigate();
  const { API_BASE_URL,accessToken } = useContext(AuthContext);

 

  const isAuthenticated = Boolean(
    localStorage.getItem("accessToken") &&
    localStorage.getItem("refreshToken") &&
    localStorage.getItem("userID")
  );


  const isHome = location.pathname === "/";

  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);


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


//   useEffect(() => {

//  fetchCount(); 
//     const unsubscribe = onForegroundMessage((payload) => {
//       console.log("FCM payload:", payload);

//       window.dispatchEvent(new Event("notification-received"));

//       if (payload?.data) {
//          fetchCount(); 
//         toast(payload.data.title || "New notification", {
//           description: payload.data.body || "You have a new notification",
//         });
//       }
//     });

//     return () => {
//       unsubscribe?.();
//     };
//   }, [accessToken]);




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
      // setNotificationCount(0);
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

                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 
                     flex items-center justify-center 
                     rounded-full bg-red-500 text-white text-xs font-bold">
                      {count}
                    </span>
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
            refreshCount={fetchCount}
          />
        </div>
      )}

    </>
  );
}    