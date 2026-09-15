import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConfiguracionSidebar } from "@/components/configuracion/ConfiguracionSidebar";
import { PerfilTab } from "@/components/configuracion/tabs/PerfilTab";
import { CuentaTab } from "@/components/configuracion/tabs/CuentaTab";
import { SeguridadTab } from "@/components/configuracion/tabs/SeguridadTab";

export default function Configuracion() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabInicial = searchParams.get("tab") || "perfil";
  const [tabActivo, setTabActivo] = useState(tabInicial);

  function handleTabChange(tab: string) {
    setTabActivo(tab);
    setSearchParams({ tab });
  }

  function renderTab() {
    switch (tabActivo) {
      case "perfil":
        return <PerfilTab />;
      case "cuenta":
        return <CuentaTab />;
      case "seguridad":
        return <SeguridadTab />;
      default:
        return <PerfilTab />;
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <ConfiguracionSidebar tabActivo={tabActivo} onTabChange={handleTabChange} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}