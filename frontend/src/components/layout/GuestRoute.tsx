import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store";

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function GuestRoute({ children, redirectTo = "/dashboard" }: Props) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  console.log("GuestRoute:", { hasHydrated, user: !!user, accessToken: !!accessToken, path: location.pathname });

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (user && accessToken) {
    console.log("Usuario autenticado, redirigiendo a", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}