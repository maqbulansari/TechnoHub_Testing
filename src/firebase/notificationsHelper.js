import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "@/firebase/firebase"

export const getFCMToken = async () => {
  const permission = await Notification.requestPermission()

  if (permission !== "granted") return null

  const token = await getToken(messaging, {
    vapidKey: "BBaT65T-1xDXSMj2vi49NVscRnJXcc0T7lvPBekhyS-QXIrLn-vcIkzTncgHPjQ95pcBekM74GvqKA2z0nKVXA8",
  })

  return token
}

export const onForegroundMessage = (callback) => {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("FCM payload received:", payload);
    callback(payload);
  });

  return unsubscribe;
};


