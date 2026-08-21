import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  useObtenerPerfilPublico, 
  useVerificarSiSigue, 
  useSeguir, 
  useDejarDeSeguir,
  useSeguidoresDe,
  useSeguidosDe
} from "@/hooks";
import { useAuthStore } from "@/store";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { UserListModal } from "@/components/perfil/UserListModal";
import { 
  ArrowLeft, Calendar, AtSign, UserPlus, UserCheck, Loader2, Users 
} from "lucide-react";
import { motion } from "framer-motion";

export default function PerfilPublico() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.username === username;

  // 1. Datos del perfil
  const { data: perfil, isLoading, isError, error } = useObtenerPerfilPublico(username || "");

  // 2. Lógica de Follows (Botón principal)
  const { data: sigueData, isLoading: isLoadingFollowStatus } = useVerificarSiSigue(
    username || "",
    { enabled: !!currentUser && !isOwnProfile }
  );
  const isFollowing = sigueData?.data === true;
  const { mutate: seguir, isPending: isSeguirPending } = useSeguir();
  const { mutate: dejarDeSeguir, isPending: isDejarDeSeguirPending } = useDejarDeSeguir();
  const isPending = isSeguirPending || isDejarDeSeguirPending;

  // 3. Contadores (Usamos limit: 1 para obtener solo el "total" de la paginación de forma eficiente)
  const { data: seguidoresData } = useSeguidoresDe(username || "", 0, 1);
  const { data: seguidosData } = useSeguidosDe(username || "", 0, 1);
  const seguidoresCount = seguidoresData?.total || 0;
  const seguidosCount = seguidosData?.total || 0;

  // 4. Estado del Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"seguidores" | "seguidos">("seguidores");

  const openModal = (type: "seguidores" | "seguidos") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleToggleFollow = () => {
    if (!username) return;
    if (isFollowing) {
      dejarDeSeguir(username);
    } else {
      seguir({ username });
    }
  };

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
          {/* Avatar + Nombre + Acciones */}
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {perfil.nombre} {perfil.apellido || ""}
                </h1>
                <StatusBadge active={perfil.activo} />
              </div>
              <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                <AtSign className="w-4 h-4" />
                {perfil.username}
              </p>
              
              {/* Botones de Acción Dinámicos */}
              <div className="mt-4 flex flex-wrap gap-3">
                {!isOwnProfile && currentUser ? (
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    size="sm"
                    onClick={handleToggleFollow}
                    disabled={isPending || isLoadingFollowStatus}
                    className="min-w-40px"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : isFollowing ? (
                      <UserCheck className="w-4 h-4 mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    {isPending ? "Procesando..." : isFollowing ? "Dejar de seguir" : "Seguir"}
                  </Button>
                ) : isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={() => navigate("/perfil")} className="min-w-40px">
                    Editar perfil
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="min-w-40">
                    Iniciar sesión para seguir
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 👈 NUEVO: Contadores Clicables estilo Red Social */}
          <div className="flex gap-6 mb-6 border-b border-slate-800 pb-4">
            <button 
              onClick={() => openModal("seguidos")}
              className="group flex flex-col items-start hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-bold text-white">{seguidosCount}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide group-hover:text-blue-400 transition-colors">Seguidos</span>
            </button>
            <button 
              onClick={() => openModal("seguidores")}
              className="group flex flex-col items-start hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-bold text-white">{seguidoresCount}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wide group-hover:text-blue-400 transition-colors">Seguidores</span>
            </button>
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

          {/* Info adicional */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4" /> Información pública
              </h2>
            </div>
            <div className="divide-y divide-slate-800/50">
              <InfoRow icon={AtSign} label="Username" value={`@${perfil.username}`} />
              <InfoRow icon={Calendar} label="Fecha de registro" value={fechaFormateada} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 👈 NUEVO: Modal de Lista de Usuarios */}
      <UserListModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        username={username || ""} 
        type={modalType} 
      />
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

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