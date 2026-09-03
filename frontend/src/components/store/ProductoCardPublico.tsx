import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
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

  return (
    <div
      onClick={() => navigate(`/tienda/${producto.slug}`)}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-10 h-10 text-gray-400" />
        )}
        {producto.stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Agotado
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-gray-900 truncate">{producto.nombre}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{producto.descripcion_breve}</p>

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-lg font-bold text-emerald-600">
            {formatPrecio(producto.precio)}
          </span>
          <Button
            variant="primary"
            size="sm"
            disabled={producto.stock === 0}
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
            title="Agregar al carrito"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}