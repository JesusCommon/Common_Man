import type { RouteObject } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];