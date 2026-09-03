import type { RouteObject } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import Tienda from "@/pages/tienda/Tienda";
import ProductoDetalle from "@/pages/tienda/ProductosDetalles";
import CheckoutPage from "@/pages/tienda/CheckoutPage";
import MisCompras from "@/pages/tienda/MisCompras";
import CompraDetalle from "@/pages/tienda/CompraDetalle";

export const publicRoutes: RouteObject[] = [
  {
    element: <StoreLayout />,
    children: [
      { path: "/tienda", element: <Tienda /> },
      { path: "/tienda/:slug", element: <ProductoDetalle /> },
      { path: "/tienda/checkout", element: <CheckoutPage /> },
      { path: "/tienda/mis-compras", element: <MisCompras /> },
      { path: "/tienda/mis-compras/:orden", element: <CompraDetalle /> },
    ],
  },
];