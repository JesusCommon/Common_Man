import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import { UsuariosPage } from "../pages/UsuariosPage";
import { CategoriaLibroPage } from "../pages/CategoriaLibro";
import { HomePage } from "../pages/home"
import { CategoriaProductoPage } from "../pages/CategoriaProducto"
import { ProductosPage } from "../pages/ProductosPage"
import { TiendaPage } from "../pages/TiendaPage"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.USUARIOS} element={<UsuariosPage />} />
        <Route path={ROUTES.CATEGORIAS_LIBRO} element={<CategoriaLibroPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CATEGORIA_PRODUCTO} element={<CategoriaProductoPage />} />
        <Route path={ROUTES.PRODUCTOS} element={<ProductosPage />} />
        <Route path={ROUTES.TIENDA_PRODUCTO} element={<TiendaPage />} />
      </Routes>
    </BrowserRouter>
  );
}