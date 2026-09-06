import type { RouteObject } from "react-router-dom";
import GuestRoute from "@/components/layout/GuestRoute";
import Home from "@/pages/home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export const authRoutes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: (
          <GuestRoute redirectTo="/dashboard">
            <Home />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestRoute redirectTo="/dashboard">
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute redirectTo="/dashboard">
        <Register />
      </GuestRoute>
    ),
  },
];