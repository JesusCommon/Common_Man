import type { RouteObject } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import BibliotecaLayout from "@/components/layout/BibliotecaLayout";
import Tienda from "@/pages/tienda/Tienda";
import ProductoDetalle from "@/pages/tienda/ProductosDetalles";
import Biblioteca from "@/pages/biblioteca/Biblioteca";

export const publicRoutes: RouteObject[] = [
  {
    element: <StoreLayout />,
    children: [
      { path: "/tienda", element: <Tienda /> },
      { path: "/tienda/:slug", element: <ProductoDetalle /> },
    ],
  },
  {
    element: <BibliotecaLayout />,
    children: [
      { path: "/biblioteca", element: <Biblioteca /> },
    ],
  },
];