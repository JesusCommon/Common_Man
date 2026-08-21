import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserMinus, Loader2 } from "lucide-react";
import { useSeguidoresDe, useSeguidosDe, useDejarDeSeguir } from "@/hooks";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  type: "seguidores" | "seguidos";
}

export function UserListModal({ isOpen, onClose, username, type }: UserListModalProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  
  // ✅ FIX: Solo mostrar botón si es el perfil propio
  const isOwnProfile = currentUser?.username === username;

  const { data: seguidoresData, isLoading: isLoadingSeguidores } = useSeguidoresDe(
    username,
    0,
    20,
    { enabled: isOpen && type === "seguidores" }
  );

  const { data: seguidosData, isLoading: isLoadingSeguidos } = useSeguidosDe(
    username,
    0,
    20,
    { enabled: isOpen && type === "seguidos" }
  );

  const data = type === "seguidores" ? seguidoresData : seguidosData;
  const isLoading = type === "seguidores" ? isLoadingSeguidores : isLoadingSeguidos;

  const { mutate: dejarDeSeguir, isPending } = useDejarDeSeguir();

  const handleUnfollow = (e: React.MouseEvent, targetUsername: string) => {
    e.stopPropagation();
    dejarDeSeguir(targetUsername);
  };

  const handleNavigate = (targetUsername: string) => {
    navigate(`/perfil/${targetUsername}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <h2 className="text-lg font-semibold text-white capitalize">
                {type === "seguidores" ? "Seguidores" : "Seguidos"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : !data || data.items.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No hay {type === "seguidores" ? "seguidores" : "seguidos"} para mostrar.</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {data.items.map((item) => {
                    const targetUser = type === "seguidores" ? item.seguidor : item.seguido;

                    return (
                      <li
                        key={item.identificador}
                        onClick={() => handleNavigate(targetUser.username)}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                            {targetUser.avatar ? (
                              <img
                                src={targetUser.avatar}
                                alt={targetUser.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                {targetUser.nombre.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                              {targetUser.nombre} {targetUser.apellido || ""}
                            </p>
                            <p className="text-xs text-slate-500 truncate">@{targetUser.username}</p>
                          </div>
                        </div>

                        {/* ✅ FIX: Solo mostrar si es tu propio perfil */}
                        {isOwnProfile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleUnfollow(e, targetUser.username)}
                            disabled={isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <span className="hidden sm:inline text-xs">Dejar de seguir</span>
                                <UserMinus className="w-4 h-4 sm:hidden" />
                              </>
                            )}
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}