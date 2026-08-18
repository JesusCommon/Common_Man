import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UsuarioDetalle } from "./UsuarioDetalle";
import type { UsuarioAdminResponse } from "@/api/types";

interface UsuarioDetalleModalProps {
  usuario: UsuarioAdminResponse;
  onClose: () => void;
}

export function UsuarioDetalleModal({ usuario, onClose }: UsuarioDetalleModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={usuario.nombre} size="lg" variant="primary" />
          <div>
            <h2 className="text-lg font-bold text-white">
              {usuario.nombre} {usuario.apellido || ""}
            </h2>
            <p className="text-sm text-slate-500">@{usuario.username}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <UsuarioDetalle usuario={usuario} />

      <div className="px-6 pb-5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            usuario.activo
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          <StatusBadge active={usuario.activo} activeLabel="Cuenta activa" inactiveLabel="Cuenta inactiva" />
        </span>
      </div>
    </Modal>
  );
}