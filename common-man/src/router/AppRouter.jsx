import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import { UsuariosPage } from "../pages/UsuariosPage";
import { CategoriaPage } from "../pages/CategoriasLibro";
import { HomePage } from "../pages/home"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.USUARIOS} element={<UsuariosPage />} />
        <Route path={ROUTES.CATEGORIAS_LIBRO} element={<CategoriaPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}