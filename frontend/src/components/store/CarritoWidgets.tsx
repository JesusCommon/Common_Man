import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore, selectCartTotal } from "@/store/useCartStore";

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const setCantidad = useCartStore((s) => s.setCantidad);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore(selectCartTotal);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Carrito de Compras</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <Package className="w-12 h-12 text-gray-300" />
              <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
              <Button variant="primary" size="sm" onClick={onClose}>
                Ir a la tienda
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3"
              >
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.nombre}</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatPrecio(item.precio)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setCantidad(item.id, item.cantidad - 1)}
                      className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center text-gray-900">
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCantidad(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1 rounded text-red-500 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total</span>
              <span className="text-xl font-bold text-gray-900">{formatPrecio(total)}</span>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                onClose();
                navigate("/tienda/checkout");
              }}
            >
              Finalizar Compra
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}