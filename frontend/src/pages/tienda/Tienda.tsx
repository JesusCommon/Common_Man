import { useListarProductos } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import type { ProductoPublicResponse } from "@/api/types";

export default function Tienda() {
  const { data, isLoading, isError, error } = useListarProductos({ skip: 0, limit: 12 });

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (isError) return <ErrorAlert error={error} fallback="Error al cargar la tienda" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Nuestra Tienda</h1>
      
      {data?.items.length === 0 ? (
        <p className="text-slate-400">No hay productos disponibles por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.items.map((producto: ProductoPublicResponse) => (
            <Link 
              key={producto.id} 
              to={`/tienda/${producto.slug}`}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors"
            >
              <div className="aspect-square bg-slate-800 flex items-center justify-center relative">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <Package className="w-12 h-12 text-slate-600" />
                )}
                {producto.stock === 0 && (
                  <span className="absolute top-2 right-2 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded">
                    Agotado
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{producto.nombre}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{producto.descripcion_breve}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-emerald-400">${producto.precio.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">{producto.stock} disponibles</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}