import { onForegroundMessage } from "@/firebase/notificationsHelper";
import AuthProvider from "./authContext";
import SponsorDashboardProvider from "./dashboard/sponsorDashboardContext";

import { useEffect } from "react";

export const AppProvider = ({ children }) => {

  useEffect(() => {
  const unsubscribe = onForegroundMessage(() => {
    window.dispatchEvent(new Event("notification-received"));
  });

  return () => unsubscribe?.();
}, []);
  return (
    <AuthProvider>
      <SponsorDashboardProvider>{children}</SponsorDashboardProvider>
    </AuthProvider>
  );
};
