// pages/TiendaPage.jsx
import { useProductos } from "../hooks/productos/useProductos";
import { useCategoriaProducto } from "../hooks/categorias/useCategorias";
import { Spinner } from "../components/ui/Spinner";
import { ErrorText } from "../components/ui/ErrorText";

export function TiendaPage() {
  const { productos, loading, error } = useProductos();
  const { categorias } = useCategoriaProducto();

  // Mapa rápido para mostrar el NOMBRE de categoría, no el ObjectId
  const nombreCategoria = (categoriaId) =>
    (categorias ?? []).find((c) => c.id === categoriaId)?.nombre ?? "Sin categoría";

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorText>{error}</ErrorText></div>;

  const disponibles = (productos ?? []).filter((p) => p.disponible);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestra Tienda</h1>

      {disponibles.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No hay productos disponibles por ahora.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {disponibles.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              categoria={nombreCategoria(producto.categoria)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductoCard({ producto, categoria }) {
  const precioConDescuento = producto.descuento
    ? producto.precio * (1 - producto.descuento / 100)
    : null;

  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {producto.fotografia ? (
          <img
            src={producto.fotografia}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Sin imagen</span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          {categoria}
        </span>
        <h3 className="font-semibold text-gray-900 truncate">{producto.nombre}</h3>

        <div className="flex items-center gap-2 mt-1">
          {precioConDescuento ? (
            <>
              <span className="text-lg font-bold text-green-600">
                ${precioConDescuento.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${producto.precio.toFixed(2)}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                -{producto.descuento}%
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${producto.precio.toFixed(2)}
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500 mt-1">
          {producto.stock > 0 ? `${producto.stock} en stock` : "Sin stock"}
        </span>
      </div>
    </div>
  );
}