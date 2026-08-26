import { useParams, Link } from "react-router-dom";
import { useObtenerProductoPorSlug } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Package } from "lucide-react";

export default function ProductoDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const { data: producto, isLoading, isError, error } = useObtenerProductoPorSlug(slug!);

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (isError || !producto) return <ErrorAlert error={error} fallback="Producto no encontrado" />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/tienda" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-24 h-24 text-slate-700" />
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{producto.nombre}</h1>
            <p className="text-slate-500 mt-2">{producto.descripcion_breve}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-emerald-400">${producto.precio.toLocaleString()}</span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${producto.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {producto.stock > 0 ? `${producto.stock} en stock` : "Agotado"}
            </span>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-white">Descripción</h3>
            <p className="text-slate-400 whitespace-pre-wrap">{producto.descripcion || "Sin descripción detallada."}</p>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            className="w-full md:w-auto"
            disabled={producto.stock === 0}
            // Aquí conectarías con tu lógica de carrito o checkout
            onClick={() => console.log("Agregar al carrito:", producto.id)}
          >
            {producto.stock > 0 ? "Agregar al Carrito" : "Producto Agotado"}
          </Button>
        </div>
      </div>
    </div>
  );
}