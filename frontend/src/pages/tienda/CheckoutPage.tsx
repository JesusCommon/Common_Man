import { useNavigate } from "react-router-dom";
import { useCrearCompra, useProcesarPago, useListarMisDirecciones } from "@/hooks";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useCartStore, selectCartTotal } from "@/store/useCartStore";
import { extraerMensajeError } from "@/lib/errors";
import { CheckCircle2, Package, ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { useState } from "react";
import type { CompraResponse } from "@/api/types";

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(precio);

type Paso = "resumen" | "pago" | "exito";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [paso, setPaso] = useState<Paso>("resumen");
  const [orden, setOrden] = useState<CompraResponse | null>(null);
  const crear = useCrearCompra();
  const pagar = useProcesarPago();
  const isPending = crear.isPending || pagar.isPending;
  const error = crear.error ?? pagar.error;

  const [direccionId, setDireccionId] = useState("");
  const direcciones = useListarMisDirecciones({ skip: 0, limit: 100 });
  const direccionPredeterminada =
    direcciones.data?.items?.find((d) => d.es_predeterminada)?.id ??
    direcciones.data?.items?.[0]?.id ??
    "";
  const direccionEfectiva = direccionId || direccionPredeterminada;

  const handleConfirmarOrden = () => {
    crear.mutate(
      {
        items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
        direccion_id: direccionEfectiva || undefined,
      },
      {
        onSuccess: (respuesta) => {
          clearCart();
          setOrden(respuesta.data);
          setPaso("pago");
        },
      }
    );
  };

  const handleProcesarPago = () => {
    if (!orden) return;
    pagar.mutate({ compraId: orden.id }, { onSuccess: () => setPaso("exito") });
  };

  if (paso === "exito") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center max-w-md w-full space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">¡Compra confirmada!</h1>
          <p className="text-gray-500 text-sm">
            Tu pago fue procesado. Orden:{" "}
            <span className="font-mono text-gray-900">{orden?.numero_orden}</span>
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => navigate("/tienda")}>
              Seguir comprando
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => navigate("/tienda/mis-compras")}>
              Ver mis compras
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paso === "resumen" && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <p className="text-gray-500">Tu carrito está vacío.</p>
          <Button variant="primary" onClick={() => navigate("/tienda")}>Ir a la Tienda</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <button
        type="button"
        onClick={() => navigate(paso === "pago" ? "/tienda" : "/tienda")}
        className="inline-flex items-center text-gray-500 hover:text-gray-900 text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Seguir comprando
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        {paso === "resumen" ? "Resumen de Compra" : `Pagar Orden ${orden?.numero_orden ?? ""}`}
      </h1>

      {error && (
        <ErrorAlert
          error={new Error(extraerMensajeError(error))}
          fallback="No se pudo procesar la compra."
        />
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200">
        {paso === "resumen"
          ? items.map((i) => (
              <div key={i.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{i.nombre}</p>
                  <p className="text-xs text-gray-500">{i.cantidad} x {formatPrecio(i.precio)}</p>
                </div>
                <span className="font-semibold text-gray-900 text-sm">{formatPrecio(i.cantidad * i.precio)}</span>
              </div>
            ))
          : orden?.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{it.nombre_producto_snapshot}</p>
                  <p className="text-xs text-gray-500">{it.cantidad} x {formatPrecio(it.precio_unitario)}</p>
                </div>
                <span className="font-semibold text-gray-900 text-sm">{formatPrecio(it.subtotal)}</span>
              </div>
            ))}

        <div className="flex items-center justify-between p-4 bg-gray-50">
          <span className="font-semibold text-gray-700">Total a pagar</span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrecio(paso === "resumen" ? total : orden?.total ?? 0)}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin className="w-4 h-4 text-blue-600" />
          Dirección de entrega
        </h2>

        {direcciones.isLoading ? (
          <p className="text-sm text-gray-500">Cargando direcciones...</p>
        ) : direcciones.data?.items?.length ? (
          <Select
            value={direccionEfectiva}
            onChange={setDireccionId}
            options={
              direcciones.data.items.map((d) => ({
                value: d.id,
                label: `${d.alias} — ${d.direccion}, ${d.ciudad}${d.es_predeterminada ? " (predeterminada)" : ""}`,
              }))
            }
            placeholder="Selecciona una dirección..."
          />
        ) : (
          <p className="text-sm text-gray-500">
            No tienes direcciones registradas.{" "}
            <button
              type="button"
              onClick={() => navigate("/direcciones")}
              className="text-blue-600 font-medium hover:underline"
            >
              Agregar una
            </button>
          </p>
        )}
      </div>

      {paso === "resumen" ? (
        <Button variant="primary" size="lg" className="w-full" disabled={isPending || !direccionEfectiva} onClick={handleConfirmarOrden}>
          {crear.isPending ? "Creando orden..." : "Confirmar Orden"}
        </Button>
      ) : (
        <Button variant="primary" size="lg" className="w-full" disabled={isPending} onClick={handleProcesarPago}>
          {pagar.isPending ? "Procesando pago..." : <><CreditCard className="w-4 h-4 mr-2" /> Pagar {formatPrecio(orden?.total ?? 0)}</>}
        </Button>
      )}
    </div>
  );
}