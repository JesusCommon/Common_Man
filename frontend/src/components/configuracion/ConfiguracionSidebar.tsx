import { Link } from "react-router-dom";
import { User, Mail, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "cuenta", label: "Cuenta", icon: Mail },
  { id: "seguridad", label: "Seguridad", icon: Lock },
];

interface ConfiguracionSidebarProps {
  tabActivo: string;
  onTabChange: (tab: string) => void;
}

export function ConfiguracionSidebar({ tabActivo, onTabChange }: ConfiguracionSidebarProps) {
  const [colapsado, setColapsado] = useState(false);

  return (
    <div
      className={`relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        colapsado ? "w-16" : "w-56"
      }`}
    >
      <button
        onClick={() => setColapsado(!colapsado)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition z-10"
        title={colapsado ? "Expandir" : "Colapsar"}
      >
        {colapsado ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      <div className={`px-4 py-4 border-b border-gray-100 ${colapsado ? "px-2" : ""}`}>
        {!colapsado && (
          <h3 className="text-sm font-semibold text-gray-900">Configuración</h3>
        )}
      </div>

      <nav className="flex-1 py-2">
        {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => {
          const activo = tabActivo === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                colapsado ? "justify-center px-2" : ""
              } ${
                activo
                  ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title={colapsado ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!colapsado && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`px-4 py-4 border-t border-gray-100 ${colapsado ? "px-2" : ""}`}>
        {!colapsado && (
          <Link
            to="/dashboard"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            ← Volver al dashboard
          </Link>
        )}
      </div>
    </div>
  );
}