import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import RecargarSaldo from "./pages/RecargarSaldo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/recargar"
        element={
          <ProtectedRoute>
            <RecargarSaldo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;