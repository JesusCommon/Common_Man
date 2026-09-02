import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminToolbar } from "./AdminToolbar";

export default function AdminLayout() {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-gray-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminToolbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}