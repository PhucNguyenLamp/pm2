import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import publicRoutes from "./publicRoutes";
import privateRoutes from "./privateRoutes";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            ...privateRoutes,
        ],
    },
    ...publicRoutes,
]);

export default router;
