import AuthProvider from "./authContext";
import SponsorDashboardProvider from "./dashboard/sponsorDashboardContext";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <SponsorDashboardProvider>{children}</SponsorDashboardProvider>
    </AuthProvider>
  );
};
