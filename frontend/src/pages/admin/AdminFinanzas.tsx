import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { useObtenerWallet } from "@/hooks";

export default function AdminFinanzas() {
  const { data: walletData, isLoading } = useObtenerWallet();

  const saldo = walletData
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(walletData.saldo_plataforma)
    : "$ 0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Finanzas</h1>
        <p className="text-gray-500 text-sm">Gestión financiera y movimientos de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Wallet}
          label="Saldo Plataforma"
          value={isLoading ? "..." : saldo}
          iconClassName="text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Ingresos del Mes"
          value="$ 0"
          iconClassName="text-emerald-600"
        />
        <StatCard
          icon={TrendingDown}
          label="Egresos del Mes"
          value="$ 0"
          iconClassName="text-red-600"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Movimientos</h2>
        <p className="text-gray-500 text-sm">No hay movimientos recientes para mostrar.</p>
      </div>
    </div>
  );
}