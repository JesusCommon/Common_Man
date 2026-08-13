import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Password from "./pages/Password";
import Buscar from "./pages/Buscar";
import RecargarSaldo from "./pages/RecargarSaldo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rutas protegidas con layout compartido */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/password" element={<Password />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/recargar" element={<RecargarSaldo />} />
      </Route>
    </Routes>
  );
}

export default App;