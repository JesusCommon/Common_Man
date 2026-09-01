import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { navigationConfig } from "@/config/NavegationConfig";

export function AdminToolbar() {
  const location = useLocation();

  const findTitle = (pathname: string): string => {
    const directModule = navigationConfig.find(m => m.route === pathname);
    if (directModule) return directModule.label;
    
    for (const module of navigationConfig) {
      if (module.children) {
        const child = module.children.find(c => c.route === pathname);
        if (child) return child.label;
      }
    }
    
    return "Panel Administrativo";
  };

  const title = findTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}