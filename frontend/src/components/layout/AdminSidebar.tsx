import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { navigationConfig, type NavChild, type NavModule } from "@/config/NavegationConfig";
import { ChevronDown, ChevronRight, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Sincronización con la URL sin provocar renders en cascada
  useEffect(() => {
    if (isInitialMount.current) {
      // En el primer render, calculamos el estado inicial directamente
      const mod = navigationConfig.find(m =>
        m.route === location.pathname || m.children?.some((c: NavChild) => c.route === location.pathname)
      );
      setExpandedModuleId(mod ? mod.id : null);
      isInitialMount.current = false;
      return;
    }

    // En navegaciones posteriores, usamos la forma funcional para que React 
    // omita el render si el ID no ha cambiado realmente.
    setExpandedModuleId(current => {
      const mod = navigationConfig.find(m =>
        m.route === location.pathname || m.children?.some((c: NavChild) => c.route === location.pathname)
      );
      const targetId = mod ? mod.id : null;
      return current === targetId ? current : targetId;
    });
  }, [location.pathname]);

  const toggleModule = (id: string) => {
    setExpandedModuleId(prev => (prev === id ? null : id));
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-tight">Common Man</h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-blue-400" />
          Panel de administración
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationConfig.map((module: NavModule) => {
          const isExpanded = expandedModuleId === module.id;
          const hasChildren = Boolean(module.children && module.children.length > 0);
          
          const isParentActive = hasChildren 
            ? module.children!.some((child: NavChild) => location.pathname === child.route)
            : location.pathname === module.route;

          return (
            <div key={module.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                aria-expanded={isExpanded}
                aria-controls={`menu-${module.id}`}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isParentActive
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <module.icon className="w-4 h-4" />
                  <span>{module.label}</span>
                </div>
                {hasChildren && (
                  isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {hasChildren && isExpanded && (
                  <motion.div
                    id={`menu-${module.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pr-2 py-1 space-y-1 border-l border-slate-800 ml-4">
                      {module.children!.map((child: NavChild) => (
                        <NavLink
                          key={child.route}
                          to={child.route}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              isActive
                                ? "bg-blue-500/15 text-blue-400 font-medium"
                                : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-300"
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.nombre?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.nombre || "Admin"}</p>
            <p className="text-xs text-slate-500 truncate">@{user?.username || "admin"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}