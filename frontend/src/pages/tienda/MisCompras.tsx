import { useState } from "react";
import { Link } from "react-router-dom";
import { useListarMisCompras } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import type { CompraResponse } from "@/api/types";

const PAGE_SIZE = 10;

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

const estadoStyles: Record<CompraResponse["estado"], string> = {
  pendiente: "bg-amber-50 text-amber-600 border-amber-200",
  pagado: "bg-blue-50 text-blue-600 border-blue-200",
  enviado: "bg-indigo-50 text-indigo-600 border-indigo-200",
  entregado: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelado: "bg-red-50 text-red-600 border-red-200",
};

export default function MisCompras() {
  const [page, setPage] = useState(1);
  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const query = useListarMisCompras(params);

  if (query.isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (query.isError) return <ErrorAlert error={query.error} fallback="Error al cargar tus compras" />;

  const compras = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Compras</h1>
        <p className="text-gray-500 text-sm">Historial de tus órdenes realizadas.</p>
      </div>

      {compras.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center space-y-4">
          <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto" />
          <p className="text-gray-500">Aún no has realizado ninguna compra.</p>
          <Link to="/tienda">
            <Button variant="primary">Explorar Tienda</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200 overflow-hidden">
            {compras.map((c) => (
              <Link
                key={c.id}
                to={`/tienda/mis-compras/${c.numero_orden}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-gray-900">{c.numero_orden}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${estadoStyles[c.estado]}`}
                    >
                      {c.estado}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(c.fecha_creacion)} · {c.items.length}{" "}
                    {c.items.length === 1 ? "producto" : "productos"}
                  </p>
                </div>

                <span className="font-bold text-gray-900">{formatPrecio(c.total)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}