import { useState } from "react";
import { Smile } from "lucide-react";

const EMOJIS = [
  "😀","😂","🥰","😎","🤔","😅","😍","🙃","😉","😊",
  "👍","👎","","🙏","💪","🔥","✨","🎉","❤️","💔",
  "😢","😭","😡","🤯","","😴","🤝","👀","💡","📚",
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="p-2 rounded-full text-[#8b8377] hover:bg-[#f3eee5] hover:text-[#b23a2f] transition"
        title="Insertar emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {abierto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAbierto(false)} />
          <div className="absolute bottom-12 left-0 z-50 w-64 p-3 rounded-xl bg-white border border-[#e4dccd] shadow-xl grid grid-cols-8 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setAbierto(false);
                }}
                className="text-xl hover:bg-[#f3eee5] rounded p-1 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}