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
  ArrowLeft, Calendar, AtSign, UserPlus, UserCheck, Loader2, Bookmark
} from "lucide-react";
import { motion } from "framer-motion";

export default function PerfilPublico() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.username === username;

  const { data: perfil, isLoading, isError, error } = useObtenerPerfilPublico(username || "");

  const { data: sigueData, isLoading: isLoadingFollowStatus } = useVerificarSiSigue(
    username || "",
    { enabled: !!currentUser && !isOwnProfile }
  );
  const isFollowing = sigueData?.data === true;
  const { mutate: seguir, isPending: isSeguirPending } = useSeguir();
  const { mutate: dejarDeSeguir, isPending: isDejarDeSeguirPending } = useDejarDeSeguir();
  const isPending = isSeguirPending || isDejarDeSeguirPending;

  const { data: seguidoresData } = useSeguidoresDe(username || "", 0, 1);
  const { data: seguidosData } = useSeguidosDe(username || "", 0, 1);
  const seguidoresCount = seguidoresData?.total || 0;
  const seguidosCount = seguidosData?.total || 0;

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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !perfil) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#52525B] hover:text-[#18181B] transition-colors mb-6"
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

  const coverImage = perfil.avatar || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=400&fit=crop";

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#52525B] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-[#E4E4E1] overflow-hidden">
          
          {/* Cover Image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img 
              src={coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            
            <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
              <Bookmark className="w-4 h-4 text-[#18181B]" />
            </button>
          </div>

          {/* Contenido Principal */}
          <div className="relative px-6 sm:px-8 pb-8">
            
            {/* Avatar y Header */}
            <div className="flex flex-col sm:flex-row gap-4 -mt-12 mb-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-[#FAFAF8]">
                  {perfil.avatar ? (
                    <img src={perfil.avatar} alt={perfil.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-3xl font-bold text-white">
                      {perfil.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-white bg-white">
                  <StatusBadge active={perfil.activo} />
                </div>
              </div>

              <div className="flex-1 pt-2 sm:pt-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
                      {perfil.nombre} {perfil.apellido || ""}
                    </h1>
                    <p className="text-[#52525B] flex items-center gap-1.5 mt-1">
                      <AtSign className="w-4 h-4" />
                      @{perfil.username}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!isOwnProfile && currentUser ? (
                      <Button
                        variant={isFollowing ? "outline" : "primary"}
                        size="lg"
                        onClick={handleToggleFollow}
                        disabled={isPending || isLoadingFollowStatus}
                        className={isFollowing 
                          ? "bg-white text-[#18181B] border border-[#E4E4E1] hover:bg-[#FAFAF8]" 
                          : "bg-[#18181B] text-white hover:bg-[#18181B]/90 border-0"
                        }
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : isFollowing ? (
                          <UserCheck className="w-4 h-4 mr-2" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        {isPending ? "Procesando..." : isFollowing ? "Siguiendo" : "Seguir"}
                      </Button>
                    ) : isOwnProfile ? (
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => navigate("/perfil")}
                        className="bg-white text-[#18181B] border border-[#E4E4E1] hover:bg-[#FAFAF8]"
                      >
                        Editar perfil
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => navigate("/login")}
                        className="bg-white text-[#18181B] border border-[#E4E4E1] hover:bg-[#FAFAF8]"
                      >
                        Iniciar sesión
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {perfil.bio && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <p className="text-[#18181B] text-base leading-relaxed max-w-2xl">
                  {perfil.bio}
                </p>
              </motion.div>
            )}

            {/* Contadores */}
            <div className="flex gap-6 mb-6 pb-6 border-b border-[#E4E4E1]">
              <button 
                onClick={() => openModal("seguidos")}
                className="group flex flex-col items-start"
              >
                <span className="text-xl font-bold text-[#18181B]">{seguidosCount}</span>
                <span className="text-xs text-[#A1A19A] uppercase tracking-wide group-hover:text-[#2563EB] transition-colors">Seguidos</span>
              </button>
              <button 
                onClick={() => openModal("seguidores")}
                className="group flex flex-col items-start"
              >
                <span className="text-xl font-bold text-[#18181B]">{seguidoresCount}</span>
                <span className="text-xs text-[#A1A19A] uppercase tracking-wide group-hover:text-[#2563EB] transition-colors">Seguidores</span>
              </button>
            </div>

            {/* Info adicional */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E1] flex items-center justify-center">
                    <AtSign className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <span className="text-xs text-[#A1A19A] uppercase tracking-wide">Username</span>
                </div>
                <p className="text-sm font-medium text-[#18181B]">@{perfil.username}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E1] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <span className="text-xs text-[#A1A19A] uppercase tracking-wide">Fecha de registro</span>
                </div>
                <p className="text-sm font-medium text-[#18181B]">{fechaFormateada}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <UserListModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        username={username || ""} 
        type={modalType} 
      />
    </div>
  );
}