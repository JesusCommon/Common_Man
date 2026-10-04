import { useEffect, useRef, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface BookReaderModalProps {
  titulo: string;
  urlLectura: string;
  onClose: () => void;
}

export function BookReaderModal({ titulo, urlLectura, onClose }: BookReaderModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      try {
        const page = await pdf.getPage(paginaActual);

        if (cancelado) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvas,
          viewport,
        }).promise;
      } catch {
        if (cancelado) return;
        setError("Error al renderizar la página.");
      }
    };

    renderizarPagina();

    return () => {
      cancelado = true;
    };
  }, [pdf, paginaActual]);

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

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-6xl max-h-[95vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{titulo}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDescargar}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Descargar copia personal"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 p-4">
          {cargando ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Cargando PDF...</p>
            </div>
          ) : error ? (
            <div className="text-center space-y-3">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <canvas ref={canvasRef} className="max-w-full max-h-full shadow-lg" />
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
            <span className="text-sm font-medium text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>
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