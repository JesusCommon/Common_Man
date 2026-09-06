import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function GuestRoute({ children, redirectTo = "/dashboard" }: Props) {
  const navigate = useNavigate();
  
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && user && accessToken) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasHydrated, user, accessToken, navigate, redirectTo]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (user && accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}