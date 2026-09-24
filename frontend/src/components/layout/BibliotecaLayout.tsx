import { Outlet, Link } from "react-router-dom";
import { BookMarked, ShoppingCart, User } from "lucide-react";

export default function BibliotecaLayout() {
  return (
    <div className="min-h-screen bg-[#f3eee5] text-[#221e19] flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[#e4dccd] bg-[#f3eee5]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/biblioteca" className="font-editorial text-xl font-semibold tracking-tight flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#b23a2f]" />
            Common Man <span className="text-[#b23a2f]">Biblioteca</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium text-[#8b8377]">
            <Link to="/biblioteca" className="hover:text-[#221e19] transition-colors">
              Biblioteca
            </Link>
            <Link to="/tienda" className="flex items-center gap-2 hover:text-[#221e19] transition-colors">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Tienda</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-[#221e19] transition-colors">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#e4dccd] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#8b8377]">
          <p>© {new Date().getFullYear()} Common Man Biblioteca.</p>
        </div>
      </footer>
    </div>
  );
}