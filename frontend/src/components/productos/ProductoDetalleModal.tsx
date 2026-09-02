import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Package,
  Fingerprint,
  Copy,
  Check,
  DollarSign,
  Boxes,
  Tag,
  CalendarDays,
  Pencil,
} from "lucide-react";
import type { ProductoAdminResponse } from "@/api/types";

interface Props {
  producto: ProductoAdminResponse;
  onClose: () => void;
}

function formatPrecio(precio: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function ProductoDetalleModal({ producto, onClose }: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(producto.id)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => setCopied(false));
  };

  const handleEdit = () => {
    onClose();
    navigate(`/admin/productos/editar/${producto.id}`);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalle del Producto">
      <div className="space-y-5">
        {/* Header con imagen y nombre */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900 truncate">
              {producto.nombre}
            </p>
            <p className="text-sm text-gray-500 truncate">{producto.slug}</p>
          </div>
        </div>

        {/* ID MongoDB */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <Fingerprint className="w-4 h-4" />
              ID MongoDB
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="text-sm font-mono text-gray-800 break-all">
            {producto.id}
          </p>
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <DollarSign className="w-4 h-4" />
              Precio
            </span>
            <p className="text-lg font-bold text-emerald-600">
              {formatPrecio(producto.precio)}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Boxes className="w-4 h-4" />
              Stock
            </span>
            <p
              className={`text-lg font-bold ${
                producto.stock > 10
                  ? "text-gray-700"
                  : producto.stock > 0
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {producto.stock} uds.
            </p>
          </div>
        </div>

        {/* Categoría */}
        {producto.categoria_id && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              <Tag className="w-4 h-4" />
              Categoría
            </span>
            <p className="text-sm font-mono text-gray-800 break-all">
              {producto.categoria_id}
            </p>
          </div>
        )}

        {/* Descripción breve */}
        {producto.descripcion_breve && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Descripción breve
            </span>
            <p className="text-sm text-gray-800">{producto.descripcion_breve}</p>
          </div>
        )}

        {/* Descripción completa */}
        {producto.descripcion && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Descripción completa
            </span>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {producto.descripcion}
            </p>
          </div>
        )}

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <CalendarDays className="w-4 h-4" />
              Creado
            </span>
            <p className="text-sm text-gray-500">
              {formatDate(producto.fecha_creacion)}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <CalendarDays className="w-4 h-4" />
              Actualizado
            </span>
            <p className="text-sm text-gray-500">
              {formatDate(producto.fecha_actualizacion)}
            </p>
          </div>
        </div>

        {/* Estado */}
        <div>
          <StatusBadge active={producto.activo} />
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="button" variant="primary" onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar Producto
          </Button>
        </div>
      </div>
    </Modal>
  );
}