import type { RouteObject } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout"; 
import Tienda from "@/pages/tienda/Tienda";
import ProductoDetalle from "@/pages/tienda/ProductosDetalles";

export const publicRoutes: RouteObject[] = [
  {
    element: <StoreLayout />, 
    children: [
      { path: "/tienda", element: <Tienda /> },
      { path: "/tienda/:slug", element: <ProductoDetalle /> },
    ],
  },
];