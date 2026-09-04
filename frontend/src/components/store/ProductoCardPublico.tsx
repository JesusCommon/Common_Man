import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import type { ProductoPublicResponse } from "@/api/types";
const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

export function ProductoCardPublico({ producto }: { producto: ProductoPublicResponse }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const agotado = producto.stock === 0;

  return (
    <div
      onClick={() => navigate(`/tienda/${producto.slug}`)}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer flex flex-col overflow-hidden group"
    >
      <div className="relative m-3 h-44 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package className="w-10 h-10 text-gray-400" />
        )}
        <span
          className={`absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full ${
            agotado
              ? "bg-red-500 text-white"
              : producto.stock <= 10
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          {agotado ? "Agotado" : `${producto.stock} disp.`}
        </span>
      </div>

      <div className="px-4 pb-4 pt-1 flex-1 flex flex-col gap-1.5">
        <h3 className="font-bold text-gray-900 truncate">{producto.nombre}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{producto.descripcion_breve}</p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrecio(producto.precio)}
          </span>
          <button
            type="button"
            disabled={agotado}
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: producto.id,
                nombre: producto.nombre,
                slug: producto.slug,
                precio: producto.precio,
                imagen: producto.imagen,
                stock: producto.stock,
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-green-400 shadow-md shadow-emerald-500/30 hover:from-emerald-600 hover:to-green-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}