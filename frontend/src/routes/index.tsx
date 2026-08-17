import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Home from "@/pages/home";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { adminRoutes } from "./admin.routes";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
];

export default function AppRoutes() {
  return useRoutes(routes);
}