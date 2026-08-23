import { useLocation } from "react-router-dom";
import { navigationConfig, type NavChild, type ToolbarAction } from "@/config/NavegationConfig";
import { Button } from "@/components/ui/Button";

export function AdminToolbar() {
  const location = useLocation();

  const activeView = (() => {
    for (const module of navigationConfig) {
      if (module.route === location.pathname) {
        return { title: module.label, actions: [] as ToolbarAction[] };
      }
      const child = module.children?.find((c: NavChild) => c.route === location.pathname);
      if (child) {
        return { title: child.label, actions: child.toolbarActions ?? [] };
      }
    }
    return { title: "Panel", actions: [] as ToolbarAction[] };
  })();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-white">{activeView.title}</h2>
      
      <div className="flex items-center gap-2">
        {activeView.actions.map((action: ToolbarAction, idx: number) => (
          <Button
            key={idx}
            variant={action.variant || "ghost"} 
            size="sm"
            onClick={action.onClick}
            className="flex items-center gap-2"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </Button>
        ))}
      </div>
    </header>
  );
}