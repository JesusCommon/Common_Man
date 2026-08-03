import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Aquí agregas más rutas cuando crees Login, Register, Dashboard... */}
    </Routes>
  );
}

export default App;