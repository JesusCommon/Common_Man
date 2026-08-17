import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
];