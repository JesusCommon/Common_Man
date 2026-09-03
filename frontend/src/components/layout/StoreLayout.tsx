import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, User, Package } from "lucide-react";
import { useState } from "react";
import { useCartStore, selectCartCount } from "@/store/useCartStore";
import { CartDrawer } from "@/components/store/CarritoWidgets";

export default function StoreLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useCartStore(selectCartCount);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/tienda" className="text-xl font-bold text-gray-900 tracking-tight">
            Common Man <span className="text-blue-600">Store</span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to="/tienda"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Tienda
            </Link>

            <Link
              to="/tienda/mis-compras"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Mis Compras</span>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              title="Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Common Man. Todos los derechos reservados.</p>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}