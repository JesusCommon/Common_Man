import { Calendar, Mail, Phone, Wallet, Shield } from "lucide-react";
import { CopyField } from "@/components/ui/CopyField";
import { InfoItem } from "@/components/ui/InfoItem";
import type { UsuarioAdminResponse } from "@/api/types";

interface UsuarioDetalleProps {
  usuario: UsuarioAdminResponse;
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UsuarioDetalle({ usuario }: UsuarioDetalleProps) {
  return (
    <div className="px-6 py-5 space-y-4">
      <CopyField label="ID MongoDB" value={usuario.id} />
      <CopyField label="Identificador UUID" value={usuario.identificador} />

      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Correo" value={usuario.correo} icon={Mail} />
        <InfoItem label="Teléfono" value={usuario.telefono || "—"} icon={Phone} />
        <InfoItem
          label="Saldo"
          value={`$${usuario.saldo?.toLocaleString() || "0"}`}
          icon={Wallet}
          valueClassName="text-emerald-400 font-bold"
        />
        <InfoItem label="Rol" value={<span className="capitalize">{usuario.rol}</span>} icon={Shield} />
      </div>

      {usuario.bio && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
          <p className="text-xs text-slate-500 mb-1">Bio</p>
          <p className="text-sm text-slate-300">{usuario.bio}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Creado" value={formatFecha(usuario.fecha_creacion)} icon={Calendar} valueClassName="text-slate-300" />
        <InfoItem label="Actualizado" value={formatFecha(usuario.fecha_actualizacion)} icon={Calendar} valueClassName="text-slate-300" />
      </div>
    </div>
  );
}