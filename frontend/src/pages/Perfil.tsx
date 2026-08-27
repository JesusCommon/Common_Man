import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UsuarioUpdateSchema } from "@/schemas";
import type { UsuarioUpdateInput } from "@/schemas";
import { usePerfil, useActualizarPerfil } from "@/hooks";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertCircle, CheckCircle2, User } from "lucide-react";

export default function Perfil() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: perfil, isLoading } = usePerfil();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UsuarioUpdateInput>({
    resolver: zodResolver(UsuarioUpdateSchema),
  });

  const avatarUrl = useWatch({ control, name: "avatar" });

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

  const onSubmit = (values: UsuarioUpdateInput) => mutate(values);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E4E4E1] border-t-[#18181B] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <button onClick={() => navigate("/dashboard")} className="flex items-center text-sm text-[#52525B] hover:text-[#18181B] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al dashboard
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-2xl overflow-hidden shrink-0 shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user?.nombre?.charAt(0).toUpperCase() || <User className="w-8 h-8" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#18181B]">Editar perfil</h1>
          <p className="text-sm text-[#52525B]">Actualiza tu información personal</p>
        </div>
      </div>

      {isSuccess ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <p className="text-[#18181B] font-medium">{data?.mensaje}</p>
          <p className="text-[#52525B] text-sm mt-1">Redirigiendo...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 rounded-2xl border border-[#E4E4E1] shadow-sm">
          
          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">URL del avatar <span className="text-[#A1A19A] font-normal">(opcional)</span></label>
            <input {...register("avatar")} type="url" placeholder="https://ejemplo.com/mi-foto.jpg" className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#18181B] mb-1.5">Nombre <span className="text-[#A1A19A] font-normal">(opcional)</span></label>
              <input {...register("nombre")} className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
              {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#18181B] mb-1.5">Apellido <span className="text-[#A1A19A] font-normal">(opcional)</span></label>
              <input {...register("apellido")} className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
              {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">Username</label>
            <input {...register("username")} className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">Correo</label>
            <input {...register("correo")} type="email" className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            {errors.correo && <p className="mt-1 text-xs text-red-600">{errors.correo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">Teléfono <span className="text-[#A1A19A] font-normal">(opcional)</span></label>
            <input {...register("telefono")} placeholder="+584121234567" className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">Bio <span className="text-[#A1A19A] font-normal">(opcional)</span></label>
            <textarea {...register("bio")} rows={3} maxLength={280} className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none transition-all" />
            {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
          </div>

          {isError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error?.message || "Error al actualizar"}</p>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full bg-[#18181B] text-white hover:bg-[#18181B]/90 border-0" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      )}
    </div>
  );
}