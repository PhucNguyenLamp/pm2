import ErrorBoundary from "@/pages/common/errors/ErrorBoundary";
// import PrivateHome from "@/pages/PrivateHome";
import { lazy } from "react";
import Home from "@/pages/Home";
import Logs from "@/pages/Logs";
import Account from "@/pages/Account";

const privateRoutes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "/logs",
        element: <Logs />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "/account",
        element: <Account />,
        errorElement: <ErrorBoundary />,
    },
    
];

export default privateRoutes;
