import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UsuarioUpdateSchema } from "@/schemas";
import type { UsuarioUpdateInput } from "@/schemas";
import { usePerfil, useActualizarPerfil } from "@/hooks";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function Perfil() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { data: perfil, isLoading } = usePerfil();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UsuarioUpdateInput>({
    resolver: zodResolver(UsuarioUpdateSchema),
  });

  // Preview de avatar en tiempo real
  const avatarUrl = watch("avatar");

  useEffect(() => {
    if (perfil) {
      reset({
        nombre: perfil.nombre,
        apellido: perfil.apellido || undefined,
        username: perfil.username,
        telefono: perfil.telefono || undefined,
        correo: perfil.correo,
        bio: perfil.bio || undefined,
        avatar: perfil.avatar || undefined,
      });
    }
  }, [perfil, reset]);

  const { mutate, isPending, isError, error, isSuccess, data } = useActualizarPerfil();

  useEffect(() => {
    if (isSuccess && data) {
      if (data.data) setUser(data.data);
      const timer = setTimeout(() => navigate("/dashboard"), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, data, navigate, setUser]);

  const onSubmit = (values: UsuarioUpdateInput) => {
    mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al dashboard
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user?.nombre?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Editar perfil</h1>
          <p className="text-sm text-slate-500">Actualiza tu información personal</p>
        </div>
      </div>

      {isSuccess ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-medium">{data?.mensaje}</p>
          <p className="text-slate-500 text-sm mt-1">Redirigiendo...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">URL del avatar</label>
            <input
              {...register("avatar")}
              type="url"
              placeholder="https://ejemplo.com/mi-foto.jpg"
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
            />
            {errors.avatar && <p className="mt-1 text-xs text-red-400">{errors.avatar.message}</p>}
            <p className="mt-1 text-xs text-slate-600">Pega el enlace directo de tu imagen.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Nombre</label>
              <input {...register("nombre")} className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50" />
              {errors.nombre && <p className="mt-1 text-xs text-red-400">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Apellido</label>
              <input {...register("apellido")} className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50" />
              {errors.apellido && <p className="mt-1 text-xs text-red-400">{errors.apellido.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Username</label>
            <input {...register("username")} className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50" />
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Correo</label>
            <input {...register("correo")} type="email" className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50" />
            {errors.correo && <p className="mt-1 text-xs text-red-400">{errors.correo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Teléfono</label>
            <input {...register("telefono")} placeholder="+584121234567" className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50" />
            {errors.telefono && <p className="mt-1 text-xs text-red-400">{errors.telefono.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Bio</label>
            <textarea {...register("bio")} rows={3} maxLength={280} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 resize-none" />
            {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>}
          </div>

          {isError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">{(error as Error)?.message || "Error al actualizar"}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      )}
    </div>
  );
}