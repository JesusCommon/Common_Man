import { useEffect, useRef, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface BookReaderModalProps {
  titulo: string;
  urlLectura: string;
  onClose: () => void;
}

export function BookReaderModal({ titulo, urlLectura, onClose }: BookReaderModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [renderizando, setRenderizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(2.0);

  useEffect(() => {
    let cancelado = false;

    const cargarPDF = async () => {
      try {
        setCargando(true);
        setError(null);
        const loadingTask = pdfjsLib.getDocument({ url: urlLectura });
        const pdfDoc = await loadingTask.promise;

        if (cancelado) return;

        setPdf(pdfDoc);
        setTotalPaginas(pdfDoc.numPages);
        setCargando(false);
      } catch {
        if (cancelado) return;
        setError("No se pudo cargar el PDF. La URL puede haber expirado.");
        setCargando(false);
      }
    };

    cargarPDF();

    return () => {
      cancelado = true;
    };
  }, [urlLectura]);

  useEffect(() => {
    let cancelado = false;

    const renderizarPagina = async () => {
      if (!pdf || !canvasRef.current) return;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      setRenderizando(true);

      try {
        const page = await pdf.getPage(paginaActual);

        if (cancelado) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvas,
          viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;

        if (cancelado) return;

        setRenderizando(false);
      } catch (err) {
        if (cancelado) return;
        if ((err as Error).name !== "RenderingCancelledException") {
          setError("Error al renderizar la página.");
        }
        setRenderizando(false);
      }
    };

    renderizarPagina();

    return () => {
      cancelado = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdf, paginaActual, scale]);

  const handleDescargar = () => {
    const link = document.createElement("a");
    link.href = urlLectura;
    link.download = `${titulo}.pdf`;
    link.click();
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 1.0));
  };

  const resetZoom = () => {
    setScale(2.0);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl max-h-[98vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-4">
            {titulo}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg">
              <button
                onClick={zoomOut}
                disabled={scale <= 1.0}
                className="p-1.5 rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reducir zoom"
              >
                <ZoomOut className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition"
                title="Zoom por defecto"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={scale >= 4.0}
                className="p-1.5 rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <button
              onClick={handleDescargar}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Descargar copia personal"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto bg-gray-100 p-8 flex">
          {cargando ? (
            <div className="m-auto flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Cargando PDF...</p>
            </div>
          ) : error ? (
            <div className="m-auto text-center space-y-3">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div className="relative m-auto">
              <canvas
                ref={canvasRef}
                className="shadow-2xl bg-white block"
              />
              {renderizando && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>

        {!cargando && !error && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Página {paginaActual} de {totalPaginas}
              </span>
              <select
                value={paginaActual}
                onChange={(e) => setPaginaActual(Number(e.target.value))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
              >
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={paginaSiguiente}
              disabled={paginaActual === totalPaginas}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}