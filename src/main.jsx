import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { base_path } from "./environment";
import store from "./core/data/redux/store";
import { AppProvider } from "./contexts/AllProvider";
import { NetworkProvider } from "./contexts/NetworkContext";
import ALLRoutes from "./feature-module/router/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style/css/feather.css";
import "./style/icon/boxicons/boxicons/css/boxicons.min.css";
import "./style/icon/weather/weathericons.css";
import "./style/icon/typicons/typicons.css";
import "./style/icon/fontawesome/css/fontawesome.min.css";
import "./style/icon/fontawesome/css/all.min.css";
import "./style/icon/ionic/ionicons.css";
import "./style/icon/tabler-icons/webfont/tabler-icons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./index.css";
import { Toaster } from "sonner";
import { NotificationProvider } from "./contexts/NotificationContext";
import ScrollToTop from "./hooks/ScrollToTop";




const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}
// const token = window.localStorage.getItem("fcm_token")


ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <NetworkProvider>
        <AppProvider>
          <BrowserRouter basename={base_path}>
          <NotificationProvider>
             <ScrollToTop />
            <ALLRoutes />
            <Toaster richColors toastOptions={{
              style: { zIndex: 9999 },
            }} position="top-center" /> </NotificationProvider>
          </BrowserRouter>
        </AppProvider>
      </NetworkProvider>
    </Provider>
  </React.StrictMode>
);
