import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "@/firebase/firebase"

export const getFCMToken = async () => {
  try {
    console.log("Getting FCM token...");

    // 1. Check existing token first
    const existingToken = localStorage.getItem("fcm_token");
    if (existingToken) {
      console.log("Using existing FCM token");
      return existingToken;
    }

    // 2. Request permission
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    // 3. Get new token
    const token = await getToken(messaging, {
      vapidKey: "BBaT65T-1xDXSMj2vi49NVscRnJXcc0T7lvPBekhyS-QXIrLn-vcIkzTncgHPjQ95pcBekM74GvqKA2z0nKVXA8",
    });

    if (!token) {
      console.warn("Failed to get FCM token");
      return null;
    }

    // 4. Store token
    localStorage.setItem("fcm_token", token);
    console.log("New FCM token:", token);

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};


export const onForegroundMessage = (callback) => {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("FCM payload received:", payload);
    callback(payload);
  });

  return unsubscribe;
};


