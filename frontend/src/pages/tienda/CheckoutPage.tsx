import { useNavigate } from "react-router-dom";
import { useCrearCompra, useProcesarPago } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useCartStore, selectCartTotal } from "@/store/useCartStore";
import { CheckCircle2, Package, ArrowLeft, CreditCard } from "lucide-react";
import { useState } from "react";
import type { CompraResponse } from "@/api/types";

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

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
  const error = crear.error || pagar.error;

  const handleConfirmarOrden = () => {
    crear.mutate(
      { items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })) },
      {
        onSuccess: (respuesta) => {
          setOrden(respuesta.data);
          setPaso("pago");
        },
      }
    );
  };

  const handleProcesarPago = () => {
    if (!orden) return;
    pagar.mutate(
      { compraId: orden.id },
      {
        onSuccess: () => {
          clearCart();
          setPaso("exito");
        },
      }
    );
  };

  if (paso === "exito") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center max-w-md w-full space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">¡Compra confirmada!</h1>
          <p className="text-gray-500 text-sm">
            Tu pago fue procesado. Número de orden:{" "}
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

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <p className="text-gray-500">Tu carrito está vacío.</p>
          <Button variant="primary" onClick={() => navigate("/tienda")}>
            Ir a la Tienda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <button
        type="button"
        onClick={() => navigate(paso === "pago" ? "/tienda/checkout" : "/tienda")}
        className="inline-flex items-center text-gray-500 hover:text-gray-900 text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {paso === "pago" ? "Volver al resumen" : "Seguir comprando"}
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        {paso === "resumen" ? "Resumen de Compra" : "Procesar Pago"}
      </h1>

      {error && (
        <ErrorAlert
          error={error instanceof Error ? error : new Error("Error desconocido")}
          fallback="No se pudo procesar la compra."
        />
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-gray-900 text-sm">{i.nombre}</p>
              <p className="text-xs text-gray-500">
                {i.cantidad} x {formatPrecio(i.precio)}
              </p>
            </div>
            <span className="font-semibold text-gray-900 text-sm">
              {formatPrecio(i.cantidad * i.precio)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 bg-gray-50">
          <span className="font-semibold text-gray-700">Total a pagar</span>
          <span className="text-xl font-bold text-gray-900">{formatPrecio(total)}</span>
        </div>
      </div>

      {paso === "resumen" ? (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending}
          onClick={handleConfirmarOrden}
        >
          {crear.isPending ? "Creando orden..." : "Confirmar Orden"}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending}
          onClick={handleProcesarPago}
        >
          {pagar.isPending ? (
            "Procesando pago..."
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar {formatPrecio(total)}
            </>
          )}
        </Button>
      )}
    </div>
  );
}