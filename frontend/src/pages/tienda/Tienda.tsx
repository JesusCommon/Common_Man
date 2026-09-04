import { useEffect, useState } from "react";
import { useBuscarProductos, useListarCategoriasPublicas } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Button } from "@/components/ui/Button";
import { ProductoCardPublico } from "@/components/store/ProductoCardPublico";
import {
  Truck, ShieldCheck, Star, Tag, ArrowRight, Search, X, ChevronDown, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { extraerMensajeError } from "@/lib/errors";

const PAGE_SIZE = 15;

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const FEATURES = [
  { icon: Truck, title: "Envío Rápido", desc: "Entrega en 24-48h" },
  { icon: ShieldCheck, title: "Pago Seguro", desc: "Saldo protegido" },
  { icon: Star, title: "Mejor Calidad", desc: "Productos verificados" },
  { icon: Tag, title: "Ofertas", desc: "Descuentos semanales" },
] as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function Tienda() {
  const [categoriaId, setCategoriaId] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [stockMin, setStockMin] = useState("");
  const [aplicados, setAplicados] = useState<{
    precio_min?: number;
    precio_max?: number;
    stock_min?: number;
  }>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const busqueda = useDebounce(busquedaInput.trim(), 300);
  const categorias = useListarCategoriasPublicas();
  const query = useBuscarProductos({
    ...(busqueda ? { nombre: busqueda } : {}),
    ...(categoriaId ? { categoria_id: categoriaId } : {}),
    ...aplicados,
    skip: 0,
    limit: visibleCount,
  });

  const productos = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const hayMas = productos.length < total;

  const aplicarFiltros = () => {
    setAplicados({
      precio_min: precioMin !== "" ? Number(precioMin) : undefined,
      precio_max: precioMax !== "" ? Number(precioMax) : undefined,
      stock_min: stockMin !== "" ? Number(stockMin) : undefined,
    });
    setVisibleCount(PAGE_SIZE);
  };

  const limpiarFiltros = () => {
    setPrecioMin("");
    setPrecioMax("");
    setStockMin("");
    setAplicados({});
    setCategoriaId("");
    setBusquedaInput("");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 text-white p-10 md:p-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          Ofertas de temporada
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 max-w-xl leading-tight">
          Tecnología al mejor precio, hasta 15% dcto.
        </h2>
        <p className="text-blue-100 mt-4 max-w-md">La mejor tecnología, las ofertas más frescas.</p>
        <button
          type="button"
          onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Comprar Ahora <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {busqueda ? `Resultados para "${busqueda}"` : "Catálogo de Productos"}
          </h2>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={busquedaInput}
                onChange={(e) => {
                  setBusquedaInput(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Buscar productos..."
                className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {busquedaInput && (
                <button
                  type="button"
                  onClick={() => setBusquedaInput("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button variant="outline" onClick={() => setMostrarFiltros((v) => !v)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {mostrarFiltros && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Precio mín.</label>
              <input type="number" min={0} value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Precio máx.</label>
              <input type="number" min={0} value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} placeholder="999999" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Stock mín.</label>
              <input type="number" min={0} value={stockMin} onChange={(e) => setStockMin(e.target.value)} placeholder="1" className={inputClass} />
            </div>
            <Button variant="primary" onClick={aplicarFiltros}>Aplicar</Button>
            <Button variant="ghost" onClick={limpiarFiltros}>Limpiar</Button>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => { setCategoriaId(""); setVisibleCount(PAGE_SIZE); }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              !categoriaId ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            )}
          >
            Todos
          </button>
          {categorias.data?.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { setCategoriaId(c.id); setVisibleCount(PAGE_SIZE); }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                categoriaId === c.id ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              )}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        {query.isLoading && <Spinner />}
        {query.isError && (
          <ErrorAlert error={new Error(extraerMensajeError(query.error))} fallback="Error al cargar productos" />
        )}

        {!query.isLoading && !query.isError && (
          <>
            {productos.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">
                No se encontraron productos con los filtros actuales.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productos.map((p) => (
                  <ProductoCardPublico key={p.id} producto={p} />
                ))}
              </div>
            )}

            {hayMas && (
              <div className="flex flex-col items-center gap-2 pt-4">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Cargar más productos
                </Button>
                <p className="text-xs text-gray-400">
                  Mostrando {productos.length} de {total}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}