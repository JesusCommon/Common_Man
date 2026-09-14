import { useState } from "react";
import type { ReporteCreateInput } from "@/schemas";

interface CrearReporteFormProps {
  onSubmit: (data: ReporteCreateInput) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const CATEGORIAS = [
  { value: "compra", label: "🛒 Compra" },
  { value: "producto", label: "📦 Producto" },
  { value: "pago", label: "💰 Pago" },
  { value: "envio", label: "🚚 Envío" },
  { value: "cuenta", label: "👤 Cuenta" },
  { value: "otro", label: "📋 Otro" },
] as const;

export function CrearReporteForm({ onSubmit, isLoading, onCancel }: CrearReporteFormProps) {
  const [categoria, setCategoria] = useState<string>("");
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigoReferencia, setCodigoReferencia] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {};

    if (!categoria) nuevosErrores.categoria = "Selecciona una categoría";
    if (asunto.trim().length < 3) nuevosErrores.asunto = "Mínimo 3 caracteres";
    if (descripcion.trim().length < 10) nuevosErrores.descripcion = "Mínimo 10 caracteres";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    onSubmit({
      categoria: categoria as ReporteCreateInput["categoria"],
      asunto: asunto.trim(),
      descripcion: descripcion.trim(),
      codigo_referencia: codigoReferencia.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIAS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setCategoria(value);
                setErrores((prev) => ({ ...prev, categoria: "" }));
              }}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                categoria === value
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errores.categoria && (
          <p className="mt-1 text-xs text-red-500">{errores.categoria}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asunto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={asunto}
          onChange={(e) => {
            setAsunto(e.target.value);
            setErrores((prev) => ({ ...prev, asunto: "" }));
          }}
          placeholder="Describe brevemente tu problema"
          maxLength={200}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errores.asunto && (
          <p className="mt-1 text-xs text-red-500">{errores.asunto}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código de referencia{" "}
          <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={codigoReferencia}
          onChange={(e) => setCodigoReferencia(e.target.value)}
          placeholder="Ej: ORD-20260910-1234"
          maxLength={50}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setErrores((prev) => ({ ...prev, descripcion: "" }));
          }}
          placeholder="Explica con detalle tu problema o consulta..."
          rows={5}
          maxLength={5000}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="mt-1 flex justify-between">
          {errores.descripcion ? (
            <p className="text-xs text-red-500">{errores.descripcion}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">
            {descripcion.length}/5000
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Crear reporte"}
        </button>
      </div>
    </form>
  );
}