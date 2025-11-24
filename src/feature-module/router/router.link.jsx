import { Route } from "react-router";
import { all_routes } from "./all_routes";
import Error404 from "../pages/error/error-404";
import Error500 from "../pages/error/error-500";
import UnderMaintenance from "../pages/underMaintenance";
import ComingSoon from "../pages/comingSoon";
import BlankPage from "../pages/blankPage";

const routes = all_routes;

// Minimal public routes - only essential pages
export const publicRoutes = [
    {
        path: routes.error404,
        element: <Error404 />,
        route: Route,
    },
    {
        path: routes.error500,
        element: <Error500 />,
        route: Route,
    },
    {
        path: routes.underMaintenance,
        element: <UnderMaintenance />,
        route: Route,
    },
    {
        path: routes.comingSoon,
        element: <ComingSoon />,
        route: Route,
    },
    {
        path: routes.blankPage,
        element: <BlankPage />,
        route: Route,
    },
];

// Minimal auth routes - only essential pages
export const authRoutes = [
    {
        path: routes.comingSoon,
        element: <ComingSoon />,
        route: Route,
    },
];
