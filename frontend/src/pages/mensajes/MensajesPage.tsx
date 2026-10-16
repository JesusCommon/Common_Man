import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConversacionesSidebar } from "@/components/mensajes/ConversacionesSidebar";
import { ChatWindow } from "@/components/mensajes/ChatWindow";

export default function MensajesPage() {
  const [searchParams] = useSearchParams();
  const [conversacionActivaId, setConversacionActivaId] = useState<string | null>(null);

  useEffect(() => {
    const convId = searchParams.get("conversacion");
    if (convId && !conversacionActivaId) {
      setConversacionActivaId(convId);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, conversacionActivaId]);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-[#f3eee5]">
      <div className={`${conversacionActivaId ? "hidden lg:flex" : "flex"} h-full`}>
        <ConversacionesSidebar
          conversacionActivaId={conversacionActivaId}
          onSelect={setConversacionActivaId}
        />
      </div>
      <div className={`${conversacionActivaId ? "flex" : "hidden lg:flex"} flex-1 h-full`}>
        <ChatWindow
          conversacionId={conversacionActivaId}
          onCerrar={() => setConversacionActivaId(null)}
        />
      </div>
    </div>
  );
}