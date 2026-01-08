// NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onForegroundMessage } from "@/firebase/notificationsHelper";
import axios from "axios";
import { AuthContext } from "@/contexts/authContext";
import { toast } from "sonner";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { API_BASE_URL, accessToken } = useContext(AuthContext);
    const [count, setCount] = useState(0);

    const fetchCount = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                return null
            }
            const res = await axios.get(`${API_BASE_URL}/notifications/unread/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCount(Number(res.data?.unread ?? 0));
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (!accessToken) return;

        fetchCount();

        const unsubscribe = onForegroundMessage((payload) => {
            console.log("Foreground message received", payload);

            if (payload?.data) {
                fetchCount();

                toast(payload.data.title || "New notification", {
                    description: payload.data.body || "You have a new notification",
                });
            }
        });

        return () => unsubscribe?.();
    }, [accessToken]);


    return (
        <NotificationContext.Provider value={{ count, fetchCount, setCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

// export const useNotifications = () => useContext(NotificationContext);
