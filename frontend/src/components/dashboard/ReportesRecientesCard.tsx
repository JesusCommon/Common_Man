import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LifeBuoy, Plus, ArrowRight, Inbox } from "lucide-react";
import { useListarMisReportes } from "@/hooks";
import { EstadoBadge } from "@/components/reportes/EstadoBadge";

export function ReportesRecientesCard() {
  const navigate = useNavigate();
  const { data, isLoading } = useListarMisReportes({ skip: 0, limit: 3 });
  const reportes = data?.items ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-[#E4E4E1] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[#A1A19A] uppercase tracking-wider flex items-center gap-1.5">
          <LifeBuoy className="w-3.5 h-3.5" />
          Mis Reportes
        </h4>
        <button
          onClick={() => navigate("/soporte")}
          className="text-[11px] font-medium text-[#2563EB] hover:underline flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-6 flex justify-center">
          <div className="w-5 h-5 border-2 border-[#E4E4E1] border-t-[#18181B] rounded-full animate-spin" />
        </div>
      ) : reportes.length === 0 ? (
        <div className="py-4 text-center">
          <Inbox className="w-6 h-6 text-[#A1A19A] mx-auto mb-2" />
          <p className="text-xs text-[#52525B]">Aún no tienes reportes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reportes.map((reporte) => (
            <button
              key={reporte.id}
              onClick={() => navigate(`/soporte/${reporte.id}`)}
              className="w-full text-left rounded-xl border border-[#F4F4F5] bg-[#FAFAF8] px-3 py-2 hover:border-[#E4E4E1] hover:bg-white transition"
            >
              <p className="text-xs font-medium text-[#18181B] truncate">
                {reporte.asunto}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <EstadoBadge estado={reporte.estado} />
                <span className="text-[10px] text-[#A1A19A]">
                  {new Date(reporte.fecha_creacion).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/soporte")}
        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E4E4E1] px-3 py-2 text-xs font-medium text-[#52525B] hover:border-[#2563EB] hover:text-[#2563EB] transition"
      >
        <Plus className="w-3.5 h-3.5" />
        Crear reporte
      </button>
    </motion.div>
  );
}