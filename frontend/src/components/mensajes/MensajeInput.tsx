import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";

interface MensajeInputProps {
  onEnviar: (contenido: string) => void;
  disabled?: boolean;
}

export function MensajeInput({ onEnviar, disabled }: MensajeInputProps) {
  const [texto, setTexto] = useState("");

  function handleEnviar() {
    const limpio = texto.trim();
    if (!limpio || disabled) return;
    onEnviar(limpio);
    setTexto("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  }

  return (
    <div className="flex items-end gap-2 p-4 border-t border-[#e4dccd] bg-white">
      <EmojiPicker onSelect={(emoji) => setTexto((prev) => prev + emoji)} />

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={2000}
        placeholder="Escribe un mensaje… (Enter para enviar, Shift+Enter para salto)"
        className="flex-1 resize-none rounded-xl border border-[#e4dccd] bg-[#fbf9f4] px-4 py-2.5 text-sm focus:border-[#b23a2f] focus:outline-none focus:ring-1 focus:ring-[#b23a2f] max-h-32"
      />

      <button
        onClick={handleEnviar}
        disabled={disabled || !texto.trim()}
        className="p-2.5 rounded-full bg-[#b23a2f] text-white hover:bg-[#8f2d24] transition disabled:opacity-40 disabled:cursor-not-allowed"
        title="Enviar"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}