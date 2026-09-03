import { useState } from "react";
import {
  useListarProductos,
  useListarCategoriasPublicas,
  useListarPorCategoria,
} from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { ProductoCardPublico } from "@/components/store/ProductoCardPublico";
import { Truck, ShieldCheck, Star, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductoPublicResponse } from "@/api/types";

type ListaPublica =
  | ProductoPublicResponse[]
  | { items: ProductoPublicResponse[]; total: number };

function extractItems(data: ListaPublica | undefined): ProductoPublicResponse[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.items;
}

const FEATURES = [
  { icon: Truck, title: "Envío Rápido", desc: "Entrega en 24-48h" },
  { icon: ShieldCheck, title: "Pago Seguro", desc: "Saldo protegido" },
  { icon: Star, title: "Mejor Calidad", desc: "Productos verificados" },
  { icon: Tag, title: "Ofertas", desc: "Descuentos semanales" },
] as const;

export default function Tienda() {
  const [categoriaId, setCategoriaId] = useState("");

  const todos = useListarProductos({ skip: 0, limit: 12 });
  const categorias = useListarCategoriasPublicas();
  const porCategoria = useListarPorCategoria(categoriaId);

  const current = categoriaId ? porCategoria : todos;
  const productos = extractItems(current.data);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 text-white p-10 md:p-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          Ofertas de temporada
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 max-w-xl leading-tight">
          Tecnología al mejor precio, hasta 15% dcto.
        </h2>
        <p className="text-blue-100 mt-4 max-w-md">
          La mejor tecnología, las ofertas más frescas.
        </p>
        <button
          type="button"
          onClick={() =>
            document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Comprar Ahora <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <f.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="productos" className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900">Productos Destacados</h2>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setCategoriaId("")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              !categoriaId
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            )}
          >
            Todos
          </button>
          {categorias.data?.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoriaId(c.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                categoriaId === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              )}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        {current.isLoading && <Spinner />}
        {current.isError && (
          <ErrorAlert error={current.error} fallback="Error al cargar productos" />
        )}

        {!current.isLoading && !current.isError && (
          productos.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No hay productos disponibles por el momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((p) => (
                <ProductoCardPublico key={p.id} producto={p} />
              ))}
            </div>
          )
        )}
      </section>
    </div>
  );
}