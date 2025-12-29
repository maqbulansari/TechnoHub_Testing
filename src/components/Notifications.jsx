import { AuthContext } from "@/contexts/authContext"
import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getFCMToken, onForegroundMessage } from "@/firebase/notificationsHelper"

const Notifications = () => {
  const { API_BASE_URL } = useContext(AuthContext)
  const token = localStorage.getItem("accessToken")

  const [notifications, setNotifications] = useState([])


  // 🔹 Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
       setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    }
  }

  
  // 🔹 Save FCM token to backend
  const saveFCMToken = async () => {
    try {
      const existing = localStorage.getItem("fcm_token")
      const fcmToken = await getFCMToken()
      if (!fcmToken || existing === fcmToken) return

      localStorage.setItem("fcm_token", fcmToken)

      await axios.post(
        `${API_BASE_URL}/notifications/save-token/`,
        { token: fcmToken }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    } catch (err) {
      console.error("FCM token save failed", err)
    }
  }


useEffect(() => {
  // Fetch notifications on mount
  fetchNotifications();
  saveFCMToken();

  
  const handler = () => fetchNotifications();
  

  window.addEventListener("notification-received", handler);


  // const interval = setInterval(() => {
  //   fetchNotifications();
  // }, 5000);

  return () => {
    window.removeEventListener("notification-received", handler);
    // clearInterval(interval);
  };
}, []);





  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-6">
      <Card className="w-full max-w-2xl border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-140px)]">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                You’re all caught up 🎉
              </p>
            ) : (
              notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <div
                    className={`px-4 py-3 cursor-pointer hover:bg-muted ${
                      !notification.is_read ? "bg-muted/40" : ""
                    }`}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <span className="block mt-2 text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  {index !== notifications.length - 1 && <Separator />}
                </React.Fragment>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default Notifications
