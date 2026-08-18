import { useState } from "react";
import { Copy, Fingerprint } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CopyFieldProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export function CopyField({ label, value, icon: Icon = Fingerprint }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
      <code className="text-sm text-slate-300 font-mono break-all">{value}</code>
    </div>
  );
}