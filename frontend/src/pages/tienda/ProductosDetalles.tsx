import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useObtenerProductoPorSlug } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, Package, ShoppingCart, Minus, Plus } from "lucide-react";

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

export default function ProductoDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [cantidad, setCantidad] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const { data: producto, isLoading, isError, error } = useObtenerProductoPorSlug(slug!);

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (isError || !producto) return <ErrorAlert error={error} fallback="Producto no encontrado" />;

  const handleAdd = () => {
    addItem(
      {
        id: producto.id,
        nombre: producto.nombre,
        slug: producto.slug,
        precio: producto.precio,
        imagen: producto.imagen,
        stock: producto.stock,
      },
      cantidad
    );
    setCantidad(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        to="/tienda"
        className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la tienda
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Imagen */}
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {producto.imagen ? (
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-24 h-24 text-gray-300" />
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
              <p className="text-gray-500 mt-2">{producto.descripcion_breve}</p>
            </div>

            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-4xl font-bold text-emerald-600">
                {formatPrecio(producto.precio)}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  producto.stock > 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {producto.stock > 0 ? `${producto.stock} en stock` : "Agotado"}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
                {producto.descripcion || "Sin descripción detallada."}
              </p>
            </div>

            {producto.stock > 0 && (
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="p-2 rounded text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium text-gray-900">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                  className="p-2 rounded text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
              disabled={producto.stock === 0}
              onClick={handleAdd}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {producto.stock > 0 ? "Agregar al Carrito" : "Producto Agotado"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}