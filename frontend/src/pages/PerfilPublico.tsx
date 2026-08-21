import { useParams, useNavigate } from "react-router-dom";
import { useObtenerPerfilPublico } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLeft, Calendar, Shield, AtSign } from "lucide-react";
import { motion } from "framer-motion";

export default function PerfilPublico() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { data: perfil, isLoading, isError, error } = useObtenerPerfilPublico(username || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !perfil) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <ErrorAlert error={error} fallback="Usuario no encontrado o no existe" />
      </div>
    );
  }

  const fechaFormateada = perfil.fecha_creacion
    ? new Date(perfil.fecha_creacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Cover */}
      <div className="relative h-48 sm:h-56 bg-linear-to-br from-blue-600/20 via-indigo-900/20 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-24px_24px" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-slate-950 to-transparent" />

        <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Avatar + Nombre */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-slate-950 overflow-hidden shadow-2xl bg-slate-900 shrink-0">
              {perfil.avatar ? (
                <img src={perfil.avatar} alt={perfil.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                  {perfil.nombre.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 mb-0.5 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {perfil.nombre} {perfil.apellido || ""}
                </h1>
                <StatusBadge active={perfil.activo} />
              </div>
              <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                <AtSign className="w-4 h-4" />
                {perfil.username}
              </p>
            </div>
          </div>

          {/* Bio */}
          {perfil.bio && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <p className="text-slate-300 text-sm leading-relaxed">{perfil.bio}</p>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <StatCard
              icon={Shield}
              label="Estado"
              value={perfil.activo ? "Activo" : "Inactivo"}
              color={perfil.activo ? "emerald" : "red"}
            />
            <StatCard
              icon={Calendar}
              label="Miembro desde"
              value={fechaFormateada}
              color="blue"
            />
          </div>

          {/* Info adicional */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60">
              <h2 className="text-sm font-semibold text-white">Información pública</h2>
            </div>
            <div className="divide-y divide-slate-800/50">
              <InfoRow icon={AtSign} label="Username" value={`@${perfil.username}`} />
              <InfoRow
                icon={Calendar}
                label="Fecha de registro"
                value={fechaFormateada}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "emerald" | "blue" | "red" | "slate";
}) {
  const colors = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    slate: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };

  return (
    <div className={`p-4 rounded-xl border text-center ${colors[color]}`}>
      <Icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
      <p className="text-base font-bold truncate">{value}</p>
      <p className="text-[10px] opacity-70 mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-slate-200 truncate">{value}</p>
      </div>
    </div>
  );
}