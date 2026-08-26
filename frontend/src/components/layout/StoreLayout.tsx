import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Header Público */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/tienda" className="text-xl font-bold text-white tracking-tight">
            Common Man <span className="text-blue-400">Store</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/tienda" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Tienda
            </Link>
            {/* Enlaces a login/registro o carrito irían aquí */}
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              <User className="w-4 h-4" />
              Mi Cuenta
            </Link>
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido de la Tienda */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Público */}
      <footer className="border-t border-slate-800 bg-slate-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Common Man. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}