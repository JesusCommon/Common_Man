import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { navigationConfig } from "@/config/NavegationConfig";

export function AdminSidebar() {
  const location = useLocation();
  const [manualExpanded, setManualExpanded] = useState<string | null>(null);

  const autoExpanded = useMemo(() => {
    const currentPath = location.pathname;
    
    for (const module of navigationConfig) {
      if (module.route === currentPath) {
        return null;
      }
      
      if (module.children) {
        const isChildActive = module.children.some(
          child => child.route === currentPath
        );
        if (isChildActive) {
          return module.id;
        }
      }
    }
    
    return null;
  }, [location.pathname]);

  const expanded = manualExpanded ?? autoExpanded;

  const toggleExpand = (id: string) => {
    setManualExpanded(prev => {
      if (prev === id || autoExpanded === id) {
        return null;
      }
      return id;
    });
  };

  const isActive = (route: string) => location.pathname === route;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3">
        <Avatar name="Admin" variant="primary" size="sm" />
        <div>
          <p className="text-sm font-bold text-gray-900">Common Man</p>
          <p className="text-xs text-gray-500">Panel Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationConfig.map((item) => {
          const hasChildren = !!item.children;
          const active = hasChildren 
            ? item.children!.some(child => location.pathname === child.route)
            : isActive(item.route!);

          const Icon = item.icon;

          return (
            <div key={item.id}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    {expanded === item.id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expanded === item.id && (
                    <div className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                      {item.children!.map((child) => (
                        <NavLink
                          key={child.route}
                          to={child.route}
                          className={({ isActive }) =>
                            cn(
                              "block px-3 py-2 rounded-lg text-sm transition-colors",
                              isActive
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.route!}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}