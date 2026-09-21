import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { UsuarioDetalle } from "./UsuarioDetalle";
import type { UsuarioAdminResponse } from "@/api/types";

interface UsuarioDetalleModalProps {
  usuario: UsuarioAdminResponse;
  onClose: () => void;
}

export function UsuarioDetalleModal({ usuario, onClose }: UsuarioDetalleModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="px-6 py-5 border-b border-[#F4F4F5] flex items-start justify-between bg-white">
        <div className="flex items-center gap-4">
          <Avatar name={usuario.nombre} size="lg" variant="primary" />
          <div>
            <h2 className="text-lg font-bold text-[#18181B]">
              {usuario.nombre} {usuario.apellido || ""}
            </h2>
            <p className="text-sm text-[#52525B]">@{usuario.username}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[#F4F4F5] text-[#52525B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <UsuarioDetalle usuario={usuario} />

      <div className="px-6 pb-5 bg-white">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            usuario.activo
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {usuario.activo ? "✓ Cuenta activa" : "✕ Cuenta inactiva"}
        </span>
      </div>
    </Modal>
  );
}