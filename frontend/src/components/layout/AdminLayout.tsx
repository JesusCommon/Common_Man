import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminToolbar } from "./AdminToolbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <AdminToolbar />
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}