import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useObtenerCompraPorNumeroOrden,
  useCancelarCompra,
  useProcesarPago,
} from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Package,
  Copy,
  Check,
  XCircle,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import type { CompraResponse } from "@/api/types";

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

const mensajeError = (err: unknown): string =>
  typeof err === "string"
    ? err
    : err instanceof Error
    ? err.message
    : "No se pudo completar la acción.";

export default function CompraDetalle() {
  const { orden } = useParams<{ orden: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const query = useObtenerCompraPorNumeroOrden(orden!);
  const cancelar = useCancelarCompra();
  const pagar = useProcesarPago();

  if (query.isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (query.isError || !query.data)
    return <ErrorAlert error={query.error} fallback="Compra no encontrada" />;

  const c = query.data;
  const puedePagar = c.estado === "pendiente";

  const errorAccion = pagar.error ?? cancelar.error;

  const handleCopiar = () => {
    navigator.clipboard.writeText(c.numero_orden).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePagar = () => {
  pagar.mutate({ compraId: c.id });
 };

  const handleCancelar = () => {
  if (!confirm("¿Seguro que deseas cancelar esta orden?")) return;
    cancelar.mutate(
      { compraId: c.id },
      { onSuccess: () => navigate("/tienda/mis-compras") }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link
        to="/tienda/mis-compras"
        className="inline-flex items-center text-gray-500 hover:text-gray-900 text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Mis compras
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orden {c.numero_orden}</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4" /> {formatDate(c.fecha_creacion)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${estadoStyles[c.estado]}`}
          >
            {c.estado}
          </span>
          <button
            type="button"
            onClick={handleCopiar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-xs text-gray-600"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado" : "Copiar #"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200 overflow-hidden">
        {c.items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {item.nombre_producto_snapshot}
              </p>
              <p className="text-xs text-gray-500">
                {item.cantidad} x {formatPrecio(item.precio_unitario)}
              </p>
            </div>
            <span className="font-semibold text-gray-900 text-sm">
              {formatPrecio(item.subtotal)}
            </span>
          </div>
        ))}

        <div className="p-4 bg-gray-50 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{formatPrecio(c.subtotal)}</span>
          </div>
          {c.descuento > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Descuento</span>
              <span>-{formatPrecio(c.descuento)}</span>
            </div>
          )}
          {c.impuestos > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Impuestos</span>
              <span>{formatPrecio(c.impuestos)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-900 text-lg font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrecio(c.total)}</span>
          </div>
        </div>
      </div>

      {c.notas && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notas</p>
          <p className="text-sm text-gray-700">{c.notas}</p>
        </div>
      )}

      {puedePagar && (
        <div className="space-y-4">
          {errorAccion && (
            <ErrorAlert
              error={new Error(mensajeError(errorAccion))}
              fallback="No se pudo completar la acción."
            />
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={handleCancelar}
              disabled={cancelar.isPending || pagar.isPending}
            >
              <XCircle className="w-4 h-4 mr-2 text-red-500" />
              {cancelar.isPending ? "Cancelando..." : "Cancelar Orden"}
            </Button>
            <Button
              variant="primary"
              onClick={handlePagar}
              disabled={pagar.isPending || cancelar.isPending}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {pagar.isPending ? "Procesando..." : `Pagar ${formatPrecio(c.total)}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}