import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { AUTH_BASE_URL } from "@/environment";

const NotificationPopover = ({ refreshCount }) => {
  const { API_BASE_URL } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${AUTH_BASE_URL}/notification/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  const markAllRead = async () => {
    await axios.post(
      `${AUTH_BASE_URL}/mark-all-read/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    refreshCount();
    fetchNotifications();
  };

  const listVariants = {
    visible: {
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
  };


  const SkeletonItem = () => (
    <div className="px-4 py-3 animate-pulse">
      <div className="h-3 w-3/4 bg-muted rounded mb-2" />
      <div className="h-3 w-1/2 bg-muted rounded" />
    </div>
  );

  return (
    <div className="w-80 bg-white border rounded-xl shadow-lg overflow-hidden">
 
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h4 className="text-sm font-semibold">Notifications</h4>
        <button
          onClick={markAllRead}
          className="text-xs text-primary hover:underline"
        >
          Mark all as read
        </button>
      </div>

    
      <div className="max-h-[420px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[1, 2, 3, 4].map((i) => (
                <SkeletonItem key={i} />
              ))}
            </motion.div>
          ) : notifications.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-6 text-sm text-muted-foreground"
            >
              you don't have any notifications yet.
            </motion.p>
          ) : (
            <motion.div
              key="list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                  className={`px-4 py-2 flex gap-3 cursor-pointer items-start ${!n.is_read ? "bg-muted/40" : ""
                    }`}
                >
                  {/* Unread dot */}
                  {!n.is_read && (
                    <span className=" w-1.5 h-1.5 rounded-full bg-orange-500" />
                  //  <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0" />

                  )}

                  {/* Content */}
                  <div className="flex-1 leading-tight">
                    <p className="text-sm font-medium leading-snug">
                      {n.title}
                    </p>

                    <p className="text-xs text-muted-foreground leading-snug">
                      {n.message}
                    </p>

                    <span className="block text-[11px] text-muted-foreground mt-0.5">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationPopover;

