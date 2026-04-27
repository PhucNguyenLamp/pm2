import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ErrorBoundary from "@/pages/common/errors/ErrorBoundary";

function BrokenComponent() {
    throw new Response("Broken!", { status: 500 });
}

const publicRoutes = [
    {
        path: "login",
        element: <Login />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "register",
        element: <Register />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "500",
        element: <BrokenComponent />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: "*",
        element: <div>Not Found</div>,
    }
];

export default publicRoutes;
