import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Home from "@/pages/home";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { adminRoutes } from "./admin.routes";
import { publicRoutes } from "./public.route"

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
  ...publicRoutes
];

export default function AppRoutes() {
  return useRoutes(routes);
}