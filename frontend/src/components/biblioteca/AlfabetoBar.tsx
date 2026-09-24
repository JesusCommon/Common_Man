const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetBarProps {
  disponibles: Set<string>;
  activa: string;
  onJump: (letra: string) => void;
}

export function AlphabetBar({ disponibles, activa, onJump }: AlphabetBarProps) {
  const letraCls = (activaEs: boolean) =>
    `font-editorial w-8 h-8 rounded-full text-sm font-semibold transition-transform duration-200 ` +
    `hover:-translate-y-0.5 hover:scale-110 hover:text-[#b23a2f] ` +
    `disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:text-inherit ` +
    (activaEs ? "bg-[#b23a2f] text-white" : "text-[#221e19]");

  return (
    <div className="sticky top-16 z-30 -mx-2 px-2 py-3 bg-[#f3eee5]/90 backdrop-blur-md rounded-xl">
      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          onClick={() => onJump("")}
          className={`font-editorial px-3 py-1.5 rounded-full text-sm font-medium transition ${
            activa === "" ? "bg-[#221e19] text-[#f3eee5]" : "text-[#221e19] hover:text-[#b23a2f]"
          }`}
        >
          Todas
        </button>
        <span className="w-px h-5 bg-[#e4dccd] mx-1" />
        {LETRAS.map((l) => (
          <button key={l} disabled={!disponibles.has(l)} onClick={() => onJump(l)} className={letraCls(activa === l)}>
            {l}
          </button>
        ))}
        {disponibles.has("#") && (
          <button onClick={() => onJump("#")} className={letraCls(activa === "#")}>
            #
          </button>
        )}
      </div>
    </div>
  );
}